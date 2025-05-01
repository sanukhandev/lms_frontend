"use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/util/api";
import InstructorTable from "@/components/tables/InstructorTable";
import Preloader from "@/components/common/Preloader"; // Import Preloader for smooth UI

type Instructor = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  secondry_phone?: string;
  created_at: string;
};

export default function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors();
  }, []);

  // Function to fetch instructors
  const fetchInstructors = async () => {
    try {
      const response = await api.get("/instructors");
      setInstructors(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  // If loading, display the preloader
  if (loading) return <Preloader />;

  // If there's an error, show the error message
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6 mt-6">
      <ComponentCard
        title="Instructors Table"
        buttonText="Add Instructor"
        buttonLink="/admin/instructors/create"
        className="mb-6"
      >
        {instructors.length === 0 ? (
          <p>No instructors available.</p>
        ) : (
          <InstructorTable items={instructors} />
        )}
      </ComponentCard>
    </div>
  );
}
