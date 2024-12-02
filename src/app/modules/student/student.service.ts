import { Student } from './student.model';

const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.aggregate([{ $match: { id } }]);
  const result = await Student.findById(id);
  return result;
};

const deleteStudentFromDB = async (studentId: string, updateData: object) => {
  // const result = await Student.updateOne({ studentId }, { isDeleted: true });
  const result = await Student.findByIdAndUpdate(studentId, updateData, { new: true });
  return result;
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
