import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";

type Course = {
  id: number;
  title: string;
  description: string;
  instructor?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  syllabus?: string[];
  duration_weeks: number;
};

interface CourseTableProps {
  items: Course[];
}

export default function CourseTable({ items }: CourseTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                 <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Course ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Instructor
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Duration (weeks)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Category
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.length > 0 ? (
                items.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {course.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {course.title}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {course.instructor?.name.toLocaleUpperCase() || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {course.duration_weeks} weeks
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {course.category?.name || "Uncategorized"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {course.description ? course.description.slice(0, 60) + "..." : "No description"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      <div className="flex space-x-2">
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <button className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mr-3">
                            Edit
                          </button>
                        </Link>
                        <Link href={`/admin/courses/${course.id}/batches`}>
                          <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                            View Batches
                          </button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No courses found.
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
