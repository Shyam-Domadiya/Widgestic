import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import DashboardLayout from '../components/layout/DashboardLayout';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import Dashboard from '../pages/Dashboard/Dashboard';
import PlanPage from '../pages/Plan/PlanPage';
import ProtectedRoute from './ProtectedRoute';

const PublicLayout = () => (
    <>
        <Header />
        <Outlet />
    </>
);

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <Dashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <Dashboard />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
            <Route path="/plan" element={
                <ProtectedRoute>
                    <DashboardLayout>
                        <PlanPage />
                    </DashboardLayout>
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
