// src/components/DashboardLayout.jsx
import React from 'react'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import './Dashboard.css'

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            {children || <Dashboard />}
        </div>
    )
}

export default DashboardLayout
