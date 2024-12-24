import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if the token sent from the client
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!!!');
    }

    // checking if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_token as string,
    ) as JwtPayload;

    const { userRole, userId, iat } = decoded;
    console.log('role: ', userRole);
    console.log('required role: ', requiredRoles);

    // check if the user exist
    const user = await User.isUserExistsByCustomId(userId);

    if (!user) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is not found!!');
    }

    // check if user is already deleted
    if (user.isDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!!');
    }

    // check if  the user is blocked
    if (user?.status === 'blocked') {
      throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked!!');
    }

    // check if the password changed time greater than the token iat then previous token should not work
    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !');
    }

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'You do not have the necessary permissions to access this resource!',
      );
    }

    req.user = decoded;
    next();
  });
};

export default auth;
