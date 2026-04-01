import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Violations from './pages/Violations';
import Landing from './pages/Landing';

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
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
        
        {/* Default Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
