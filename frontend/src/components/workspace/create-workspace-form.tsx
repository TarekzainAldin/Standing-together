import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceMutationFn } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CreateWorkspaceFormProps {
  onClose: () => void;
}

const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { mutate, isPending } = useMutation({
    mutationFn: createWorkspaceMutationFn,
  });

  const formSchema = z.object({
    name: z.string().trim().min(1, { message: t("workspace_form.name_required") }),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        queryClient.resetQueries({ queryKey: ["userWorkspaces"] });
        const workspace = data.workspace;
        onClose();
        navigate(`/workspace/${workspace._id}`);
      },
      onError: (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        toast({
          title: t("workspace_form.error_title"),
          description: message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <main className="w-full flex flex-row min-h-[590px] h-auto max-w-full">
      <div className="h-full px-10 py-10 flex-1">
        <div className="mb-5">
          <h1 className="text-2xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1.5 text-center sm:text-left">
            {t("workspace_form.title")}
          </h1>
          <p className="text-muted-foreground text-lg leading-tight">
            {t("workspace_form.description")}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      {t("workspace_form.name_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("workspace_form.name_placeholder")}
                        className="!h-[48px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("workspace_form.name_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      {t("workspace_form.description_label")}
                      <span className="text-xs font-extralight ml-2">
                        {t("workspace_form.optional")}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder={t("workspace_form.description_placeholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("workspace_form.description_description")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={isPending}
              className="w-full h-[50px] bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
              type="submit"
            >
              {isPending && <Loader className="animate-spin" />}
              {t("workspace_form.create_button")}
            </Button>
          </form>
        </Form>
      </div>

      <div
        className="relative flex-1 shrink-0 hidden bg-muted md:block
      bg-[url('/images/workspace.jpg')] bg-cover bg-center h-full"
      />
    </main>
  );
};

export default CreateWorkspaceForm;
