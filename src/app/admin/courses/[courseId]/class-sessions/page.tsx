"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";
import MultiSelect from "@/components/form/MultiSelect";

type ClassSession = {
  id: number;
  course_id: number;
  class_date: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
};

export default function ClassSessionManager() {
  const params = useParams();
  const courseId = params.courseId as string;

  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  type Course = {
    id: number;
    title: string;
    description: string;
    instructor: {
      name: string;
    };
  };
  
  const [course, setCourse] = useState<Course | null>(null);
  const [form, setForm] = useState({
    start_date: "",
    days_of_week: [] as string[],
    start_time: "",
    end_time: "",
    duration_weeks: "",
  });

  const daysOptions = [
    { value: "Monday", label: "Monday", text: "Monday", selected: false },
    { value: "Tuesday", label: "Tuesday", text: "Tuesday", selected: false },
    { value: "Wednesday", label: "Wednesday", text: "Wednesday", selected: false },
    { value: "Thursday", label: "Thursday", text: "Thursday", selected: false },
    { value: "Friday", label: "Friday", text: "Friday", selected: false },
    { value: "Saturday", label: "Saturday", text: "Saturday", selected: false },
    { value: "Sunday", label: "Sunday", text: "Sunday", selected: false },
  ];

  useEffect(() => {
    Promise.all([fetchCourseDetails(), fetchSessions()])
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, []);

  const fetchCourseDetails = async () => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      if (response.data) {
        setCourse(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load course details");
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await api.get(`courses/${courseId}/class-sessions`);
      setSessions(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load class sessions");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleDaysChange = (days: string[]) => {
    setForm({ ...form, days_of_week: days });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/class-sessions/generate", {
        course_id: courseId,
        ...form,
        duration_weeks: Number(form.duration_weeks), // ensure correct type
      });
      alert("Class sessions generated successfully!");
      fetchSessions();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMeeting = async (sessionId: number) => {
    try {
      await api.post(`/class-sessions/${sessionId}/start-meeting`);
      alert("Meeting link generated!");
      fetchSessions();
    } catch (err) {
      console.error(err);
      alert("Failed to start meeting");
    }
  };

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <ComponentCard
        title={ `Generate Class Schedule for ${course?.title} (#${course?.id})`}
        buttonText="Back to Courses"
        buttonLink="/admin/courses"
          >
              <p className="text-sm text-gray-500 mb-4">
                  {course?.description} <br />
                    <strong>Instructor:</strong> {course?.instructor?.name} <br />
                  Generate a class schedule for the course. Select the start date, days of the week, start and end times, and duration in weeks.
                </p>
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <Label>Start Date <span className="text-error-500">*</span></Label>
            <Input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleFormChange}
              
            />
          </div>

          <div>
            <Label>Days of Week <span className="text-error-500">*</span></Label>
            <MultiSelect
              label="Select Days"
              options={daysOptions}
              onChange={handleDaysChange}
            />
          </div>

          <div>
            <Label>Start Time <span className="text-error-500">*</span></Label>
            <Input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleFormChange}
              
            />
          </div>

          <div>
            <Label>End Time <span className="text-error-500">*</span></Label>
            <Input
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleFormChange}
              
            />
          </div>

          <div>
            <Label>Duration (Weeks) <span className="text-error-500">*</span></Label>
            <Input
              type="number"
              name="duration_weeks"
              value={form.duration_weeks}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <Button type="submit" size="sm" className="w-full" disabled={loading || form.days_of_week.length === 0}>
              {loading ? "Generating..." : "Generate Schedule"}
            </Button>
          </div>
        </form>
      </ComponentCard>

      {/* Sessions List */}
      <ComponentCard title="Scheduled Classes">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider">Start</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider">End</th>
                  <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider">Meeting</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{session.class_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{session.start_time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{session.end_time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {session.meeting_link ? (
                          <a
                            href={"class-sessions/"+session.id+"/meeting"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Join
                          </a>
                        ) : (
                          "Not started"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {!session.meeting_link && (
                          <Button type="button" size="sm" onClick={() => handleStartMeeting(session.id)}>
                            Start Meeting
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      No sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
