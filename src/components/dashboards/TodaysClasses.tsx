"use client";
import { api } from "@/util/api";
import { useEffect, useState } from "react";
import TodaysClassesTable from "../tables/TodaysClassTable";
import Preloader from "../common/Preloader";

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

export const TodaysClasses = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodaysClasses = async () => {
    try {
      const response = await api.get("/admin/todays-classes");
      if (response.status === 200) {
        setClasses(response.data);
        setError(null);
      } else {
        setError("Failed to load classes");
      }
    } catch (error) {
      console.error("Error fetching today's classes:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysClasses();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      <div className="col-span-full bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">
          Today’s Classes
        </h2>
        {loading ? (
          <Preloader />
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">⚠ {error}</div>
        ) : (
          <TodaysClassesTable items={classes} />
        )}
      </div>
    </div>
  );
};
