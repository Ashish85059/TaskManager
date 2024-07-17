import { Router } from "express";
const router = Router();

import {getAllTask,createTask,deleteTask,updateTask,getTask} from "../controllers/TaskController.js"

router.route("/").get(getAllTask).post(createTask);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

export default router;