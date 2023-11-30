interface AuthResponse {
  accessToken: string | null;
  refreshToken: string | null;
  id: string | null;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface SuccessAuthResponse {
  message: string;
  data: {
    id: string;
  };
}

interface AuthLayoutProps {
  title: string;
}

export const mapPathToTitle = {
  '/signin': 'Вход',
  '/signup': 'Регистрация',
};

export type { AuthRequest, AuthResponse, SuccessAuthResponse, AuthLayoutProps };
