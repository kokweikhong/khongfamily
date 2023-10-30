export type User = {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = User & {
  accessToken: string;
  accessTokenExpiry: number;
  refreshToken: string;
  refreshTokenExpiry: number;
};
