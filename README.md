<div align="center">

# ⚡ Bit-Interview AI — Next-Gen Adaptive Technical Interview Platform

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Gemini AI](https://img.shields.io/badge/AI_Engine-Gemini_2.5-8E44AD?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

*An AI-powered technical interviewer that adapts to your responses, evaluates system architecture and coding logic, parses PDF resumes, matches Job Descriptions, and anti-cheat proctors sessions in real-time.*

</div>

---

## 🌟 Key Features

### 🎙️ 1. Adaptive AI Live Interview Console
* **Real-time AI Audio & Voice Narration**: Integrated Web Speech API (`SpeechSynthesis` & `SpeechRecognition`) for hands-free voice-to-text answers and natural AI spoken follow-ups.
* **Integrated Monaco Code Editor**: Practice live coding challenges directly inside VS-Code powered Monaco editor supporting JavaScript, Python, C++, and Go.
* **Dynamic Difficulty Adjuster**: AI automatically scales interview difficulty from **Medium → Hard → Advanced** based on technical accuracy and explanation depth.

### 📄 2. Resume Intelligence Hub
* **PyMuPDF PDF Parsing**: Upload multi-page engineering resumes to extract technical skills, project trade-offs, work history, and education.
* **Context-Aware Interviewing**: The AI interviewer tailors technical questions directly to projects and stack listed on your uploaded resume.

### 🎯 3. ATS Job Description Matcher
* **Resume-to-JD Gap Analysis**: Paste any tech job description (e.g. Stripe, Vercel, Meta) to calculate an instant **ATS Match Score %**.
* **ATS Resume Optimizer**: Automatically generates high-impact bullet points and missing skill alerts to pass ATS screeners.
* **Dual-Context Practice**: Launch mock rounds combining your resume background with target company JD requirements.

### 🛡️ 4. AI Proctoring & Anti-Cheat Monitor
* **Real-Time Audit**: Detects browser tab switching, window blur events, and unauthorized device navigation.
* **Webcam Proctoring**: Live proctored video preview with real-time **Session Integrity Score %**.

### 📊 5. Comprehensive Diagnostic Scorecards & Analytics
* **Skill Radar & Readiness Trajectory**: Visual charts powered by Recharts tracking performance across System Architecture, Data Structures, APIs, and Databases.
* **Question-by-Question Deep Dive**: Detailed breakdown of every candidate submission, ideal model answer strategies, and time complexity analysis.
* **7-Day Technical Roadmap**: Tailored study recommendations to address identified technical gaps.

### 💼 6. Employer & Recruiter Talent Hub
* **Candidate Leaderboard**: Rank candidates by overall score, technical accuracy, and integrity ratings.
* **Talent Pipelines**: Track assessed applicants per Job Description.

---

## 🛠️ Technology Stack

### Frontend
| Tech | Description |
| :--- | :--- |
| **React 19** | Modern UI framework with hooks and state management |
| **Vite 8** | Ultra-fast lightning frontend build tool and dev server |
| **Tailwind CSS 4** | Light Mode design system with Indigo/Violet gradients |
| **Monaco Editor** | Production-grade code editor component |
| **Framer Motion** | Micro-animations and page transitions |
| **Recharts / Chart.js** | Interactive Radar & Readiness trajectory graphs |
| **Lucide React** | Sleek SVG iconography system |

### Backend & AI Engine
| Tech | Description |
| :--- | :--- |
| **FastAPI** | High-performance Python async web framework |
| **Uvicorn** | Lightning-fast ASGI server |
| **PyMuPDF (`fitz`)** | High-precision PDF resume text and layout extraction |
| **Gemini AI Engine** | LLM orchestrator for adaptive questions & scorecard grading |
| **Pydantic v2** | Data validation and settings management |

---

## 📁 Repository Structure

```
intervue-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardNavbar.jsx       # Frosted Light Navbar
│   │   │   ├── VoiceInterviewerControls.jsx # Speech-to-Text & TTS Controls
│   │   │   ├── MonacoCodeEditor.jsx      # In-browser Code IDE
│   │   │   ├── ProctoringWidget.jsx      # Anti-Cheat Audit Monitor
│   │   │   └── AnalyticsCharts.jsx       # Radar & Performance Trajectory
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx         # Candidate Command Center
│   │   │   ├── InterviewPage.jsx         # Live AI Interview Console
│   │   │   ├── ResumePage.jsx            # Resume Intelligence Hub
│   │   │   ├── JDAnalyzerPage.jsx        # ATS Resume & JD Matcher
│   │   │   ├── InterviewReportPage.jsx   # Post-Session Scorecard
│   │   │   └── RecruiterDashboardPage.jsx# Employer Talent Leaderboard
│   │   ├── index.css                     # Tailwind CSS tokens & Light Theme
│   │   └── App.jsx                       # React Router navigation
│   └── package.json
│
└── backend/
    ├── app/
    │   ├── main.py                       # FastAPI REST API entry point
    │   ├── routes/                       # Interview, Resume, JD & Recruiter endpoints
    │   └── services/                     # AI generation & PyMuPDF parser services
    └── requirements.txt
```

---

## ⚡ Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0+
* **Python**: v3.11+
* **pip** & **npm**

### 1. Backend Setup
```bash
# Navigate to backend directory
cd intervue-ai/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend will be running at `http://localhost:8000`.

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd intervue-ai/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend app will be live at `http://localhost:5173`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ by Khushal Kumar • Powered by Gemini AI & React</sub>
</div>
