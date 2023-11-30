import { Route, Routes } from 'react-router-dom';
import { Layout } from '../common/components/layout/Layout.tsx';
import AuthLayout from '../pages/auth/authLayout/AuthLayout.tsx';
import Registration from '../pages/auth/registration/Registration.tsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route element={<Layout />}>
          <Route element={<AuthLayout />}>
            <Route path="signup" element={<Registration />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
