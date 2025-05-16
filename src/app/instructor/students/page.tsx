"use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/util/api";
import StudentTable from "@/components/tables/StudentTable";
import Preloader from "@/components/common/Preloader"; // Import Preloader component

type Student = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  secondry_phone?: string;
  created_at: string;
};

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data.data || []); // Store the fetched students
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load students. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Show preloader while fetching data
  if (loading) return <Preloader />;

  return (
    <div className="space-y-6 mt-6">
      <ComponentCard
        title="Students Table"
        buttonText="Add Student"
        buttonLink="/instructor/students/create"
        className="mb-6"
      >
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <StudentTable items={students} />
        )}
      </ComponentCard>
    </div>
  );
}
