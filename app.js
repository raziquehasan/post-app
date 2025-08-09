const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home page
app.get('/', (req, res) => {
    res.render("index");
});

// Login page
app.get('/login', (req, res) => {
    res.render("login");
});

// Profile page (protected)
app.get('/profile', isLoggedIn, async (req, res) => {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate({
            path: 'posts',
            populate: { path: 'user', select: 'username' }
        });

    res.render("profile", { user });
});

// Create a post
app.post('/post', isLoggedIn, async (req, res) => {
    let user = await userModel.findById(req.user.userid);
    let { content } = req.body;

    let post = await postModel.create({
        user: user._id,
        content,
        likes: 0 // default likes
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
});

// Like a post
app.get('/like-post/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    post.likes = (post.likes || 0) + 1;
    await post.save();

    res.redirect("/profile");
});

// Edit a post page
app.get('/edit-post/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found");

    res.render("edit", { post });
});

// Update post
app.post('/edit-post/:id', isLoggedIn, async (req, res) => {
    let { content } = req.body;
    await postModel.findByIdAndUpdate(req.params.id, { content });
    res.redirect("/profile");
});

// Logout
app.get('/logout', (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// Register user
app.post('/register', async (req, res) => {
    let { email, password, username, name, age } = req.body;

    let user = await userModel.findOne({ email });
    if (user) return res.status(400).send("User already exists");

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(500).send("Error generating salt");

        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.status(500).send("Error hashing password");

            let newUser = await userModel.create({
                email,
                password: hash,
                username,
                name,
                age
            });

            let token = jwt.sign({ email: newUser.email, userid: newUser._id }, "shhhh");
            res.cookie("token", token);
            res.send("User registered successfully");
        });
    });
});

// Login user
app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).send("User does not exist");

    bcrypt.compare(password, user.password, (err, result) => {
        if (err) return res.status(500).send("Error comparing passwords");
        if (!result) return res.status(400).send("Invalid password");

        let token = jwt.sign({ email: user.email, userid: user._id }, "shhhh");
        res.cookie("token", token);
        res.send("Login successful");
    });
});

// Middleware for authentication
function isLoggedIn(req, res, next) {
    if (!req.cookies.token) {
        return res.send("You must be logged in");
    }

    jwt.verify(req.cookies.token, "shhhh", (err, data) => {
        if (err) return res.send("You must be logged in");
        req.user = data;
        next();
    });
}

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
