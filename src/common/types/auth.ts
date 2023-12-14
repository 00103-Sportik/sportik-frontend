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

interface SuccessAuthResponse {
  message: string;
  data: AuthResponse | {};
}

interface ActivateRequest {
  email: string;
  activation_code: string;
}

export const mapPathToTitle = {
  '/signin': 'Authentication',
  '/signup': 'Registration',
};

export const hPathToTitle = {
  '/signin': 'Just take a step!',
  '/signup': 'Start your journey!',
};

export type { AuthRequest, UpdateRequest, ActivateRequest, AuthResponse, SuccessAuthResponse };
