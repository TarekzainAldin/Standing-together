 import {Router} from "express" ; 
import { changeWorkspaceMemberRoleController, createWorkspaceController,  deleteWorkspaceByIdController,  getAllWorkspacesUserIsMemberController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceMembersController, updateWorkspaceByIdController, } from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspaceController); 

workspaceRoutes.delete("/delete/:id",deleteWorkspaceByIdController);
workspaceRoutes.get("/all", getAllWorkspacesUserIsMemberController);
workspaceRoutes.get("/members/:id",getWorkspaceMembersController);
workspaceRoutes.get("/:id",getWorkspaceByIdController);
workspaceRoutes.get("/analytics/:id", getWorkspaceAnalyticsController);
workspaceRoutes.put("/update/:id", updateWorkspaceByIdController);
workspaceRoutes.put(
  "/change/member/role/:id",
  changeWorkspaceMemberRoleController
);

export default workspaceRoutes;