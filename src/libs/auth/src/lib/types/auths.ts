export type IAccessToken = {
  accessToken: string;
};

export type IAccessTokenPayload = {
  id: string;
  email: string;
};

export type IAuthConfirmToken = {
  authConfirmToken: number;
};

export type IRefreshToken = {
  userId: number;
  token: string;
};

export type IJwtConfig = {
  secret: string;
  expiresIn: string;
};

export const accessTokenConfig = (): IJwtConfig => ({
  secret: process.env.ACCESS_TOKEN_SECRET,
  expiresIn: '60m',
});

export const refreshTokenConfig = (): IJwtConfig => ({
  secret: process.env.REFRESH_TOKEN_SECRET,
  expiresIn: '60d',
});
