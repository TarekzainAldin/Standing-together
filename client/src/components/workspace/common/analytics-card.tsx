import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowBigUp,
  ArrowBigDown,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
}) => {
  const { title, value, isLoading } = props;

  const getArrowIcon = () => {
    if (title === "Overdue Task") {
      return value > 0 ? (
        <ArrowBigDown className="h-5 w-5 text-red-500" strokeWidth={2.5} />
      ) : (
        <ArrowBigUp className="h-5 w-5 text-green-500" strokeWidth={2.5} />
      );
    }
    if (title === "Completed Task" || title === "Total Task") {
      return value > 0 ? (
        <ArrowBigUp className="h-5 w-5 text-green-500" strokeWidth={2.5} />
      ) : (
        <ArrowBigDown className="h-5 w-5 text-red-500" strokeWidth={2.5} />
      );
    }
    return null;
  };

  return (
    <Card
      className={cn(
        "w-full rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200",
        "bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold text-gray-700 dark:text-gray-200">
            {title}
          </CardTitle>
          {getArrowIcon()}
        </div>
        <Activity className="h-5 w-5 text-indigo-500 dark:text-indigo-400" strokeWidth={2.5} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {isLoading ? (
            <Loader className="h-6 w-6 animate-spin text-indigo-500" />
          ) : (
            value
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
