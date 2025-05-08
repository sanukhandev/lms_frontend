"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Button from "../ui/button/Button";

export type CourseCategory = {
  id: number;
  name: string;
  description: string;
  created_at?: string;
};

interface CategoryTableProps {
  items: CourseCategory[];
  onDelete?: (id: number) => void;
}

export default function CategoryTable({ items, onDelete }: CategoryTableProps) {
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
                items.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {category.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {category.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {category.description ? category.description.slice(0, 60) + (category.description.length > 60 ? "..." : "") : "No description"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      <div className="flex space-x-2">
                        <Link href={`/admin/course-categories/${category.id}`}>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => onDelete && onDelete(category.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No categories found.
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

