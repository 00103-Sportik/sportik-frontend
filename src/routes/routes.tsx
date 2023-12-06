import { Route, Routes } from 'react-router-dom';
import { Layout } from '../common/components/layout/Layout.tsx';
import AuthLayout from '../pages/auth/authLayout/AuthLayout.tsx';
import Registration from '../pages/auth/registration/Registration.tsx';
import Login from '../pages/auth/login/Login.tsx';
// import { ProtectedRoute } from '../common/components/protectedRoute/ProtectedRoute.tsx';
import Profile from '../pages/profile/Profile.tsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route element={<Layout />}>
          <Route element={<AuthLayout />}>
            <Route path="signin" element={<Login />} />
            <Route path="signup" element={<Registration />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          {/* <Route element={<ProtectedRoute />}> */}
          {/*   Сюда потом сложить все роуты кроме реги и логина */}
          {/* </Route> */}
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
