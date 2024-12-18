import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // if the token sent from the client
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!!!');
    }

    // verify a token symmetric
    jwt.verify(token, config.jwt_access_token as string, function (err, decoded) {
      if(err){
        throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid token! You are not authorized!!!');
      }

      const role = (decoded as JwtPayload).userRole;
      console.log("role: ", role)
      console.log("required role: ", requiredRoles)
      if(requiredRoles && !requiredRoles.includes(role)){
        throw new AppError(StatusCodes.FORBIDDEN, 'You do not have the necessary permissions to access this resource!');
      }

      // decoded undefined
      req.user = decoded as JwtPayload;
    });

    next();
  });
};

export default auth;
