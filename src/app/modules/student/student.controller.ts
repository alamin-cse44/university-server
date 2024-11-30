import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId)
  } catch (error) {}
};
