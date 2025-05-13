import type { Metadata } from "next";
import React from "react";
import { InstructorMetrics } from "@/components/dashboards/instructor/InstructorMetrics";
import { InstructorClasses } from "@/components/dashboards/instructor/InstructorClasses";

export const metadata: Metadata = {
  title: "Instructor Dashboard | LMS Platform",
  description:
    "Instructor dashboard to manage courses, track student progress, and access teaching resources. View upcoming classes, manage course materials, and interact with students.",
};

export default function InstructorDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <InstructorMetrics />
        <InstructorClasses />
      </div>
    </div>
  );
}

