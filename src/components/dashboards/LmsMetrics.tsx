"use client";
import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
  UserIcon,
} from "@/icons";
import { api } from "@/util/api";
import Preloader from "../common/Preloader";

interface AdminOverview {
  total_students: number;
  total_courses: number;
  total_instructors: number;
  studentGrowth: number;
  courseDrop: number;
  instructorGrowth?: number | null;
  courseGrowth?: number | null;
  studentDrop?: number | null;
}

export const LmsMetrics = () => {
  const [adminData, setAdminData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const response = await api.get("/admin/overview");
      if (response.status === 200) {
        setAdminData(response.data);
        setError(null);
      } else {
        setError("Error fetching admin data");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError("Error fetching admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) return <Preloader />;
  if (error || !adminData) {
    return <div className="text-red-600 dark:text-red-400">⚠ {error}</div>;
  }

  const { total_students, total_courses, total_instructors } = adminData;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      <MetricCard
        icon={<UserIcon className="text-white" />}
        label="Total Students"
        value={total_students}
        growth={adminData.studentGrowth}
        isPositive={adminData.studentGrowth > 0}
      />
      <MetricCard
        icon={<BoxIconLine className="text-white" />}
        label="Total Courses"
        value={total_courses}
        growth={adminData.courseDrop}
        isPositive={adminData.courseDrop > 0}
      />
      <MetricCard
        icon={<GroupIcon className="text-white" />}
        label="Total Instructors"
        value={total_instructors}
        growth={adminData.instructorGrowth || 0}
        isPositive={adminData.instructorGrowth! > 0}
      />
    </div>
  );
};

// ✅ Reusable MetricCard Component
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
