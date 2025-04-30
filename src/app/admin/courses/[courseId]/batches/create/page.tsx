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

export default function CreateBatchPage() {
  const { courseId } = useParams(); // Fetching the courseId from URL params
  const router = useRouter();

  // Initializing state variables
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<{ value: string; label: string }[]>(
    []
  );
  const [form, setForm] = useState({
    course_id: courseId, // Initially setting course_id from URL params
    name: "",
    start_date: "",
    end_date: "",
    session_days: [] as string[],
    session_start_time: "",
    session_end_time: "",
  });

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      router.push("/admin/batches");
    } catch (err) {
      console.error("Error creating batch:", err);
      alert("Failed to create batch.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the courses available for selection
  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      const courseOptions = res.data.data.map(
        (course: { id: number; title: string }) => ({
          value: course.id.toString(),
          label: course.title,
        })
      );
      setCourses(courseOptions);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  // Fetch courses once when the page loads
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6">
      <ComponentCard
        title="Create New Batch"
        buttonText="Back to Batches"
        buttonLink="/admin/batches"
          >
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Course Information
              </h4>
                <CourseInfoCard
                    course={{
                        id: Number(courseId),
                        title: "",
                        description: "",
                        instructor_id: "",
                        duration_weeks: 0,
                        syllabus: [],
                    }}
                  onUpdate={() => { }}
                />
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
