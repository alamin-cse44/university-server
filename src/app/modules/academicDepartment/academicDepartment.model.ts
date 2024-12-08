import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department Name is required'],
      trim: true,
      maxlength: [50, 'Department Name can not be more than 50 characters'],
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: [true, 'Academic Faculty is required'],
    },
  },
  {
    timestamps: true,
  },
);

// academicDepartmentSchema.pre('save', async function (next) {
//   const isDepartmentExist = await AcademicDepartment.findOne({
//     name: this.name,
//   });

//   if (isDepartmentExist) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Department Name already exists');
//   }
//   next();
// });

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  console.log(query);

  const isDepartmentExist = await AcademicDepartment.findOne(query);

  if (!isDepartmentExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Department Name does not exists',
    );
  }
  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
