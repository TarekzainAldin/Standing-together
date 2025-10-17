import useWorkspaceId from "@/hooks/use-workspace-id";
import AnalyticsCard from "./common/analytics-card";
import { useQuery } from "@tanstack/react-query";
import { getWorkspaceAnalyticsQueryFn } from "@/lib/api";
import { useTranslation } from "react-i18next";

const WorkspaceAnalytics = () => {
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();

  const { data, isPending } = useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
  });

  const analytics = data?.analytics;

  return (
    <div className="grid gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <AnalyticsCard
        isLoading={isPending}
        title={t("analytics.total_tasks")}
        value={analytics?.totalTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title={t("analytics.overdue_tasks")}
        value={analytics?.overdueTasks || 0}
      />
      <AnalyticsCard
        isLoading={isPending}
        title={t("analytics.completed_tasks")}
        value={analytics?.completedTasks || 0}
      />
    </div>
  );
};

export default WorkspaceAnalytics;
