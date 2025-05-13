"use client";
import React, { useEffect, useState } from "react";
import Badge from "../../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  CalenderIcon,
} from "@/icons";
import { api } from "@/util/api";
import Preloader from "../../common/Preloader";

interface StudentOverview {
  enrolled_courses: number;
  completed_courses: number;
  upcoming_classes: number;
  assignment_completion: number;
  enrollmentGrowth: number;
  completionGrowth: number;
  classesGrowth: number;
  assignmentGrowth: number;
}

export const StudentMetrics = () => {
  const [studentData, setStudentData] = useState<StudentOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = async () => {
    try {
      const response = await api.get("/student/overview");
      if (response.status === 200) {
        setStudentData(response.data);
        setError(null);
      } else {
        setError("Error fetching student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError("Error fetching student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  if (loading) return <Preloader />;
  if (error || !studentData) {
    return <div className="text-red-600 dark:text-red-400">⚠ {error}</div>;
  }

  const { 
    enrolled_courses, 
    completed_courses, 
    upcoming_classes, 
    assignment_completion
  } = studentData;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      <MetricCard
        icon={<BoxIconLine className="text-white" />}
        label="Enrolled Courses"
        value={enrolled_courses}
        growth={studentData.enrollmentGrowth}
        isPositive={studentData.enrollmentGrowth > 0}
      />
      <MetricCard
        icon={<BoxIconLine className="text-white" />}
        label="Completed Courses"
        value={completed_courses}
        growth={studentData.completionGrowth}
        isPositive={studentData.completionGrowth > 0}
      />
      <MetricCard
        icon={<CalenderIcon className="text-white" />}
        label="Upcoming Classes"
        value={upcoming_classes}
        growth={studentData.classesGrowth}
        isPositive={studentData.classesGrowth > 0}
      />
      <MetricCard
        icon={<GroupIcon className="text-white" />}
        label="Assignment Completion"
        value={assignment_completion}
        growth={studentData.assignmentGrowth}
        isPositive={studentData.assignmentGrowth > 0}
        showPercentage={true}
      />
    </div>
  );
};

// Reusable MetricCard Component
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  growth: number;
  isPositive: boolean;
  showPercentage?: boolean;
}

const MetricCard = ({
  icon,
  label,
  value,
  growth,
  isPositive,
  showPercentage = false,
}: MetricCardProps) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center justify-center w-12 h-12 bg-brand-600 rounded-xl dark:bg-gray-800">
      {icon}
    </div>
    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {showPercentage ? `${value}%` : value}
        </h4>
      </div>
      <Badge color={isPositive ? "success" : "error"}>
        {isPositive ? (
          <ArrowUpIcon />
        ) : (
          <ArrowDownIcon className="text-error-500" />
        )}
        {growth}%
      </Badge>
    </div>
  </div>
);

