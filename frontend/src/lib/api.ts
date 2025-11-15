import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  EditTaskPayloadType,
  CreateWorkspaceResponseType,
  EditProjectPayloadType,
  ProjectByIdPayloadType,
  ProjectResponseType,
} from "../types/api.type";
import {
  AllWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  WorkspaceByIdResponseType,
  EditWorkspaceType,
} from "../types/api.type";

// =================== AUTH ===================
export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post<LoginResponseType>("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (
  data: registerType
): Promise<{ message: string }> => {
  const response = await API.post<{ message: string }>("/auth/register", data);
  return response.data;
};

export const logoutMutationFn = async (): Promise<{ message: string }> => {
  const response = await API.post<{ message: string }>("/auth/logout");
  return response.data;
};

export const getCurrentUserQueryFn = async (): Promise<CurrentUserResponseType> => {
  const response = await API.get<CurrentUserResponseType>("/user/current");
  return response.data;
};

// =================== WORKSPACES ===================
export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post<CreateWorkspaceResponseType>(
    "/workspace/create/new",
    data
  );
  return response.data;
};

export const editWorkspaceMutationFn = async (params: EditWorkspaceType): Promise<CreateWorkspaceResponseType> => {
  const { workspaceId, data } = params;
  const response = await API.put<CreateWorkspaceResponseType>(
    `/workspace/update/${workspaceId}`,
    data
  );
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn = async (): Promise<AllWorkspaceResponseType> => {
  const response = await API.get<AllWorkspaceResponseType>("/workspace/all");
  return response.data;
};

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get<WorkspaceByIdResponseType>(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get<AllMembersInWorkspaceResponseType>(
    `/workspace/members/${workspaceId}`
  );
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get<AnalyticsResponseType>(
    `/workspace/analytics/${workspaceId}`
  );
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async (
  params: ChangeWorkspaceMemberRoleType
): Promise<{ message: string }> => {
  const { workspaceId, data } = params;
  const response = await API.put<{ message: string }>(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{ message: string; currentWorkspace: string }> => {
  const response = await API.delete<{ message: string; currentWorkspace: string }>(
    `/workspace/delete/${workspaceId}`
  );
  return response.data;
};

// =================== MEMBERS ===================
export const invitedUserJoinWorkspaceMutationFn = async (
  inviteCode: string
): Promise<{ message: string; workspaceId: string }> => {
  const response = await API.post<{ message: string; workspaceId: string }>(
    `/member/workspace/${inviteCode}/join`
  );
  return response.data;
};

// =================== PROJECTS ===================
export const createProjectMutationFn = async (params: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const { workspaceId, data } = params;
  const response = await API.post<ProjectResponseType>(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async (params: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const { projectId, workspaceId, data } = params;
  const response = await API.put<ProjectResponseType>(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async (
  params: AllProjectPayloadType
): Promise<AllProjectResponseType> => {
  const { workspaceId, pageSize = 10, pageNumber = 1 } = params;
  const response = await API.get<AllProjectResponseType>(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async (params: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const { workspaceId, projectId } = params;
  const response = await API.get<ProjectResponseType>(`/project/${projectId}/workspace/${workspaceId}`);
  return response.data;
};

export const getProjectAnalyticsQueryFn = async (params: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const { workspaceId, projectId } = params;
  const response = await API.get<AnalyticsResponseType>(`/project/${projectId}/workspace/${workspaceId}/analytics`);
  return response.data;
};

export const deleteProjectMutationFn = async (params: ProjectByIdPayloadType): Promise<{ message: string }> => {
  const { workspaceId, projectId } = params;
  const response = await API.delete<{ message: string }>(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

// =================== TASKS ===================
export const createTaskMutationFn = async (params: CreateTaskPayloadType): Promise<{ message: string }> => {
  const { workspaceId, projectId, data } = params;
  const response = await API.post<{ message: string }>(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editTaskMutationFn = async (params: EditTaskPayloadType): Promise<{ message: string }> => {
  const { taskId, projectId, workspaceId, data } = params;
  const response = await API.put<{ message: string }>(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async (params: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const { workspaceId, keyword, projectId, assignedTo, priority, status, dueDate, pageNumber, pageSize } = params;
  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString()
    ? `/task/workspace/${workspaceId}/all?${queryParams.toString()}`
    : `/task/workspace/${workspaceId}/all`;

  const response = await API.get<AllTaskResponseType>(url);
  return response.data;
};

export const deleteTaskMutationFn = async (params: { workspaceId: string; taskId: string }): Promise<{ message: string }> => {
  const { workspaceId, taskId } = params;
  const response = await API.delete<{ message: string }>(
    `/task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

// =================== REPORTS ===================
export const generateReportQueryFn = async (workspaceId?: string): Promise<Blob> => {
  const url = workspaceId
    ? `/reports/generate?workspaceId=${workspaceId}`
    : `/reports/generate`;

  const response = await API.get(url, { responseType: "blob" });
  return response.data;
};
