"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import DatePicker from "@/components/form/date-picker";
import { api } from "@/util/api";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor_id: "",
    duration_weeks: "",
    syllabus: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/courses", {
        ...form,
        syllabus: [], // currently static, you can expand later
      });
      alert("Course created successfully!");
      router.push("/admin/courses"); // Redirect to course list page
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <ComponentCard title="Create New Course" buttonText="Back to Courses" buttonLink="/admin/courses">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div>
            <Label>Title <span className="text-error-500">*</span></Label>
            <Input
              type="text"
              name="title"
              placeholder="Course title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Course Description */}
          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              placeholder="Short course description"
              className="h-32 w-full rounded-lg border border-gray-300 p-4 dark:bg-gray-900 dark:border-gray-700"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* Instructor Select (Optional) */}
          <div>
            <Label>Instructor</Label>
            <Select
              placeholder="Select an instructor"
              options={[
                { value: "1", label: "John Doe" },
                { value: "2", label: "Jane Smith" },
                { value: "3", label: "Another Instructor" },
              ]}
              onChange={(value) => setForm({ ...form, instructor_id: value })}
            />
          </div>

          {/* Duration Weeks */}
          <div>
            <Label>Duration (Weeks) <span className="text-error-500">*</span></Label>
            <Input
              type="number"
              name="duration_weeks"
              placeholder="Enter number of weeks"
              value={form.duration_weeks}
              onChange={handleChange}
              min="1"
            />
          </div>

          {/* Future: Add syllabus inputs dynamically if needed */}

          {/* Submit Button */}
          <div>
            <Button className="w-full" type="submit" size="sm" disabled={loading}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
