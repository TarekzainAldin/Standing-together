import * as React from "react";
import { Check, ChevronDown, Loader, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import { useQuery } from "@tanstack/react-query";
import { getAllWorkspacesUserIsMemberQueryFn } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type WorkspaceType = {
  _id: string;
  name: string;
};

export function WorkspaceSwitcher() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const { onOpen } = useCreateWorkspaceDialog();
  const workspaceId = useWorkspaceId();

  const [activeWorkspace, setActiveWorkspace] = React.useState<WorkspaceType>();

  const { data, isPending } = useQuery({
    queryKey: ["userWorkspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: 1,
    refetchOnMount: true,
  });

  const workspaces = data?.workspaces;

  React.useEffect(() => {
    if (workspaces?.length) {
      const workspace = workspaceId
        ? workspaces.find((ws) => ws._id === workspaceId)
        : workspaces[0];

      if (workspace) {
        setActiveWorkspace(workspace);
        if (!workspaceId) navigate(`/workspace/${workspace._id}`);
      }
    }
  }, [workspaceId, workspaces, navigate]);

  const onSelect = (workspace: WorkspaceType) => {
    setActiveWorkspace(workspace);
    navigate(`/workspace/${workspace._id}`);
  };

  return (
    <>
      <SidebarGroupLabel className="flex justify-between items-center pr-0">
        <span className="font-semibold">{t("workspace.label")}</span>
        <button
          onClick={onOpen}
          className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
        >
          <Plus className="h-4 w-4" />
        </button>
      </SidebarGroupLabel>

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg transition-all",
                  "hover:bg-indigo-100 dark:hover:bg-gray-800"
                )}
              >
                {activeWorkspace ? (
                  <>
                    <div
                      className={cn(
                        "flex aspect-square h-8 w-8 items-center justify-center rounded-lg font-bold",
                        "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white"
                      )}
                    >
                      {activeWorkspace?.name?.split(" ")[0]?.charAt(0)}
                    </div>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-semibold text-sm">
                        {activeWorkspace?.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {t("workspace.free")}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t("workspace.no_selected")}
                  </span>
                )}
                <ChevronDown className="ml-auto w-4 h-4 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {t("workspace.label")}
              </DropdownMenuLabel>

              {isPending && (
                <Loader className="w-5 h-5 animate-spin place-self-center my-2" />
              )}

              {workspaces?.map((workspace) => (
                <DropdownMenuItem
                  key={workspace._id}
                  onClick={() => onSelect(workspace)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-md transition-colors",
                    workspace._id === workspaceId
                      ? "bg-indigo-500 text-white"
                      : "hover:bg-indigo-100 dark:hover:bg-gray-800"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-sm border font-semibold",
                      workspace._id === workspaceId
                        ? "bg-white text-indigo-500 border-white"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    )}
                  >
                    {workspace?.name?.split(" ")[0]?.charAt(0)}
                  </div>
                  <span className="flex-1 truncate">{workspace.name}</span>
                  {workspace._id === workspaceId && (
                    <DropdownMenuShortcut className="!opacity-100">
                      <Check className="w-4 h-4" />
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-indigo-100 dark:hover:bg-gray-800"
                onClick={onOpen}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  {t("workspace.add")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
