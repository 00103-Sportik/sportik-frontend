export interface ProfileRequest {
  email: string;
  name?: string;
  surname?: string;
  sex?: string;
  age?: number;
  height?: number;
  weight?: number;
  image?: string;
}

export interface ProfileResponse {
  message: string;
  data: ProfileRequest;
}

export interface AvatarUpdate {
  image: string;
}
