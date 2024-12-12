import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPreRequisiteCourses,
} from './course.interface';

const PreRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Pre-requisite Course is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const courseSchema = new Schema<TCourse>({
  title: {
    type: String,
    unique: true,
    required: [true, 'Course Title is required'],
    trim: true,
    maxlength: [100, 'Course Title can not be more than 100 characters'],
  },
  prefix: {
    type: String,
    required: [true, 'Course Prefix is required'],
    trim: true,
    maxlength: [10, 'Course Prefix can not be more than 10 characters'],
  },
  code: {
    type: Number,
    required: [true, 'Course Code is required'],
    unique: true,
  },
  credits: {
    type: Number,
    required: [true, 'Course Credits is required'],
  },
  preRequisiteCourses: [PreRequisiteCoursesSchema],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Course = model<TCourse>('Course', courseSchema);

const courseFacultySchema = new Schema<TCourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      unique: true,
    },
    faculties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
      },
    ],
  },
  {
    _id: false,
  },
);

export const CourseFaculty = model<TCourseFaculty>('CourseFaculty', courseFacultySchema);
