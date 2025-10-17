import { ConfirmDialog } from "@/components/resuable/confirm-dialog";
import PermissionsGuard from "@/components/resuable/permission-guard";
import { Button } from "@/components/ui/button";
import { Permissions } from "@/constant";
import { useAuthContext } from "@/context/auth-provider";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { toast } from "@/hooks/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { deleteWorkspaceMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DeleteWorkspaceCard = () => {
  const { t } = useTranslation();
  const { workspace } = useAuthContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const { open, onOpenDialog, onCloseDialog } = useConfirmDialog();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteWorkspaceMutationFn,
  });

  const handleConfirm = () => {
    mutate(workspaceId, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["userWorkspaces"] });
        navigate(`/workspace/${data.currentWorkspace}`);
        setTimeout(() => onCloseDialog(), 100);
      },
      onError: (error) => {
        toast({
          title: t("delete_workspace_form.error_title"),
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="mb-5 border-b">
          <h1 className="text-[17px] tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5 text-center sm:text-left">
            {t("delete_workspace_form.title")}
          </h1>
        </div>

        <PermissionsGuard showMessage requiredPermission={Permissions.DELETE_WORKSPACE}>
          <div className="flex flex-col items-start justify-between py-0">
            <div className="flex-1 mb-2">
              <p>{t("delete_workspace_form.description")}</p>
            </div>
            <Button
              className="shrink-0 flex place-self-end h-[40px]"
              variant="destructive"
              onClick={onOpenDialog}
            >
              {t("delete_workspace_form.delete_button")}
            </Button>
          </div>
        </PermissionsGuard>
      </div>

      <ConfirmDialog
        isOpen={open}
        isLoading={isPending}
        onClose={onCloseDialog}
        onConfirm={handleConfirm}
        title={t("delete_workspace_form.confirm_title", { name: workspace?.name })}
        description={t("delete_workspace_form.confirm_description")}
        confirmText={t("delete_workspace_form.confirm_button")}
        cancelText={t("delete_workspace_form.cancel_button")}
      />
    </>
  );
};

export default DeleteWorkspaceCard;
