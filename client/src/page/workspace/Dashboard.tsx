import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCreateProjectDialog from "@/hooks/use-create-project-dialog";
import WorkspaceAnalytics from "@/components/workspace/workspace-analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentProjects from "@/components/workspace/project/recent-projects";
import RecentTasks from "@/components/workspace/task/recent-tasks";
import RecentMembers from "@/components/workspace/member/recent-members";

const WorkspaceDashboard = () => {
  const { onOpen } = useCreateProjectDialog();

  return (
    <main className="flex flex-1 flex-col py-6 px-4 md:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-purple-400">
            Workspace Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here’s an overview for this workspace!
          </p>
        </div>
        <Button
          onClick={onOpen}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-md"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="mb-8">
        <WorkspaceAnalytics />
      </div>

      <div className="mt-4">
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="w-full justify-start bg-white dark:bg-gray-900 rounded-xl shadow p-1">
            <TabsTrigger
              className="px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              value="projects"
            >
              Recent Projects
            </TabsTrigger>
            <TabsTrigger
              className="px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              value="tasks"
            >
              Recent Tasks
            </TabsTrigger>
            <TabsTrigger
              className="px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg transition-all"
              value="members"
            >
              Recent Members
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-4">
            <RecentProjects />
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <RecentTasks />
          </TabsContent>

          <TabsContent value="members" className="mt-4">
            <RecentMembers />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default WorkspaceDashboard;
