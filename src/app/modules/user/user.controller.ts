import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { password, student: studentData } = req.body;

    const result = await UserServices.createStudentIntoDB(
      password,
      studentData,
    );

    res.status(200).json({
      message: 'Student created successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    // res.status(500).json({
    //   message: 'Failed to create student',
    //   success: false,
    //   error: error,
    // });
    next(error);
  }
};

export const UserControllers = {
  createStudent,
};
