# 🎓 Intelligent Leave Priority System

> **Next-Generation Enterprise Educational ERP & Automated Priority Engine Platform**

[![Live Website](https://img.shields.io/badge/Live%20Website-Render-blue?style=for-the-badge&logo=render)](https://intelligent-leave-priority-system.onrender.com/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Theme-Crisp%20Blue%20%26%20White-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Live Website & Links

- **Live Application:** [https://intelligent-leave-priority-system.onrender.com/](https://intelligent-leave-priority-system.onrender.com/)
- **GitHub Repository:** [https://github.com/nishandhineePalanivel/intelligent-leave-priority-system](https://github.com/nishandhineePalanivel/intelligent-leave-priority-system)

---

## 🔑 Pre-Seeded Demo Login Credentials

The system includes pre-configured, bcrypt-hashed demo accounts for instant testing across all institutional roles:

| Role | Email / ID | Password | Access Scope & Permissions |
| :--- | :--- | :--- | :--- |
| **🎓 Student** | `student@college.edu` | `Student@123` | Submit leaves, track status, view GitHub/LeetCode analysis |
| **🎓 Student** | `bhavana@college.edu` | `Student@123` | Student dashboard & application tracker |
| **👨‍🏫 Staff (Advisor)** | `staff@college.edu` | `Staff@123` | Prioritized queue review, attendance risk warning, approve/reject |
| **🏛️ Vice Principal** | `vp@college.edu` | `Vp@123` | Executive department approval & high-priority leave queue |
| **👑 Administrator** | `admin@college.edu` | `Admin@123` | User Management, System Analytics, Audit Logs, Config Weights |

> [!IMPORTANT]
> The backend verifies that credentials match the selected portal role. Attempting to log into the Student portal using Administrator credentials returns a `403 Forbidden` error.

---

## 🌟 Key Features & Role Portals

### 🎨 Crisp Blue & White Enterprise Design
- Professional **Blue and White Educational ERP Theme** featuring crisp white cards (`bg-white`), royal blue headers (`bg-blue-600` / `bg-blue-900`), and high-contrast dark slate typography.

### 📝 Student Self-Registration
- Students can register directly on the login page by providing **Full Name**, **Email**, **Register Number**, **Set Password**, and selecting their **Academic Department** *(Computer Science, Information Technology, AI & Data Science, ECE, EEE, Mechanical, Civil)*.

### 🧠 Transparent 5-Factor Priority Scoring Engine
Calculates a 0–100 Priority Score ordering the leave queue so urgent requests are reviewed first:
1. **Reason Urgency & Validity (30%)**: Pre-categorized urgency scores (Medical, Placement, Emergency, Academic).
2. **Proof Document Strength (25%)**: Optical OCR text & consistency check (Name, Date, Reason match).
3. **Attendance & Academic Impact (20%)**: Flags requests dropping projected attendance below the **75% minimum threshold**.
4. **Academic & Technical Profile (15%)**: Supporting CGPA, GitHub, and LeetCode activity *(Non-punitive metric)*.
5. **Previous Leave History (10%)**: Evaluates leave frequency and clustering over past 30 days.

### 💻 GitHub & LeetCode Integration
- **GitHub Analyzer**: Fetches public repositories, followers, languages, and technical engagement score using the GitHub REST API.
- **LeetCode Analyzer**: Displays Easy, Medium, and Hard problem breakdown, total solved count, and consistency rating.

### 🔍 Inspect & Review Modal
- Detailed inspection modal showing full score breakdown, document OCR text, attendance drop projections, and functional **Approve** and **Reject** review action buttons with reviewer remarks.

### 🗑️ Clear Leave List Feature
- Dedicated **`Clear Leave List`** button in the Leave Applications & Review Queue tables equipped with confirmation modals.

### 👑 Administrator Control Panel
- **User Management**: Create student/staff accounts, disable accounts, reset passwords.
- **System Analytics**: Dynamic charts connected to backend database storage.
- **Security Audit Logs**: Immutable audit trail tracking user logins, leave submissions, approvals, and user modifications.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti, React Router DOM.
- **Backend:** Express.js, JWT Authentication (`jsonwebtoken`), Bcrypt Password Hashing (`bcryptjs`), CORS.
- **Database:** Persistent JSON Database Service (`database.json`).
- **Integrations:** GitHub REST API, LeetCode Public API.

---

## 🚀 Local Installation & Setup

```bash
# 1. Clone repository
git clone https://github.com/nishandhineePalanivel/intelligent-leave-priority-system.git

# 2. Navigate into project directory
cd intelligent-leave-priority-system

# 3. Install dependencies
npm install

# 4. Build Vite production assets
npm run build

# 5. Start Express server (http://localhost:5000)
npm start
```

---

## 🌐 Deploy to Render

1. Connect your repository to **Render Dashboard**.
2. Select **Static Site** or **Web Service**:
   - **Build Command:** `npm run build`
   - **Publish Directory / Start Command:** `dist` or `npm start`
3. Push to `main` branch to trigger automated deployment!

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
