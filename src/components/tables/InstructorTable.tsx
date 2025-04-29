"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

type Instructor = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  secondary_phone?: string;
  created_at: string;
};

interface InstructorTableProps {
  items: Instructor[];
}

export default function InstructorTable({ items }: InstructorTableProps) {
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
                  ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Secondary Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created At
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.length > 0 ? (
                items.map((instructor) => (
                  <TableRow key={instructor.id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {instructor.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {instructor.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {instructor.email}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {instructor.phone || "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {instructor.secondary_phone || "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {new Date(instructor.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No instructors found.
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
