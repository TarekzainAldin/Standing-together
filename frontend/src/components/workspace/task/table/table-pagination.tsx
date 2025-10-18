import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next"; // ✅ i18n

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTablePagination<TData>({
  table,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation(); // ✅ initialize i18n
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = Math.ceil(totalCount / pageSize);

  const handlePageSizeChange = (size: number) => {
    table.setPageSize(size);
    onPageSizeChange?.(size);
  };

  const handlePageChange = (index: number) => {
    table.setPageIndex(index);
    onPageChange?.(index + 1);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
      {/* Showing X to Y of Z Rows */}
      <div className="flex-1 text-sm text-muted-foreground">
        {t("dataTable.showingRows", {
          from: (pageNumber - 1) * pageSize + 1,
          to: Math.min(pageNumber * pageSize, totalCount),
          total: totalCount,
        })}
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-x-8 lg:space-y-0">
        {/* Rows Per Page Selector */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("dataTable.rowsPerPage")}</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Info */}
        <div className="flex items-center">
          <div className="flex lg:w-[100px] items-center justify-center text-sm font-medium">
            {t("dataTable.pageInfo", { current: pageIndex + 1, total: pageCount })}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(0)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">{t("dataTable.firstPage")}</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className=""
              onClick={() => handlePageChange(pageIndex - 1)}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">{t("dataTable.previousPage")}</span>
              {t("dataTable.previous")}
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className=""
              onClick={() => handlePageChange(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">{t("dataTable.nextPage")}</span>
              {t("dataTable.next")}
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(pageCount - 1)}
              disabled={pageIndex >= pageCount - 1}
            >
              <span className="sr-only">{t("dataTable.lastPage")}</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
