"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

type ClassSession = {
  id: number;
  date: string;
  class_status: string;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  batch: {
    id: number;
    name: string;
    session_start_time: string;
    session_end_time: string;
    course: {
      id: number;
      title: string;
      duration_weeks: number;
      instructor: {
        id: number;
        name: string;
        email: string;
      };
    };
  };
};

interface TodaysClassesTableProps {
  items: ClassSession[];
}

export default function TodaysClassesTable({ items }: TodaysClassesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Class ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Time
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Batch Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Course Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Instructor
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Duration
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs dark:text-gray-400"
                >
                  Meeting Link
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.length > 0 ? (
                items.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                      {session.id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {session.date}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {session.start_time} - {session.end_time}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {session.batch?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {session.batch?.course?.title || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {session.batch?.course?.instructor?.name || "N/A"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                      {session.batch?.course?.duration_weeks} weeks
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400 capitalize">
                      {session.class_status.replace("_", " ")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-blue-600 dark:text-blue-400">
                      {session.meeting_link ? (
                        <a
                          href={session.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          Join
                        </a>
                      ) : (
                        "Not Available"
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No classes today.
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
