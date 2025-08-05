import { lazy } from "react";
import { Route } from "react-router-dom";
import DynamicForm from "@/layouts/admin/components/dynamic/dynamic_form";
//course
// const CourseForm = lazy(
//   () => import("@/layouts/admin/components/course/CourseForm")
// );
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Category = lazy(() => import("@/pages/admin/course/Category"));
const CourseView = lazy(() => import("@/pages/admin/course/CourseView"));
const CourseList = lazy(() => import("@/pages/admin/course/List"));
const Paper = lazy(() => import("@/pages/admin/course/Paper"));
//Branch
const BranchList = lazy(() => import("@/pages/admin/branch/List"));
//student
const StudentList = lazy(() => import("@/pages/admin/student/List"));
// const StudentForm = lazy(
//   () => import("@/layouts/admin/components/student/StudentForm")
// );

export const AdminRoutes = [
  //course
  <Route index element={<Dashboard />} />,
  <Route path="courses" element={<CourseList />} />,
  <Route path="courses/:id" element={<CourseView />} />,
  <Route path="courses/add" element={<DynamicForm formType="course" />} />, 
  <Route path="course/categories" element={<Category />} />,
  <Route path="course/papers" element={<Paper />} />,
  //Branch
  <Route path="branches/add" element={<DynamicForm formType="branch" />} />, 
  <Route path="branches" element={<BranchList />} />,
  //student
  <Route path="students/:status" element={<StudentList />} />,
  <Route path="students/add" element={<DynamicForm formType="student" />} />,
]