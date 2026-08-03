# PrepMe 🚀

PrepMe is an AI-powered interview preparation platform that helps students improve their placement readiness through resume analysis, AI-generated interview preparation, personalized learning roadmaps, and progress tracking.

> 🚧 **Project Status:** Actively under development.

---

# ✨ Features

## 🔐 Authentication
- User Registration
- User Login
- User Logout
- JWT Authentication
- Protected Routes
- Email Verification using Brevo
- HTTP-only Cookie Authentication
- Password Hashing (Argon2 & bcrypt)

---

## 🤖 AI Resume Analysis
- Resume Upload
- AI-powered Resume Analysis
- Resume Scoring
- Skill Gap Detection
- Personalized Improvement Suggestions

---

## 📚 Interview Preparation
- Technical Interview Questions
- Behavioral Interview Questions
- Personalized Preparation Roadmap
- AI-generated Learning Recommendations

---

## 📊 Progress Tracking
- Track roadmap completion
- Monitor learning progress
- Resume analysis history

---

# 🚧 Upcoming Features

## Authentication
- Refresh Token Rotation & Enhanced Session Management
- Forgot Password
- Reset Password via Email
- GitHub OAuth Authentication

## AI Features
- AI Mock Interview
- Voice-based Interview
- Camera Monitoring
- Company-specific Interview Preparation
- ATS Resume Optimization

## Dashboard
- Advanced Analytics
- Daily Study Planner
- Interview Performance Reports

---

# 🛠 Tech Stack

## Frontend
- React.js
- Vite
- React Router
- Axios
- Tailwind CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication & Security
- JWT
- Argon2
- bcrypt
- HTTP-only Cookies

## AI
- Google Gemini API

## Email Service
- Brevo SMTP

---

## 🏗 Development Methodology

This project follows an **Agile Iterative & Incremental Development** approach. Features are developed, tested, and integrated incrementally, enabling continuous improvement, easier maintenance, and scalable development.

**Development Flow:**

```text
Planning → Design → Development → Testing → Integration → Enhancement
```

# 📁 Project Structure

```text
PrepMe
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controller
│   │   ├── middleware
│   │   ├── model
│   │   ├── router
│   │   ├── services
│   │   ├── templates
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend
│   ├── src
│   │   ├── features
│   │   ├── header
│   │   ├── layouts
│   │   ├── App.jsx
│   │   ├── App.routes.jsx
│   │   └── main.jsx
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/prepme.git
cd prepme
```

---

## Backend

```bash
cd backend
npm install
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=

MONGODB_URI=

CLIENT_URL=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

GEMINI_API_KEY=

BREVO_SMTP_HOST=
BREVO_SMTP_PORT=
BREVO_SMTP_LOGIN=
BREVO_SMTP_PASSWORD=

MAIL_FROM=
```

---

# 📌 Development Status

| Feature | Status |
|---------|:------:|
| User Registration | ✅ |
| User Login | ✅ |
| User Logout | ✅ |
| JWT Authentication | ✅ |
| Email Verification | ✅ |
| Google OAuth Authentication | ✅ |
| Resume Upload | ✅ |
| Resume Analysis | ✅ |
| Resume Scoring | ✅ |
| Skill Gap Detection | ✅ |
| Technical Question Generation | ✅ |
| Behavioral Question Generation | ✅ |
| Personalized Preparation Roadmap | ✅ |
| Progress Tracking | ✅ |
| Refresh Token Authentication | ✅ |
| Forgot Password | 🚧 |
| GitHub OAuth Authentication | 🚧 |
| AI Mock Interview | ⏳ |
| ATS Resume Optimization | ⏳ |
| Company-specific Interview Preparation | ⏳ |
| Voice Interview | ⏳ |
| Camera Monitoring | ⏳ |

---

# 🗺 Roadmap

- [x] User Authentication
- [x] Email Verification
- [x] Google OAuth
- [x] Resume Upload
- [x] Resume Analysis
- [x] Resume Scoring
- [x] Skill Gap Detection
- [x] Technical Interview Questions
- [x] Behavioral Interview Questions
- [x] Personalized Preparation Roadmap
- [x] Progress Tracking
- [x] Refresh Token Authentication
- [ ] Forgot Password
- [ ] GitHub OAuth
- [ ] AI Mock Interview
- [ ] ATS Optimization
- [ ] Company-specific Preparation
- [ ] Voice Interview
- [ ] Camera Monitoring
- [ ] Deployment

---

# 📧 Author

**Parth**

Computer Science Student • Full Stack Developer • AI Enthusiast
