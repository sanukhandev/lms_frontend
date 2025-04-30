"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/util/api";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import StudentTable from "@/components/ecommerce/StudentsTable";
import BatchInfoCard from "@/components/user-profile/BatchCardInfo";

interface Student {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface ClassSession {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  topic: string | null;
  notes: string | null;
}

interface Batch {
  id: number;
  course_id: number;
  name: string;
  start_date: string;
  end_date: string;
  session_days: string[];
  session_start_time: string;
  session_end_time: string;
  students: Student[];
  class_sessions: ClassSession[];
}

export default function BatchDetailsPage() {
  const { batchId } = useParams();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

  useEffect(() => {
    if (batchId) fetchBatchById();
  }, [batchId]);

  const fetchBatchById = async () => {
    try {
      const response = await api.get(`/batches/${batchId}`);
      setBatch(response.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load batch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error || !batch) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8 mt-6">
      <ComponentCard title="Batch Details">
        <BatchInfoCard batch={batch} onUpdate={fetchBatchById} />
      </ComponentCard>

      <ComponentCard
        title="Students"
        buttonText="Add Student"
        buttonLink={`/admin/batches/${batch.id}/add-student`}
      >
        {batch.students.length > 0 ? (
          <StudentTable students={batch.students} />
        ) : (
          <p>No students assigned.</p>
        )}
      </ComponentCard>

      <ComponentCard title="Class Sessions">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Topic</th>
              <th className="p-2">Notes</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batch.class_sessions.map((session) => (
              <tr key={session.id} className="border-b">
                <td className="p-2">{session.date}</td>
                <td className="p-2">
                  {session.start_time} - {session.end_time}
                </td>
                <td className="p-2">{session.topic || "-"}</td>
                <td className="p-2">{session.notes || "-"}</td>
                <td className="p-2">
                  <Link
                    className="text-blue-500 hover:underline"
                    href={`/admin/batches/${batch.id}/class-sessions/${session.id}`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ComponentCard>
    </div>
  );
}
