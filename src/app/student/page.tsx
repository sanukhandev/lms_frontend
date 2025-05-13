import type { Metadata } from "next";
import React from "react";
import { StudentMetrics } from "@/components/dashboards/student/StudentMetrics";
import { StudentClasses } from "@/components/dashboards/student/StudentClasses";
import { StudentProgress } from "@/components/dashboards/student/StudentProgress";

export const metadata: Metadata = {
  title: "Student Dashboard | LMS Platform",
  description:
    "Student dashboard to track course progress, view upcoming classes, access learning materials, and manage assignments. Monitor your educational journey and stay organized.",
};

export default function StudentDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <StudentMetrics />
        <StudentClasses />
        <StudentProgress />
      </div>
    </div>
  );
}

