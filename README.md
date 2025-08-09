# Post App

A simple social app built with Node.js, Express, MongoDB, and EJS.  
Users can register, login, create posts, and like posts. The post-editing feature has been intentionally removed.

---

##  Features
- User Registration & Login (with password hashing & sessions)
- Create Posts & Like Posts
- Mobile-friendly design with Tailwind CSS
- Clean user interface using EJS templates

---

##  Project Structure
post-app/
├── models/
│ ├── user.js
│ └── post.js
├── views/
│ ├── register.ejs
│ ├── login.ejs
│ └── profile.ejs
├── public/ (static assets like CSS/JS/images)
├── app.js (main server file)
└── README.md (this file)

yaml
Copy
Edit

---

##  Setup & Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/raziquehasan/post-app.git
   cd post-app
Install Dependencies

bash
Copy
Edit
npm install
Configure MongoDB Connection
The app currently uses a direct connection to mongodb://127.0.0.1:27017/socialapp.
Adjust it in app.js if needed.

Ensure these EJS templates exist in views/:

register.ejs

login.ejs

profile.ejs

Start the Server

bash
Copy
Edit
npm start
or

bash
Copy
Edit
node app.js
Open in Browser
Go to http://localhost:3000 to register and use the app.

Future Improvements
You might consider enhancing the app by:

Adding user post-edit capability

Integrating environment variables with .env

Improving UI/UX and responsiveness

Adding comments or a REST API

Why This Matters
A clear README ensures collaborators—or future you—know how to use your project immediately, without confusion. 
GitHub Docs
