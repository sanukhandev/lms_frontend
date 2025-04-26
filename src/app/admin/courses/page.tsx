"use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import { api } from "@/util/api";



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
    } catch (err: any) {
      console.error(err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     

      <div className="space-y-6 mt-6">
        <ComponentCard
          title="Courses Table"
          buttonText="Add Course"
          buttonLink="/admin/course/create"
          className="mb-6"
        >
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <BasicTableOne items={courses} />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}
