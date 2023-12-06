import { useAppSelector } from '../../../store/hooks.ts';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors.ts';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../navbar/Navbar.tsx';

export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
