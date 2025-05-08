"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/util/api";
import ComponentCard from "@/components/common/ComponentCard";
import BatchInfoCard from "@/components/user-profile/BatchCardInfo";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import MultiSelect from "@/components/form/MultiSelect";
import Preloader from "@/components/common/Preloader"; // Import Preloader for smooth loading UI
import StudentTable from "@/components/tables/StudentTable";

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  secondry_phone?: string;
  created_at: string;
}

interface ClassSession {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  topic: string | null;
  notes: string | null;
  class_status: "not_started" | "completed" | "cancelled"; // Refactored to use class_status
  meeting_link: string | null; // Link for the meeting
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
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [isManageClassModalOpen, setManageClassModalOpen] = useState(false);
  const [studentsToAdd, setStudentsToAdd] = useState<Student[]>([]);
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(
    null
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [newSessionDate, setNewSessionDate] = useState<string>("");
  const [newSessionStartTime, setNewSessionStartTime] = useState<string>("");
  const [newSessionEndTime, setNewSessionEndTime] = useState<string>("");

  useEffect(() => {
    if (batchId) fetchBatchById();
  }, [batchId]);

  const handleJoinMeeting = (sessionId: number) => {
    // Open the meeting URL in a new window with custom options
    const meetingUrl = `/meeting/${sessionId}`;

    window.open(
      meetingUrl,
      "_blank",
      "toolbar=no,scrollbars=no,resizable=no,top=100,left=100,width=800,height=600"
    );
  };
  const fetchBatchById = async () => {
    setLoading(true);
    try {
      const batchResponse = await api.get(`/batches/${batchId}`);
      setBatch(batchResponse.data.data);

      const studentsResponse = await api.get("/students");

      const studentsInBatchIds = batchResponse.data.data.students.map(
        (student: Student) => student.id
      );

      if (Array.isArray(studentsResponse.data.data)) {
        const unassignedStudents = studentsResponse.data.data.filter(
          (student: Student) => !studentsInBatchIds.includes(student.id)
        );
        setAvailableStudents(unassignedStudents);
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

  const handleOpenAddStudentModal = () => {
    setAddStudentModalOpen(true);
  };

  const handleCloseAddStudentModal = () => {
    setAddStudentModalOpen(false);
  };

  const handleOpenManageClassModal = (session: ClassSession) => {
    setSelectedSession(session);
    setManageClassModalOpen(true);
  };

  const handleCloseManageClassModal = () => {
    setManageClassModalOpen(false);
  };

  const handleAddStudents = async () => {
    setModalLoading(true);
    try {
      const selectedStudentIds = studentsToAdd.map((student) => student.id);
      await api.put(`/batches/${batch?.id}/students`, {
        student_ids: selectedStudentIds,
      });
      await fetchBatchById();
      setAddStudentModalOpen(false);
    } catch (err) {
      console.error("Error adding students:", err);
      setError("Failed to add students.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleManageClassAction = async (action: string) => {
    if (selectedSession) {
      setModalLoading(true);
      try {
        if (action === "generate_meeting") {
          await api.post(
            `/sessions/${selectedSession.id}/generate-meeting-link`
          );
        }
        if (action === "reschedule") {
          await api.post(`/sessions/${selectedSession.id}/reschedule`, {
            date: newSessionDate,
            start_time: newSessionStartTime,
            end_time: newSessionEndTime,
          });
        }

        if (action === "cancel") {
          await api.post(`/sessions/${batch?.id}/add`, {
            date: newSessionDate,
            start_time: newSessionStartTime,
            end_time: newSessionEndTime,
            class_status: "scheduled", // Adding a new class at the end
          });
        }

        fetchBatchById();
        setManageClassModalOpen(false);
      } catch (err) {
        console.error("Error during class session action:", err);
        setError("Failed to update class session.");
      } finally {
        setModalLoading(false);
      }
    }
  };

  // Check if current time is between the start and end time of the session

  if (loading) return <Preloader />;

  if (error || !batch) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8 mt-6">
      <ComponentCard title="Batch Details">
        <BatchInfoCard batch={batch} onUpdate={fetchBatchById} />
      </ComponentCard>

      <ComponentCard
        title="Students"
        buttonText="Add Student"
        onModalOpen={handleOpenAddStudentModal}
      >
        {batch.students.length > 0 ? (
          <StudentTable items={batch.students} />
        ) : (
          <p>No students assigned.</p>
        )}
      </ComponentCard>

      {/* Add Students Modal */}
      <Modal
        isOpen={isAddStudentModalOpen}
        onClose={handleCloseAddStudentModal}
        className="max-w-3xl m-4"
      >
        <div className="w-full overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-10">
          {modalLoading ? (
            <Preloader />
          ) : (
            <>
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
                    const selectedStudents = availableStudents.filter(
                      (student) => selectedIds.includes(student.id.toString())
                    );
                    setStudentsToAdd(selectedStudents);
                  }}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseAddStudentModal}
                  size="sm"
                >
                  Cancel
                </Button>
                <Button onClick={handleAddStudents} size="sm">
                  Add Students
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Manage Class Modal */}
      <Modal
        isOpen={isManageClassModalOpen}
        onClose={handleCloseManageClassModal}
        className="max-w-3xl m-4"
      >
        <div className="w-full overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-10">
          {modalLoading ? (
            <Preloader />
          ) : (
            <>
              <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
                Manage Class Session: {selectedSession?.topic}
              </h4>

              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => handleManageClassAction("generate_meeting")}
                  size="sm"
                >
                  Generate Meeting Link
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleManageClassAction("reschedule")}
                  size="sm"
                >
                  Reschedule Class
                </Button>

                <Button
                  variant="outline"
                  onClick={() => handleManageClassAction("cancel")}
                  size="sm"
                >
                  Cancel Class
                </Button>
              </div>

              {/* Postpone Date and Time Input */}
              <div className="mb-6">
                <label className="block mb-2">Select New Date</label>
                <input
                  type="date"
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">Select New Start Time</label>
                <input
                  type="time"
                  value={newSessionStartTime}
                  onChange={(e) => setNewSessionStartTime(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">Select New End Time</label>
                <input
                  type="time"
                  value={newSessionEndTime}
                  onChange={(e) => setNewSessionEndTime(e.target.value)}
                  className="w-full border rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCloseManageClassModal}
                  size="sm"
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleManageClassAction("postpone")}
                  size="sm"
                >
                  Confirm Postpone
                </Button>
              </div>
            </>
          )}
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
              <th className="p-2">Status</th>
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
                  {/* Displaying status badges */}
                  <span
                    className={`${
                      session.class_status === "completed"
                        ? "bg-success-100 text-success-800"
                        : session.class_status === "cancelled"
                        ? "bg-danger-100 text-danger-800"
                        : "bg-warning-100 text-warning-800"
                    } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                  >
                    {session.class_status.replace("_", " ").toUpperCase()}
                  </span>
                </td>
                <td className="p-2">
                  {session.meeting_link &&
                  session.class_status === "not_started" ? (
                    <Button
                      variant="outline"
                      onClick={() => handleJoinMeeting(session.id)}
                      className="text-blue-500 hover:underline"
                    >
                      Join Class
                    </Button>
                  ) : session.class_status === "completed" ? (
                    <span className="text-gray-500">Class Ended</span>
                  ) : (
                    <button
                      onClick={() => handleOpenManageClassModal(session)}
                      className="text-blue-500 hover:underline"
                    >
                      Manage Class
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ComponentCard>
    </div>
  );
}
