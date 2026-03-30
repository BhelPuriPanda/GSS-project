import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Violations from './pages/Violations';
import MLSandbox from './pages/MLSandbox';

function App() {
  return (
    <div className="min-h-screen bg-[#05070a]">
      <Routes>
        {/* Auth Routes - Standalone */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Routes - Using Sidebar Layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/violations" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Violations />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/sandbox" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <MLSandbox />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
