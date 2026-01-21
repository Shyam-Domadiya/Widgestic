// src/components/layout/DashboardLayout.jsx
import React from 'react'
import Sidebar from './Sidebar'
import '../../pages/Dashboard/Dashboard.css'

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            {children}
        </div>
    )
}

export default DashboardLayout
