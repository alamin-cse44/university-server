import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { RegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  /**
   * step-1: check if there any registered semester that is already 'UPCOMING' | 'ONGOING'
   * step-2: check if the academic semester is exist
   * step-3: check if the semester is already registered
   * step-4: create the semester registration
   */

  const academicSemester = payload?.acamemicSemester;
  //check if there any registered semester that is already 'UPCOMING' | 'ONGOING'

  const isThereAnyUpcoingOrOngoingSemester = await SemesterRegistration.findOne(
    {
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    },
  );

  if (isThereAnyUpcoingOrOngoingSemester) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `There is already an ${isThereAnyUpcoingOrOngoingSemester.status} registered semester`,
    );
  }

  // check if the academic semester is exist
  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);
  if (!isAcademicSemesterExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Academic Semester not found');
  }

  // check if the semester is already registered
  const isSemesterRagistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRagistrationExist) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `This Semester is already registered`,
    );
  }

  const result = await SemesterRegistration.create(payload);

  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterQuery = new QueryBuilder(SemesterRegistration.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterQuery.modelQuery;

  return result;
};
