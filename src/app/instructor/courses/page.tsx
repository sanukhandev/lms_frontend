"use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/util/api";
import CourseTable from "@/components/tables/CourseTable";
import Preloader from "@/components/common/Preloader";

type Course = {
  id: number;
  title: string;
  description: string;
  instructor?: {
    id: number;
    name: string;
  };
  syllabus?: string[];
  duration_weeks: number;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data.data || []);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <ComponentCard
        title="Courses Table"
        buttonText="Add Course"
        buttonLink="/instructor/courses/create" // Fixed the extra space in the URL
        className="mb-6"
      >
        {loading ? (
          <Preloader /> // Use Preloader component here
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <CourseTable items={courses} route="instructor" />
        )}
      </ComponentCard>
    </div>
  );
}
