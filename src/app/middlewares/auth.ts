import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const auth = () => {
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
      // decoded undefined
      req.user = decoded as JwtPayload;
      console.log(req.user.data)
    });

    next();
  });
};

export default auth;
