import { useState } from "react";
import { Link } from "react-router-dom";
import { EllipsisIcon, Loader, LogOut, FileSpreadsheet, LayersIcon } from "lucide-react";
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarGroupContent, SidebarGroup,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail, useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import LogoutDialog from "./logout-dialog";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { Separator } from "../ui/separator";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useAuthContext } from "@/context/auth-provider";
import { useReport } from "@/hooks/useReport";
import { useTranslation } from "@/hooks/useTranslation"; // ✅ hook مخصص

const Asidebar = () => {
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const { isLoading, user } = useAuthContext();
  const { open } = useSidebar();
  const workspaceId = useWorkspaceId();
  const { handleDownloadReport, loading } = useReport();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar collapsible="icon" className="bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 shadow-xl">
        {/* HEADER */}
        <SidebarHeader className="!py-0 border-b border-gray-200 dark:border-gray-800">
          <div className="flex h-[56px] items-center justify-between w-full px-2">
            <div className="flex items-center gap-2">
              <Logo url={`/workspace/${workspaceId}`} />
              {open && (
                <Link
                  to={`/workspace/${workspaceId}`}
                  className="hidden md:flex ml-2 items-center gap-2 font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
                >
                  STANDING TOGETHER.
                </Link>
              )}
            </div>

            {/* Language Switcher */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              value={currentLanguage}
              className="p-1 rounded border dark:bg-gray-800 dark:text-white"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="!mt-0">
          <SidebarGroup className="!py-0">
            <SidebarGroupContent>
              <WorkspaceSwitcher />
              <Separator className="my-3" />
              <NavMain />

              {/* Download Report Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-300 dark:hover:bg-gray-800 transition-all rounded-lg"
                    disabled={loading}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    {loading ? t("sidebar.generating") : t("sidebar.download_report")}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <DropdownMenuItem onClick={() => handleDownloadReport(workspaceId)}>
                    <FileSpreadsheet className="w-4 h-4 mr-1" />
                    {t("sidebar.current_workspace")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownloadReport()}>
                    <LayersIcon className="w-4 h-4 mr-1" />
                    {t("sidebar.all_workspaces")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator className="my-3" />
              <NavProjects />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <Loader size="24px" className="place-self-center self-center animate-spin text-indigo-500" />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="rounded-xl hover:bg-indigo-100 dark:hover:bg-gray-800 transition-all">
                      <Avatar className="h-9 w-9 rounded-full shadow">
                        <AvatarImage src={user?.profilePicture || ""} />
                        <AvatarFallback className="rounded-full border border-gray-400 dark:border-gray-600 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                          {user?.name?.split(" ")?.[0]?.charAt(0)}
                          {user?.name?.split(" ")?.[1]?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-gray-800 dark:text-gray-200">{user?.name}</span>
                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">{user?.email}</span>
                      </div>
                      <EllipsisIcon className="ml-auto size-4 text-gray-500 dark:text-gray-400" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" side="bottom" align="start" sideOffset={4}>
                    <DropdownMenuItem onClick={() => setIsOpen(true)} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800">
                      <LogOut className="mr-2" />
                      {t("sidebar.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Logout Dialog */}
      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Asidebar;
