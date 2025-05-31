import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProposalForm from "./pages/ProposalForm";
import { auth } from "./firebase";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function PrivateRoute({ children }: { children: React.ReactElement }) {
  return auth.currentUser ? children : <Navigate to="/" />;
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/proposal/new" element={<PrivateRoute><ProposalForm /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
