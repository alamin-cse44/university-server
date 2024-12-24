import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';
import { createToken } from './auth.utils';

const loginUserService = async (payload: TLoginUser) => {
  // check if the user exist
  const user = await User.isUserExistsByCustomId(payload?.id);

  console.log('auth', await User.isUserExistsByCustomId(payload?.id));
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

  // check if the password is correct
  const isPasswordCorrect = await User.isPasswaordMatched(
    payload?.password,
    user?.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Invalid password!!');
  }

  // create jwt access token to send to the client
  const jwtPayload = { userId: user?.id, userRole: user?.role };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_token_expires as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token as string,
    config.jwt_refresh_token_expires as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

// change password service

const changePasswordService = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check if the user exist
  const user = await User.isUserExistsByCustomId(userData?.userId);

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

  // check if the password is correct
  const isPasswordCorrect = await User.isPasswaordMatched(
    payload?.oldPassword,
    user?.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Invalid password!!');
  }

  console.log('before hashing');
  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.userRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangeAt: new Date(),
    },
  );

  return null;
};

const refreshTokenService = async (token: string) => {
  // checking if the given token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_token as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    userRole: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token as string,
    config.jwt_access_token_expires as string,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUserService,
  changePasswordService,
  refreshTokenService,
};
