import { Separator } from "@/components/ui/separator";
import InviteMember from "@/components/workspace/member/invite-member";
import AllMembers from "@/components/workspace/member/all-members";
import WorkspaceHeader from "@/components/workspace/common/workspace-header";

export default function Members() {
  return (
    <div className="w-full min-h-screen pt-4 pb-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* رأس الصفحة */}
      <WorkspaceHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Separator className="my-6" />

        {/* معلومات الصفحة */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold leading-snug text-gray-900 dark:text-gray-100">
            Workspace Members
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Workspace members can view and join all Workspace projects and tasks, 
            and can create new tasks within the Workspace.
          </p>
        </div>

        <Separator className="my-6" />

        {/* إضافة عضو جديد */}
        <div className="mb-6">
          <InviteMember />
        </div>

        <Separator className="my-6 !h-[1px] opacity-50" />

        {/* جميع الأعضاء */}
        <AllMembers />
      </div>
    </div>
  );
}
