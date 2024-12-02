import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Student retrieved successfully',
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

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Students retrieved successfully',
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
    const updateData = {"isDeleted": true}
    const result = await StudentServices.deleteStudentFromDB(studentId, updateData);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Student deleted successfully',
      data: result,
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
