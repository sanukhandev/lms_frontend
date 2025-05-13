"use client";
import { api } from "@/util/api";
import { useEffect, useState } from "react";
import Preloader from "../../common/Preloader";

type CourseProgress = {
  id: number;
  title: string;
  progress_percentage: number;
  total_classes: number;
  completed_classes: number;
  image_url?: string;
  instructor: {
    id: number;
    name: string;
  };
};

type Assignment = {
  id: number;
  title: string;
  due_date: string;
  status: "completed" | "pending" | "overdue";
  course: {
    id: number;
    title: string;
  };
};

type Activity = {
  id: number;
  activity_type: string;
  description: string;
  timestamp: string;
  course?: {
    id: number;
    title: string;
  };
};

export const StudentProgress = () => {
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState({
    courses: true,
    assignments: true,
    activities: true,
  });
  const [error, setError] = useState<{ [key: string]: string | null }>({
    courses: null,
    assignments: null,
    activities: null,
  });

  const fetchCourseProgress = async () => {
    try {
      const response = await api.get("/student/course-progress");
      if (response.status === 200) {
        setCourseProgress(response.data);
        setError((prev) => ({ ...prev, courses: null }));
      } else {
        setError((prev) => ({
          ...prev,
          courses: "Failed to load course progress",
        }));
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
      setError((prev) => ({ ...prev, courses: "Failed to fetch data" }));
    } finally {
      setLoading((prev) => ({ ...prev, courses: false }));
    }
  };

  const fetchAssignments = async () => {
    try {
      const response = await api.get("/student/assignments");
      if (response.status === 200) {
        setAssignments(response.data);
        setError((prev) => ({ ...prev, assignments: null }));
      } else {
        setError((prev) => ({
          ...prev,
          assignments: "Failed to load assignments",
        }));
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError((prev) => ({ ...prev, assignments: "Failed to fetch data" }));
    } finally {
      setLoading((prev) => ({ ...prev, assignments: false }));
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await api.get("/student/recent-activities");
      if (response.status === 200) {
        setActivities(response.data);
        setError((prev) => ({ ...prev, activities: null }));
      } else {
        setError((prev) => ({
          ...prev,
          activities: "Failed to load activities",
        }));
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setError((prev) => ({ ...prev, activities: "Failed to fetch data" }));
    } finally {
      setLoading((prev) => ({ ...prev, activities: false }));
    }
  };

  useEffect(() => {
    fetchCourseProgress();
    fetchAssignments();
    fetchActivities();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
      {/* Course Progress Section */}
      <div className="md:col-span-7 bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">
          Course Progress
        </h2>

        {loading.courses ? (
          <Preloader />
        ) : error.courses ? (
          <div className="text-red-600 dark:text-red-400">
            ⚠ {error.courses}
          </div>
        ) : courseProgress.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No courses found.
          </div>
        ) : (
          <div className="space-y-4">
            {courseProgress.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Instructor: {course.instructor.name}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {course.progress_percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 dark:bg-gray-700">
                  <div
                    className="bg-brand-600 h-2.5 rounded-full dark:bg-brand-500"
                    style={{ width: `${course.progress_percentage}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {course.completed_classes} of {course.total_classes} classes
                  completed
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assignments & Activities Section */}
      <div className="md:col-span-5 space-y-6">
        {/* Assignments Section */}
        <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">
            Upcoming Assignments
          </h2>

          {loading.assignments ? (
            <Preloader />
          ) : error.assignments ? (
            <div className="text-red-600 dark:text-red-400">
              ⚠ {error.assignments}
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No upcoming assignments.
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.slice(0, 5).map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex justify-between items-center border-b border-gray-200 pb-3 dark:border-gray-700"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {assignment.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {assignment.course.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Due: {assignment.due_date}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusColor(
                      assignment.status
                    )}`}
                  >
                    {assignment.status.charAt(0).toUpperCase() +
                      assignment.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities Section */}
        <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-white">
            Recent Activities
          </h2>

          {loading.activities ? (
            <Preloader />
          ) : error.activities ? (
            <div className="text-red-600 dark:text-red-400">
              ⚠ {error.activities}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No recent activities.
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 border-b border-gray-200 pb-3 dark:border-gray-700"
                >
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-brand-600"></div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.description}
                    </p>
                    {activity.course && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.course.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
