"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/util/api";
import BatchTable from "@/components/tables/BatchTable";

type Batch = {
  id: number;
  course_id: number;
  name: string;
  start_date: string;
  end_date: string;
  session_days: string[];
  session_start_time: string;
  session_end_time: string;
  class_sessions: unknown[]; // You can define a type later
};

export default function Batches() {
  const { courseId } = useParams();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (courseId) fetchBatchesByCourseId();
  }, [courseId]);

  const fetchBatchesByCourseId = async () => {
    try {
      const response = await api.get(`/batches/course/${courseId}`);
      setBatches(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load batches for the selected course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <ComponentCard
        title="Course Batches"
        buttonText="Add Batch"
        buttonLink={`/admin/batches/create?courseId=${courseId}`}
        className="mb-6"
      >
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : batches.length === 0 ? (
          <p className="text-gray-500">No batches found for this course.</p>
        ) : (
          <BatchTable items={batches} />
        )}
      </ComponentCard>
    </div>
  );
}
