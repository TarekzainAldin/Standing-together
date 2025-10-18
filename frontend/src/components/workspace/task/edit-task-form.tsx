import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { editTaskMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { TaskType } from "@/types/api.type";
import { useTranslation } from "react-i18next";

export default function EditTaskForm({ task, onClose }: { task: TaskType; onClose: () => void }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({
    mutationFn: editTaskMutationFn,
  });

  const { data: memberData } = useGetWorkspaceMembers(workspaceId);
  const members = memberData?.members || [];

  const membersOptions = members.map((member) => ({
    label: member.userId?.name || t("editTask.unknown"),
    value: member.userId?._id || "",
  }));

  const statusOptions = Object.values(TaskStatusEnum).map((status) => ({
    label: status.charAt(0) + status.slice(1).toLowerCase(),
    value: status,
  }));

  const priorityOptions = Object.values(TaskPriorityEnum).map((priority) => ({
    label: priority.charAt(0) + priority.slice(1).toLowerCase(),
    value: priority,
  }));

  const formSchema = z.object({
    title: z.string().trim().min(1, { message: t("editTask.errors.titleRequired") }),
    description: z.string().trim(),
    status: z.enum(Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum]),
    priority: z.enum(Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum]),
    assignedTo: z.string().trim().min(1, { message: t("editTask.errors.assignedToRequired") }),
    dueDate: z.date({ required_error: t("editTask.errors.dueDateRequired") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      priority: task?.priority ?? "MEDIUM",
      assignedTo: task.assignedTo?._id ?? "",
      dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    const payload = {
      workspaceId,
      projectId: task.project?._id ?? "",
      taskId: task._id,
      data: {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
    };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
        toast({
          title: t("editTask.toast.success"),
          variant: "success",
        });
        onClose();
      },
      onError: (error: unknown) => {
        const description = error instanceof Error ? error.message : String(error);
        toast({
          title: t("editTask.toast.error"),
          description,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1 className="text-xl font-semibold text-center sm:text-left">
            {t("editTask.title")}
          </h1>
        </div>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editTask.taskTitle")}</FormLabel>
                <FormControl><Input {...field} placeholder={t("editTask.placeholder.taskTitle")} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editTask.taskDescription")}</FormLabel>
                <FormControl><Textarea {...field} rows={2} placeholder={t("editTask.placeholder.taskDescription")} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="assignedTo" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editTask.assignedTo")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t("editTask.selectMember")} /></SelectTrigger></FormControl>
                  <SelectContent>
                    <div className="w-full max-h-[200px] overflow-y-auto scrollbar">
                      {membersOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="dueDate" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editTask.dueDate")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline">
                        {field.value ? format(field.value, "PPP") : t("editTask.pickDate")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editTask.status")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t("editTask.selectStatus")} /></SelectTrigger></FormControl>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="priority" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("editTask.priority")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t("editTask.selectPriority")} /></SelectTrigger></FormControl>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>{priority.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader className="animate-spin" />}
              {t("editTask.saveButton")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
