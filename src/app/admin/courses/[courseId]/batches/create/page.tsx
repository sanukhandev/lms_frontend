"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";
import MultiSelect from "@/components/form/MultiSelect";
import CourseInfoCard from "@/components/user-profile/CourseInfoCard";
import Preloader from "@/components/common/Preloader"; // Import Preloader for global use

export default function CreateBatchPage() {
  const { courseId } = useParams(); // Fetching the courseId from URL params
  const router = useRouter();

  // Initializing state variables
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<{
    id: number;
    title: string;
    description: string;
    instructor: {
      email: string;
      name: string;
      phone: string;
      id: number;
    };
    duration_weeks: number;
    syllabus: string[];
  } | null>(null);

  const [form, setForm] = useState({
    course_id: courseId, // Initially setting course_id from URL params
    name: "",
    start_date: "",
    end_date: "",
    session_days: [] as string[],
    session_start_time: "",
    session_end_time: "",
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle session days change
  const handleSessionDaysChange = (selectedDays: string[]) => {
    setForm({ ...form, session_days: selectedDays });
  };

  // Fetch course details based on courseId
  const fetchCourseDetails = async () => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data.data); // Setting the course data
    } catch (err) {
      console.error("Error fetching course details", err);
      setError("Failed to load course details");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send the batch data to the server
      await api.post("/batches", {
        ...form,
        session_time: {
          start: form.session_start_time,
          end: form.session_end_time,
        },
      });

      // After success, redirect to the batches list
      alert("Batch created successfully!");
      router.back();
    } catch (err) {
      console.error("Error creating batch:", err);
      setError("Failed to create batch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(); // Fetch course details on page load
    }
  }, [courseId]);

  if (loading) return <Preloader />; // Use preloader during loading state
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <ComponentCard
        title="Create New Batch"
        buttonText="Back to Batches"
        buttonLink="/admin/batches"
      >
        {course ? (
          <>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
              Course Information
            </h4>
            <CourseInfoCard
              course={course} // Passing the complete course object
              onUpdate={() => {}}
            />
          </>
        ) : (
          <p>Loading course information...</p>
        )}
      </ComponentCard>

      <ComponentCard title="Batch Details">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch Name */}
          <div>
            <Label>
              Name <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="Batch name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Start Date */}
          <div>
            <Label>
              Start Date <span className="text-error-500">*</span>
            </Label>
            <Input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
            />
          </div>

          {/* End Date */}
          <div>
            <Label>
              End Date <span className="text-error-500">*</span>
            </Label>
            <Input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>

          {/* Session Days */}
          <div>
            <Label>
              Session Days <span className="text-error-500">*</span>
            </Label>
            <MultiSelect
              label="Select Days"
              options={[
                { value: "Monday", text: "Monday", selected: false },
                { value: "Tuesday", text: "Tuesday", selected: false },
                { value: "Wednesday", text: "Wednesday", selected: false },
                { value: "Thursday", text: "Thursday", selected: false },
                { value: "Friday", text: "Friday", selected: false },
                { value: "Saturday", text: "Saturday", selected: false },
                { value: "Sunday", text: "Sunday", selected: false },
              ]}
              onChange={handleSessionDaysChange}
            />
          </div>

          {/* Start Time */}
          <div>
            <Label>
              Start Time <span className="text-error-500">*</span>
            </Label>
            <Input
              type="time"
              name="session_start_time"
              value={form.session_start_time}
              onChange={handleChange}
            />
          </div>

          {/* End Time */}
          <div>
            <Label>
              End Time <span className="text-error-500">*</span>
            </Label>
            <Input
              type="time"
              name="session_end_time"
              value={form.session_end_time}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              className="w-full"
              type="submit"
              size="sm"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Batch"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
