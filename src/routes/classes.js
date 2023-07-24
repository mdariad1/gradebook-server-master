import { Router } from "express";
import {
  getAllClasses,
  getSpecificClass,
  getTeacherClasses,
  postClass
} from "../controllers/classes";
import verifyUser from "../middleware/auth";

const classesRouter = new Router();

classesRouter.use(verifyUser);
// get one class
classesRouter.get("/:id", getSpecificClass);
// get all classes from an institution
classesRouter.get("/all/:institution", getAllClasses);
// get all classes of a teacher
classesRouter.get("/teacher/:teacher", getTeacherClasses);
// post a class in an institution
classesRouter.post("/:institution", postClass);

export default classesRouter;
