export interface ProfileRequest {
  email: string;
  name?: string;
  surname?: string;
  sex?: string;
  age?: string;
  height?: string;
  weight?: string;
  avatar?: string;
}

export interface ProfileResponse {
  message: string;
  data: ProfileRequest;
}

export interface AvatarUpdate {
  avatar: string;
}
