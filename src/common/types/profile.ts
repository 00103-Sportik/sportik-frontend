export interface ProfileRequest {
  email: string;
  name?: string;
  surname?: string;
  sex?: string;
  age?: number;
  height?: number;
  weight?: number;
  avatar?: string;
}

export interface ProfileResponse {
  message: string;
  data: ProfileRequest;
}

export interface AvatarUpdate {
  avatar: string;
}
