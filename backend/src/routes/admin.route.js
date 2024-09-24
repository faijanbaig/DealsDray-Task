import {Router} from "express"
import { deleteEmployee, getEmployees, getEmplyeeById, loginAdmin, logoutAdmin, registerAdmin, registerEmployee, updateEmployee } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/verifyJWT.middleware.js"
const router = Router();

router.route("/employees").post(verifyJWT, upload.single("avatar") ,registerEmployee)
router.route("/employees/:employeeId").patch(verifyJWT, upload.single("avatar") ,updateEmployee)
router.route("/employees/:employeeId").delete(verifyJWT, deleteEmployee)
router.route("/employees").get(verifyJWT, getEmployees)
router.route("/employees/:employeeId").get(verifyJWT, getEmplyeeById)
router.route("/create-admin").post(registerAdmin)
router.route("/admin").post(loginAdmin)
router.route("/admin").get(verifyJWT, logoutAdmin)

export default router;