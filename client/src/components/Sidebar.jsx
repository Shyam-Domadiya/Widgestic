// src/components/Sidebar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Dashboard.css'

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Icons (using simple SVGs to avoid dependency issues)
    const DashboardIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    )

    const AnalyticsIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
    )

    const PlanIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    )

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
                <span>Widgetic</span>
            </div>

            <nav className="sidebar-nav">
                <Link to="/dashboard" className={`nav-item ${currentPath === '/dashboard' ? 'active' : ''}`}>
                    <DashboardIcon />
                    Dashboard
                </Link>
                <Link to="/analytics" className={`nav-item ${currentPath === '/analytics' ? 'active' : ''}`}>
                    <AnalyticsIcon />
                    Analytics
                </Link>
                <Link to="/plan" className={`nav-item ${currentPath === '/plan' ? 'active' : ''}`}>
                    <PlanIcon />
                    Plan
                </Link>
            </nav>

            <div className="sidebar-footer">
                <div className="avatar">T</div>
                <div className="user-info">
                    <span className="user-name">test</span>
                    <Link to="/logout" className="logout-link">Logout</Link>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
