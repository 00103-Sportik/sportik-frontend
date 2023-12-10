import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.ts';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors.ts';
import { hPathToTitle } from '../../../common/types/auth.ts';
import styles from './AuthLayout.module.css';

function AuthLayout() {
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <>
      <div className="title-container">
        <h1 className={location.pathname === '/signin' ? styles.loginStyleH1 : styles.regStyleH1}>Sportik+</h1>
        <h2 className={styles.loginStyleH2}>{hPathToTitle[location.pathname as keyof typeof hPathToTitle]}</h2>
      </div>
      <div className="auth-container">
        <Outlet />
      </div>
    </>
  );
}

export default AuthLayout;
