import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

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

  // create token to send to the client
  const jwtPayload = { userId: user?.id, userRole: user?.role };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_token as string, {
    expiresIn: '10d',
  });

  return { accessToken, needsPasswordChange: user?.needsPasswordChange };
};

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

  console.log("before hashing")
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
    },
  );

  return null;
};

export const AuthServices = {
  loginUserService,
  changePasswordService,
};
