import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { useStoreBase } from "@/store/store";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;
  const navigate = useNavigate();

  const { clearAccessToken } = useStoreBase.getState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["authUser"] });
      clearAccessToken();
      navigate("/");
      setIsOpen(false);
    },
    onError: (error: unknown) => {
      let message = "An unexpected error occurred";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = useCallback(() => {
    if (isPending) return;
    mutate();
  }, [isPending, mutate]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-800 dark:text-gray-200">
            Are you sure you want to log out?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
            This will end your current session and you will need to log in again
            to access your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 pt-4">
          <Button
            disabled={isPending}
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-md"
          >
            {isPending && <Loader className="animate-spin" />}
            Sign out
          </Button>
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="rounded-xl"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
