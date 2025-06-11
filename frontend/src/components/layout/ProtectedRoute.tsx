// src/components/layout/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  children: ReactNode; 
  allowedRoles: string[];
}

interface DecodedToken {
  role: string;
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps): JSX.Element => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/404" replace />;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/404" replace />;
    }
    return <>{children}</>; 
  } catch (error) {
    return <Navigate to="/404" replace />;
  }
};

export default ProtectedRoute;
