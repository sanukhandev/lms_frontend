"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";
import Preloader from "@/components/common/Preloader";

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [instructors, setInstructors] = useState<
    { value: string; label: string }[]
  >([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor_id: "",
    duration_weeks: "",
    syllabus: [],
  });

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/courses", {
        ...form,
        syllabus: [], // Add dynamic syllabus if needed
      });
      alert("Course created successfully!");
      router.push("/admin/courses");
    } catch (err) {
      console.error("Error creating course:", err);
      alert("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch instructors
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/instructors");
      const instructorOptions = res.data.data.map(
        (instructor: { id: number; name: string }) => ({
          value: instructor.id.toString(),
          label: instructor.name,
        })
      );
      setInstructors(instructorOptions);
    } catch (err) {
      console.error("Failed to fetch instructors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  if (loading) return <Preloader />; // Show preloader when loading

  return (
    <div className="p-6">
      <ComponentCard
        title="Create New Course"
        buttonText="Back to Courses"
        buttonLink="/admin/courses"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Title */}
          <div>
            <Label>
              Title <span className="text-error-500">*</span>
            </Label>
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

          {/* Instructor Select */}
          <div>
            <Label>Instructor</Label>
            <Select
              placeholder="Select an instructor"
              options={instructors}
              onChange={(value) => setForm({ ...form, instructor_id: value })}
            />
          </div>

          {/* Duration Weeks */}
          <div>
            <Label>
              Duration (Weeks) <span className="text-error-500">*</span>
            </Label>
            <Input
              type="number"
              name="duration_weeks"
              placeholder="Enter number of weeks"
              value={form.duration_weeks}
              onChange={handleChange}
              min="1"
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
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
