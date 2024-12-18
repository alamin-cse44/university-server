import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserService(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const result = await AuthServices.changePasswordService(req.user, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Password is changed successfully',
    data: "",
  });
});

export const AuthControllers = {
  loginUser,
  changePassword
};
