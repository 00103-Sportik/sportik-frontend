interface AuthResponse {
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface SuccessAuthResponse {
  message: string;
  data: AuthResponse | {};
}

export const mapPathToTitle = {
  '/signin': 'Authentication',
  '/signup': 'Registration',
};

export const hPathToTitle = {
  '/signin': 'Just take a step!',
  '/signup': 'Start your journey!',
};

export type { AuthRequest, AuthResponse, SuccessAuthResponse };
