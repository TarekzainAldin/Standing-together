import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "./ui/separator";
import { Link, useLocation } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const workspaceId = useWorkspaceId();
  const pathname = location.pathname;

  const getPageLabel = (pathname: string) => {
    if (pathname.includes("/project/")) return t("breadcrumb.project");
    if (pathname.includes("/settings")) return t("breadcrumb.settings");
    if (pathname.includes("/tasks")) return t("breadcrumb.tasks");
    if (pathname.includes("/members")) return t("breadcrumb.members");
    return null;
  };

  const pageHeading = getPageLabel(pathname);

  return (
    <header className="flex sticky top-0 z-50 bg-gradient-to-r from-blue-50 to-white h-14 items-center border-b border-gray-200 shadow-sm">
      <div className="flex flex-1 items-center gap-3 px-4">
        <SidebarTrigger className="text-blue-600 hover:text-blue-800 transition-colors duration-200" />
        <Separator orientation="vertical" className="h-5 border-gray-300" />
        <Breadcrumb className="flex-1">
          <BreadcrumbList className="flex items-center gap-1">
            <BreadcrumbItem className="hidden md:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {pageHeading ? (
                <BreadcrumbLink asChild>
                  <Link to={`/workspace/${workspaceId}`}>{t("breadcrumb.dashboard")}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="line-clamp-1 text-gray-800 font-semibold">
                  {t("breadcrumb.dashboard")}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {pageHeading && (
              <>
                <BreadcrumbSeparator className="hidden md:block text-gray-400" />
                <BreadcrumbItem className="text-sm text-gray-800 font-semibold">
                  <BreadcrumbPage className="line-clamp-1">{pageHeading}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="hidden md:flex items-center gap-3 pr-4">
        <Link
          to="/profile"
          className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
        >
          U
        </Link>
      </div>
    </header>
  );
};

export default Header;
