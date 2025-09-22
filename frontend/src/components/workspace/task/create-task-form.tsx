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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformOptions,
} from "@/lib/helper";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import useGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createTaskMutationFn } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function CreateTaskForm(props: { projectId?: string; onClose: () => void }) {
  const { projectId, onClose } = props;

  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useMutation({ mutationFn: createTaskMutationFn });
  const { data, isLoading } = useGetProjectsInWorkspaceQuery({ workspaceId, skip: !!projectId });
  const { data: memberData } = useGetWorkspaceMembers(workspaceId);

  const projects = data?.projects || [];
  const members = memberData?.members || [];

  const projectOptions = projects.map((project) => ({
    label: (
      <div className="flex items-center gap-2">
        <span>{project.emoji}</span>
        <span>{project.name}</span>
      </div>
    ),
    value: project._id,
  }));

  const membersOptions = members.map((member) => {
    const name = member.userId?.name || "Unknown";
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);
    return {
      label: (
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={member.userId?.profilePicture || ""} alt={name} />
            <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      ),
      value: member.userId._id,
    };
  });

  const formSchema = z.object({
    title: z.string().trim().min(1, { message: "Title is required" }),
    description: z.string().trim(),
    projectId: z.string().trim().min(1, { message: "Project is required" }),
    status: z.enum(Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum], { required_error: "Status is required" }),
    priority: z.enum(Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum], { required_error: "Priority is required" }),
    assignedTo: z.string().trim().min(1, { message: "AssignedTo is required" }),
    dueDate: z.date({ required_error: "Due date is required." }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: projectId || "",
    },
  });

  const taskStatusList = Object.values(TaskStatusEnum);
  const taskPriorityList = Object.values(TaskPriorityEnum);

  const statusOptions = transformOptions(taskStatusList);
  const priorityOptions = transformOptions(taskPriorityList);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    const payload = { workspaceId, projectId: values.projectId, data: { ...values, dueDate: values.dueDate.toISOString() } };

    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project-analytics", projectId] });
        queryClient.invalidateQueries({ queryKey: ["all-tasks", workspaceId] });
        toast({ title: "Success", description: "Task created successfully", variant: "success" });
        onClose();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="w-full max-w-full bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
      <div className="mb-6 border-b pb-3">
        <h1 className="text-2xl font-semibold mb-1 text-center sm:text-left dark:text-white">
          Create Task
        </h1>
        <p className="text-sm text-muted-foreground">
          Organize tasks, assign team members, and manage disaster response projects.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Task Title */}
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold dark:text-[#f1f7feb5]">Task title</FormLabel>
              <FormControl>
                <Input placeholder="Flood Response Setup" className="!h-[48px] rounded-md" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Task Description */}
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold dark:text-[#f1f7feb5]">Task description <span className="text-xs font-light ml-2">Optional</span></FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="Describe objectives and steps for this task" className="rounded-md" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Project Selection */}
          {!projectId && <FormField control={form.control} name="projectId" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Project</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-52 overflow-y-auto scrollbar">
                  {isLoading && <div className="flex justify-center my-2"><Loader className="w-4 h-4 animate-spin" /></div>}
                  {projectOptions.map(option => <SelectItem key={option.value} value={option.value} className="!capitalize">{option.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />}

          {/* Assigned To */}
          <FormField control={form.control} name="assignedTo" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Assigned To</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-52 overflow-y-auto scrollbar">
                  {membersOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {/* Due Date */}
          <FormField control={form.control} name="dueDate" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className={cn("w-full text-left flex-1", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date(new Date().setHours(0,0,0,0)) || date > new Date("2100-12-31")} initialFocus defaultMonth={new Date()} fromMonth={new Date()} />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />

          {/* Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>{statusOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="priority" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a priority" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>{priorityOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          {/* Submit Button */}
          <Button className="w-full h-[45px] bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-200" type="submit" disabled={isPending}>
            {isPending && <Loader className="animate-spin" />}
            Create Task
          </Button>
        </form>
      </Form>
    </div>
  );
}