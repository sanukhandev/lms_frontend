    "use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/util/api";
import InstructorTable from "@/components/tables/InstructorTable";

type Instructor = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  secondary_phone?: string;
  created_at: string;
};

export default function Instructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await api.get("/instructors");
      setInstructors(response.data.data || []);
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <ComponentCard
        title="Instructors Table"
        buttonText="Add Instructor"
        buttonLink="/admin/instructors/create"
        className="mb-6"
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <InstructorTable items={instructors} />
        )}
      </ComponentCard>
    </div>
  );
}
