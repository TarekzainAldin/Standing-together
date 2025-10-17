import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import EmojiPickerComponent from "@/components/emoji-picker";
import { ProjectType } from "@/types/api.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { editProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

type EditProjectPayloadType = {
  projectId: string;
  workspaceId: string;
  data: {
    name: string;
    description: string;
    emoji: string;
  };
};

type EditProjectResponseType = {
  message: string;
  project?: ProjectType;
};

export default function EditProjectForm(props: {
  project?: ProjectType;
  onClose: () => void;
}) {
  const { project, onClose } = props;
  const { t } = useTranslation();
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();
  const [emoji, setEmoji] = useState("📊");
  const projectId = project?._id as string;

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: t("editProjectForm.project_title_required"),
    }),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation<
    EditProjectResponseType,
    Error,
    EditProjectPayloadType
  >({
    mutationFn: editProjectMutationFn,
  });

  useEffect(() => {
    if (project) {
      setEmoji(project.emoji);
      form.setValue("name", project.name);
      form.setValue("description", project.description);
    }
  }, [form, project]);

  const handleEmojiSelection = (emoji: string) => setEmoji(emoji);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    const payload: EditProjectPayloadType = {
      projectId,
      workspaceId,
      data: { emoji, ...values },
    };

    mutate(payload, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["singleProject", projectId] });
        queryClient.invalidateQueries({ queryKey: ["allprojects", workspaceId] });

        toast({
          title: t("editProjectForm.success_title"),
          description: data.message,
          variant: "success",
        });

        setTimeout(() => onClose(), 100);
      },
      onError: (error) => {
        toast({
          title: t("editProjectForm.error_title"),
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1 text-center sm:text-left">
            {t("editProjectForm.header")}
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            {t("editProjectForm.description")}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {t("editProjectForm.select_emoji")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="font-normal size-[60px] !p-2 !shadow-none mt-2 items-center rounded-full"
                  >
                    <span className="text-4xl">{emoji}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="!p-0">
                  <EmojiPickerComponent onSelectEmoji={handleEmojiSelection} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="mb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      {t("editProjectForm.project_title")}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("editProjectForm.project_title_placeholder")} {...field} />
                    </FormControl>
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
                      {t("editProjectForm.project_description")}
                      <span className="text-xs font-extralight ml-2">
                        {t("editProjectForm.optional")}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder={t("editProjectForm.project_description_placeholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button disabled={isPending} className="flex place-self-end h-[40px] text-white font-semibold" type="submit">
              {isPending && <Loader className="animate-spin mr-2" />}
              {t("editProjectForm.update_button")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
