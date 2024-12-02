import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      message: 'Student retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      message: 'Students retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    await StudentServices.deleteStudentFromDB(studentId);
    res.status(200).json({
      message: 'Student deleted successfully',
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const StudentControllers = {
  getSingleStudent,
  getAllStudents,
  deleteStudent,
};
