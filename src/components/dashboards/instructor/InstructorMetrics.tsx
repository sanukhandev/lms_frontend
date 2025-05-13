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

interface InstructorOverview {
  total_assigned_courses: number;
  total_active_batches: number;
  total_enrolled_students: number;
  upcoming_classes: number;
  coursesGrowth: number;
  batchesGrowth: number;
  studentsGrowth: number;
  classesGrowth: number;
}

export const InstructorMetrics = () => {
  const [instructorData, setInstructorData] = useState<InstructorOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstructorData = async () => {
    try {
      // Replace with actual API endpoint when available
      const response = await api.get("/instructor/overview");
      if (response.status === 200) {
        setInstructorData(response.data);
        setError(null);
      } else {
        setError("Error fetching instructor data");
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      setError("Error fetching instructor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  if (loading) return <Preloader />;
  if (error || !instructorData) {
    return <div className="text-red-600 dark:text-red-400">⚠ {error}</div>;
  }

  const { 
    total_assigned_courses, 
    total_active_batches, 
    total_enrolled_students, 
    upcoming_classes 
  } = instructorData;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      <MetricCard
        icon={<BoxIconLine className="text-white" />}
        label="Assigned Courses"
        value={total_assigned_courses}
        growth={instructorData.coursesGrowth}
        isPositive={instructorData.coursesGrowth > 0}
      />
      <MetricCard
        icon={<CalenderIcon className="text-white" />}
        label="Active Batches"
        value={total_active_batches}
        growth={instructorData.batchesGrowth}
        isPositive={instructorData.batchesGrowth > 0}
      />
      <MetricCard
        icon={<GroupIcon className="text-white" />}
        label="Enrolled Students"
        value={total_enrolled_students}
        growth={instructorData.studentsGrowth}
        isPositive={instructorData.studentsGrowth > 0}
      />
      <MetricCard
        icon={<CalenderIcon className="text-white" />}
        label="Upcoming Classes"
        value={upcoming_classes}
        growth={instructorData.classesGrowth}
        isPositive={instructorData.classesGrowth > 0}
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
}

const MetricCard = ({
  icon,
  label,
  value,
  growth,
  isPositive,
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
          {value}
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

