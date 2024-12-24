import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { userId: string; userRole: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};