import { useState } from "react";
import API from "@/lib/axios-client";

export const useReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadReport = async (workspaceId?: string) => {
    try {
      setLoading(true);
      setError(null);

      // إذا workspaceId موجود نرسل للمساحة الحالية، إذا لا نرسل لجميع المساحات
      const url = workspaceId
        ? `/reports/generate?workspaceId=${workspaceId}`
        : `/reports/generate`;

      const response = await API.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const today = new Date().toISOString().split("T")[0];
      const fileName = workspaceId
        ? `Report_${workspaceId}_${today}.xlsx`
        : `Report_AllWorkspaces_${today}.xlsx`;

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return { handleDownloadReport, loading, error };
};
