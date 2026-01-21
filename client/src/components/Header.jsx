// src/components/Header.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logo-icon">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
        </svg>
        <span className="logo-text">Widgetic</span>
      </div>
      <nav className="header-nav">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-btn">Register</Link>
      </nav>
    </header>
  )
}

export default Header
