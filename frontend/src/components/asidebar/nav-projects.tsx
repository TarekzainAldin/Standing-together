"use client";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Folder,
  Loader,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { ConfirmDialog } from "../resuable/confirm-dialog";
import { Permissions } from "@/constant";
import PermissionsGuard from "../resuable/permission-guard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import { PaginationType } from "@/types/api.type";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function NavProjects() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { isMobile } = useSidebar();
  const { onOpen } = useCreateProjectDialog();
  const { context, open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const [pageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: deleteProjectMutationFn,
  });

  const { data, isPending, isFetching, isError } =
    useGetProjectsInWorkspaceQuery({ workspaceId, pageSize, pageNumber });

  const projects = data?.projects || [];
  const pagination = data?.pagination || ({} as PaginationType);
  const hasMore = pagination?.totalPages > pageNumber;

  const fetchNextPage = () => {
    if (!hasMore || isFetching) return;
    setPageSize((prev) => prev + 6);
  };

  const handleConfirm = () => {
    if (!context) return;
    mutate(
      { workspaceId, projectId: context._id },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["allprojects", workspaceId] });
          toast({ title: t("projects.success"), description: data.message, variant: "success" });
          navigate(`/workspace/${workspaceId}`);
          setTimeout(() => onCloseDialog(), 100);
        },
        onError: (error: unknown) => {
          if (error instanceof Error) {
            toast({ title: t("projects.error"), description: error.message, variant: "destructive" });
          } else {
            toast({ title: t("projects.error"), description: String(error), variant: "destructive" });
          }
        },
      }
    );
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="flex justify-between items-center pr-0">
          <span className="font-semibold text-sm">{t("projects.label")}</span>
          <PermissionsGuard requiredPermission={Permissions.CREATE_PROJECT}>
            <button
              onClick={onOpen}
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
            >
              <Plus className="h-4 w-4" />
            </button>
          </PermissionsGuard>
        </SidebarGroupLabel>

        <SidebarMenu className="flex flex-col gap-2 p-2 max-h-[360px] overflow-y-auto scrollbar">
          {isError && <div className="text-red-500 text-sm">{t("projects.error_occurred")}</div>}
          {isPending && <Loader className="w-5 h-5 animate-spin place-self-center" />}

          {!isPending && projects.length === 0 ? (
            <div className="p-2 text-center text-xs text-muted-foreground">
              <p>{t("projects.no_projects")}</p>
              <PermissionsGuard requiredPermission={Permissions.CREATE_PROJECT}>
                <Button
                  variant="link"
                  type="button"
                  className="mt-2 text-sm underline font-semibold flex items-center justify-center gap-1 mx-auto"
                  onClick={onOpen}
                >
                  {t("projects.create_project")} <ArrowRight className="w-4 h-4" />
                </Button>
              </PermissionsGuard>
            </div>
          ) : (
            projects.map((item) => {
              const projectUrl = `/workspace/${workspaceId}/project/${item._id}`;
              const isActive = projectUrl === pathname;

              return (
                <SidebarMenuItem
                  key={item._id}
                  className={cn(
                    "group relative rounded-xl overflow-hidden transition-shadow",
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
                      : "bg-white dark:bg-gray-900 hover:shadow-md"
                  )}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="flex items-center justify-between p-3 rounded-xl transition-all"
                  >
                    <Link to={projectUrl} className="flex items-center gap-3 w-full truncate">
                      <div className="flex items-center justify-center w-10 h-10 text-xl rounded-lg bg-indigo-100 dark:bg-gray-800 text-indigo-600">
                        {item.emoji}
                      </div>
                      <span className="truncate font-semibold">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction
                        showOnHover
                        className="opacity-0 group-hover:opacity-100 transition"
                      >
                        <MoreHorizontal />
                        <span className="sr-only">{t("projects.more")}</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg shadow-lg"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem onClick={() => navigate(projectUrl)}>
                        <Folder className="text-muted-foreground" /> {t("projects.view")}
                      </DropdownMenuItem>

                      <PermissionsGuard requiredPermission={Permissions.DELETE_PROJECT}>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          disabled={isLoading}
                          onClick={() => onOpenDialog(item)}
                        >
                          <Trash2 className="text-muted-foreground" /> {t("projects.delete")}
                        </DropdownMenuItem>
                      </PermissionsGuard>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              );
            })
          )}

          {hasMore && (
            <SidebarMenuItem>
              <SidebarMenuButton
                className="text-sidebar-foreground/70"
                disabled={isFetching}
                onClick={fetchNextPage}
              >
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>{isFetching ? t("projects.loading") : t("projects.more")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>

      <ConfirmDialog
        isOpen={open}
        isLoading={isLoading}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={t("projects.delete_title")}
        description={t("projects.delete_description", { name: context?.name })}
        confirmText={t("projects.delete")}
        cancelText={t("projects.cancel")}
      />
    </>
  );
}
