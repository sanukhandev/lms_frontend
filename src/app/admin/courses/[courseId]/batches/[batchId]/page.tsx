"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/util/api";
import ComponentCard from "@/components/common/ComponentCard";
import Link from "next/link";
import StudentTable from "@/components/ecommerce/StudentsTable";
import BatchInfoCard from "@/components/user-profile/BatchCardInfo";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import MultiSelect from "@/components/form/MultiSelect";
import Preloader from "@/components/common/Preloader";

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
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [studentsToAdd, setStudentsToAdd] = useState<Student[]>([]);

  useEffect(() => {
    if (batchId) fetchBatchById();
  }, [batchId]);

  const fetchBatchById = async () => {
    try {
      const batchResponse = await api.get(`/batches/${batchId}`);
      setBatch(batchResponse.data.data);

      // Fetch all students
      const studentsResponse = await api.get("/students");
      console.log("Students Response:", studentsResponse); // Log the response for debugging

      const studentsInBatchIds = batchResponse.data.data.students.map(
        (student: Student) => student.id
      );
      if (Array.isArray(studentsResponse.data.data)) {
        const unassignedStudents = studentsResponse.data.data.filter(
          (student: Student) => !studentsInBatchIds.includes(student.id)
        );
        setAvailableStudents(unassignedStudents); // Set available students
      } else {
        setError("Invalid students data structure.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load batch data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddStudents = async () => {
    try {
      const selectedStudentIds = studentsToAdd.map((student) => student.id);
      await api.put(`/batches/${batch?.id}/students`, {
        student_ids: selectedStudentIds,
      });
      fetchBatchById(); // Re-fetch the batch data after adding students
      setModalOpen(false); // Close the modal
    } catch (err) {
      console.error("Error adding students:", err);
      setError("Failed to add students.");
    }
  };

  if (loading) return <Preloader/>
  if (error || !batch) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8 mt-6">
      <ComponentCard title="Batch Details">
        <BatchInfoCard batch={batch} onUpdate={fetchBatchById} />
      </ComponentCard>

      <ComponentCard
        title="Students"
        buttonText="Add Student"
        onModalOpen={handleOpenModal} // Trigger modal open
      >
        {batch.students.length > 0 ? (
          <StudentTable students={batch.students} />
        ) : (
          <p>No students assigned.</p>
        )}
      </ComponentCard>

      {/* Add Students Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        className="max-w-3xl m-4"
      >
        <div className="w-full overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-10">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
            Add Students to Batch
          </h4>

          <div className="mb-6">
            <MultiSelect
              label="Select Students"
              options={availableStudents.map((student) => ({
                value: student.id.toString(),
                text: `${student.name} (${student.email})`,
                selected: false,
              }))}
              onChange={(selectedIds) => {
                const selectedStudents = availableStudents.filter((student) =>
                  selectedIds.includes(student.id.toString())
                );
                setStudentsToAdd(selectedStudents);
              }}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCloseModal} size="sm">
              Cancel
            </Button>
            <Button onClick={handleAddStudents} size="sm">
              Add Students
            </Button>
          </div>
        </div>
      </Modal>

      {/* Class Sessions Table */}
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
