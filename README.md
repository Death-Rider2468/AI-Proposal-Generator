# 🧠 AI-Driven Proposal Generator

A web-based application that uses Generative AI to automate the creation of professional project proposals. Designed for consultants and freelancers, this tool streamlines the proposal writing process by generating high-quality content and exporting proposals in both PDF and DOCX formats.

## 🚀 Features

- 📝 Dynamic web form to input client-specific details (industry, timeline, modules, tech stack)
- 🤖 AI-generated and refined content using Google Gemini API
- 📄 Export proposals in **PDF** and **DOCX** formats
- 🔐 Secure user authentication via Firebase Auth
- 💾 Real-time data storage using Firebase Firestore
- 🎨 Clean, responsive UI with TailwindCSS and shadcn/ui components

## 🛠️ Tech Stack

| Layer           | Technologies Used                                          |
|----------------|------------------------------------------------------------|
| **Frontend**    | React, Vite, TypeScript, TailwindCSS, shadcn/ui            |
| **Backend**     | Node.js, Express.js                                        |
| **AI Integration** | Google Gemini API for Generative Text Content              |
| **Document Export** | pdf-lib (PDF), docx (Word)                               |
| **Database & Auth** | Firebase Firestore, Firebase Auth                        |
| **Styling/UI**  | TailwindCSS, shadcn/ui                                     |



## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Death-Rider2468/AI-Proposal-Generator.git
cd AI-Proposal-Generator


# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Start frontend
cd frontend
npm run dev

# Start backend
cd ../backend
npm run dev

