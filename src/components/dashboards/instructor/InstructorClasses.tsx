"use client";
import { useEffect, useState } from "react";
import { api } from "@/util/api";
import Preloader from "../../common/Preloader";
import Button from "../../ui/button/Button";
import TodaysClassesTable from "@/components/tables/TodaysClassTable";

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

export const InstructorClasses = () => {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const fetchInstructorClasses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/instructor/classes", {
        params: { filter },
      });
      if (response.status === 200) {
        setClasses(response.data);
        setError(null);
      } else {
        setError("Failed to load classes");
      }
    } catch (error) {
      console.error("Error fetching instructor's classes:", error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorClasses();
  }, [filter]);


  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6">
      <div className="col-span-full bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0 dark:text-white">
            My Classes
          </h2>
          <div className="flex space-x-2">
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "primary" : "outline"}
              size="sm"
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("upcoming")}
              variant={filter === "upcoming" ? "primary" : "outline"}
              size="sm"
            >
              Upcoming
            </Button>
            <Button
              onClick={() => setFilter("completed")}
              variant={filter === "completed" ? "primary" : "outline"}
              size="sm"
            >
              Completed
            </Button>
          </div>
        </div>

        {loading ? (
          <Preloader />
        ) : error ? (
          <div className="text-red-600 dark:text-red-400">⚠ {error}</div>
        ) : classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No classes found for the selected filter.
          </div>
        ) : (
          <TodaysClassesTable
            items={classes.map((session) => ({
              ...session,
              // You can optionally inject a custom button renderer if needed
              meeting_link:
                session.class_status === "scheduled"
                  ? null
                  : session.meeting_link,
            }))}
          />
        )}
      </div>
    </div>
  );
};
