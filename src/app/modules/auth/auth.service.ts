import { TLoginUser } from './auth.interface';

const loginUserService = async (payload: TLoginUser) => {
  console.log(payload);
};

export const AuthServices = {
  loginUserService,
};
