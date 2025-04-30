import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";

type Batch = {
  id: number;
  course_id: number;
  name: string;
  start_date: string;
  end_date: string;
  session_days: string[];
  session_start_time: string;
  session_end_time: string;
};

interface BatchTableProps {
  items: Batch[];
}

export default function BatchTable({ items }: BatchTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400"
                >
                  Batch ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400"
                >
                  Start Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400"
                >
                  End Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400"
                >
                  Days
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs dark:text-gray-400"
                >
                  Time
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.length > 0 ? (
                items.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {batch.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      <Link
                        href={`/admin/courses/${batch.course_id}/batches/${batch.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {batch.name}
                      </Link>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {batch.start_date}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {batch.end_date}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {batch.session_days.join(", ")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {batch.session_start_time} - {batch.session_end_time}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No batches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
