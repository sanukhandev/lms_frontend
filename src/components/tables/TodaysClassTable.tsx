"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Button from "../ui/button/Button";

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
  const handleOpenManageClassModal = (session: ClassSession) => {
    // Logic to open the modal and pass the session data
    console.log("Open manage class modal for session:", session);
    // You can implement your modal logic here
  };
  const handleJoinMeeting = (sessionId: number) => {
    const meetingUrl = `/meeting/${sessionId}`;
    window.open(
      meetingUrl,
      "_blank",
      "toolbar=no,scrollbars=no,resizable=no,top=100,left=100,width=800,height=600"
    );
  };
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
                      {session.meeting_link &&
                      session.class_status === "not_started" ? (
                        <Button
                          variant="outline"
                          onClick={() => handleJoinMeeting(session.id)}
                          className="text-blue-500 hover:underline"
                        >
                          Join Class
                        </Button>
                      ) : session.class_status === "completed" ? (
                        <span className="text-gray-500">Class Ended</span>
                      ) : (
                        <Button
                          onClick={() => handleOpenManageClassModal(session)}
                          className="text-blue-500 hover:underline"
                        >
                          Manage Class
                        </Button>
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
