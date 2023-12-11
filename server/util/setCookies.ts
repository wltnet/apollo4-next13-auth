import Express from 'express';

export const setRefreshTokenCookie = (res: Express.Response, refreshToken: string) => {
  try {
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== "development",
    });
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
}

export const removeRefreshTokenCookie = (res: Express.Response) => {
  res.clearCookie('refreshToken');
}
