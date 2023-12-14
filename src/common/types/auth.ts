interface AuthResponse {
  access_token: string | null;
  refresh_token: string | null;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface UpdateRequest {
  refresh_token: string;
}
interface UpdateResponse {
  refresh_token: string;
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

export type { AuthRequest, UpdateRequest, UpdateResponse, AuthResponse, SuccessAuthResponse };
