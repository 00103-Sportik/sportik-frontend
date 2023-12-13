import { Route, Routes } from 'react-router-dom';
import { Layout } from '../common/components/layout/Layout.tsx';
import AuthLayout from '../pages/auth/authLayout/AuthLayout.tsx';
import Registration from '../pages/auth/registration/Registration.tsx';
import Login from '../pages/auth/login/Login.tsx';
import Profile from '../pages/profile/Profile.tsx';
import Workouts from '../pages/workouts/Workouts.tsx';
import { ProtectedRoute } from '../common/components/protectedRoute/ProtectedRoute.tsx';
import HRCalc from '../pages/hrCalc/HRCalc.tsx';
import Workout from '../pages/workout/Workout.tsx';
import Subtypes from '../pages/subtypes/Subtypes.tsx';
import Exercises from '../pages/exercises/Exercises.tsx';
import Exercise from '../pages/exercise/Exercise.tsx';
import Approaches from '../pages/approaches/Approaches.tsx';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/">
        <Route element={<Layout />}>
          <Route element={<AuthLayout />}>
            <Route path="signin" element={<Login />} />
            <Route path="signup" element={<Registration />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route index element={<Workouts />} />
            <Route path="workouts" element={<Workout />} />
            <Route path="workouts/:id" element={<Workout />} />
            <Route path="subtypes/:type" element={<Subtypes />} />
            <Route path="exercises/:type" element={<Exercises />} />
            <Route path="exercises" element={<Exercise />} />
            <Route path="approaches/:id" element={<Approaches />} />
            <Route path="hr-calc" element={<HRCalc />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
