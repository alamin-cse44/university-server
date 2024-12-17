import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidaitons } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidaitons.loginValidationSchema),
  AuthControllers.loginUser,
);


export const AuthRouters = router;