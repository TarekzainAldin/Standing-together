import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/auth-provider";
import { Loader } from "lucide-react";

const WorkspaceHeader = () => {
  const { workspaceLoading, workspace } = useAuthContext();

  return (
    <div className="w-full max-w-3xl mx-auto pb-4">
      {workspaceLoading ? (
        <div className="flex justify-center py-6">
          <Loader className="w-10 h-10 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-800 rounded-2xl shadow-md">
          <Avatar className="w-16 h-16 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <AvatarFallback className="rounded-xl bg-gradient-to-tl from-indigo-500 to-purple-600 text-white text-3xl font-bold flex items-center justify-center">
              {workspace?.name?.split(" ")?.[0]?.charAt(0) || "W"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-bold text-2xl text-gray-900 dark:text-gray-100">
              {workspace?.name}
            </span>
            <span className="truncate text-sm text-gray-500 dark:text-gray-400">
              Free Plan
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceHeader;
