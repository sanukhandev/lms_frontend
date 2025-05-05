import type { Metadata } from "next";
import React from "react";
import { LmsMetrics } from "@/components/dashboards/LmsMetrics";
import { TodaysClasses } from "@/components/dashboards/TodaysClasses";

export const metadata: Metadata = {
  title: "Admin Dashboard | LMS Platform",
  description:
    "Secure login to access your personalized LMS dashboard. Whether you're a student, instructor, or admin – track your courses, manage sessions, and monitor progress from one place.",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <LmsMetrics />
        <TodaysClasses />
      </div>
    </div>
  );
}
