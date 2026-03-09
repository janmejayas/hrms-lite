# HRMS Lite — Human Resource Management System

A lightweight, production-ready HRMS web application for managing employees and daily attendance tracking.

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18 + Vite, React Router v6, Axios, Vanilla CSS |
| Backend    | Python 3.10+, FastAPI, Motor (async MongoDB driver), Pydantic v2 |
| Database   | MongoDB (local or MongoDB Atlas)                |
| Deployment | Frontend → Vercel  · Backend → Render · DB → MongoDB Atlas |

---

## ✨ Features

### Core
- **Employee Management** — Add, view, search, filter, and delete employees
- **Attendance Management** — Mark daily attendance (Present/Absent), toggle status, view history
- **Filters** — Filter attendance by employee and/or date
- **Dashboard** — Live stats: total employees, present/absent/not-marked today, department breakdown

### Bonus
- Attendance summary per employee (total days, present, absent, % rate)
- Department-wise headcount with progress bars
- Toast notifications for all actions
- Loading / empty / error states throughout

---

## 🚀 Running Locally

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **MongoDB** running locally on port 27017 (or MongoDB Atlas URI)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/hrms-lite.git
cd hrms-lite
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**  
API docs (Swagger): **http://localhost:8000/docs**

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

> The Vite dev server proxies `/api` → `http://localhost:8000` automatically.

---

### 4. Build for Production

```bash
cd frontend
npm run build       # outputs to dist/
npm run preview     # preview production build locally
```

---

## 🌐 Deployment Guide

### Backend → Render

1. Push `backend/` to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `MONGODB_URL` → your MongoDB Atlas connection string
5. Deploy — note the public URL (e.g. `https://hrms-lite-api.onrender.com`)

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variable:
   - `VITE_API_URL` → `https://hrms-lite-api.onrender.com/api`
4. Deploy — Vercel auto-detects Vite

### Database → MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user and whitelist `0.0.0.0/0` (all IPs) for Render
3. Copy the connection string and set it as `MONGODB_URL` in Render

---

## 📡 API Reference

| Method | Endpoint                              | Description                         |
|--------|---------------------------------------|-------------------------------------|
| GET    | `/api/dashboard/summary`              | Dashboard stats                     |
| POST   | `/api/employees`                      | Create employee                     |
| GET    | `/api/employees`                      | List all employees                  |
| DELETE | `/api/employees/{employee_id}`        | Delete employee + attendance        |
| POST   | `/api/attendance`                     | Mark attendance                     |
| GET    | `/api/attendance/{employee_id}`       | List records                        |

Full interactive docs available at `/docs` (Swagger UI).

---

## ⚙️ Vite Commands Reference

```bash
npm run dev        # Start development server (port 5173)
npm run build      # Build for production → dist/
npm run preview    # Preview production build locally
```

---

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── main.py              # FastAPI app — all routes + models
│   ├── models.py            # Pydantic models
│   ├── routes.py            # API routes
│   ├── database.py          # MongoDB setup
│   ├── requirements.txt
│   └── render.yaml          # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── api.js           # Axios API layer
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   └── Attendance.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        # Design system + global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
└── README.md
```

---

## ⚠️ Assumptions & Limitations

- **Single admin** — No authentication/authorization implemented (as per spec)
- **Employee ID** is a string (e.g. `EMP001`), not auto-generated — admin sets it manually
- **One attendance record per employee per day** — duplicate marking returns a 400 error
- **Department list** is a predefined set.
- **Leave / Payroll** are out of scope per spec.

---

## 📝 License

MIT — free to use and modify.
