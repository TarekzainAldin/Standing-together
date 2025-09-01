import  {Router} from "express";
import { getCurrentUserController } from "../controllers/user.controller";
const usreRoutes = Router();

usreRoutes.get("/current", getCurrentUserController);
export default usreRoutes;