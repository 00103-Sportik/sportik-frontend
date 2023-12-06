export interface ProfileResponse {
  email: string;
  name?: string;
  surname?: string;
  sex?: string;
  age?: string;
  height?: string;
  weight?: string;
  avatar?: string;
}

export interface AvatarUpdate {
  avatar: string;
}
