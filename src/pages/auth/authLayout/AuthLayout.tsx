import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.ts';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors.ts';

function AuthLayout() {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="auth-container">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
