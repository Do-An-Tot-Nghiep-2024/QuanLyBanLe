import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  allowedRoles: string[];
  userRole: string;
  redirectPath: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isLoggedIn, allowedRoles, userRole, redirectPath }) => {
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;