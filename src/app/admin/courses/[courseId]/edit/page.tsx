"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";
import Preloader from "@/components/common/Preloader";

// Define types for better type checking
interface CourseForm {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category_id: string;
  duration_weeks: string;
  syllabus: string[];
}

interface FormErrors {
  title?: string;
  category_id?: string;
  duration_weeks?: string;
  general?: string;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [instructorLoading, setInstructorLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [instructorError, setInstructorError] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");
  const [instructors, setInstructors] = useState<
    { value: string; label: string }[]
  >([]);
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [form, setForm] = useState<CourseForm>({
    id: "",
    title: "",
    description: "",
    instructor_id: "",
    category_id: "",
    duration_weeks: "",
    syllabus: [],
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch course data
  const fetchCourse = async () => {
    setCourseLoading(true);
    setCourseError("");
    try {
      const response = await api.get(`/courses/${courseId}`);
      const course = response.data.data;

      if (course) {
        setForm({
          id: course.id.toString(),
          title: course.title || "",
          description: course.description || "",
          instructor_id: course.instructor?.id.toString() || "",
          category_id: course.category?.id.toString() || "",
          duration_weeks: course.duration_weeks?.toString() || "",
          syllabus: course.syllabus || [],
        });
      } else {
        setCourseError("Course not found");
      }
    } catch (err) {
      console.error("Error fetching course:", err);
      setCourseError("Failed to load course data. Please try again later.");
    } finally {
      setCourseLoading(false);
    }
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!form.category_id) {
      newErrors.category_id = "Category is required";
    }

    if (!form.duration_weeks || parseInt(form.duration_weeks) <= 0) {
      newErrors.duration_weeks = "Valid duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/courses/${courseId}`, {
        ...form,
        syllabus: form.syllabus || [], // Maintain existing syllabus or empty array
      });
      alert("Course updated successfully!");
      router.push("/admin/courses");
    } catch (err) {
      console.error("Error updating course:", err);
      setErrors({
        ...errors,
        general: "Failed to update course. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch instructors
  const fetchInstructors = async () => {
    setInstructorLoading(true);
    setInstructorError("");
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
      setInstructorError(
        "Failed to load instructors. Please refresh the page."
      );
    } finally {
      setInstructorLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    setCategoryLoading(true);
    setCategoryError("");
    try {
      const res = await api.get("/course-categories");
      const categoryOptions = res.data.data.map(
        (category: { id: number; name: string }) => ({
          value: category.id.toString(),
          label: category.name,
        })
      );
      setCategories(categoryOptions);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setCategoryError("Failed to load categories. Please refresh the page.");
    } finally {
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourse();
      fetchInstructors();
      fetchCategories();
    }
  }, [courseId]);

  // Determine if the page is in a loading state
  const isPageLoading = courseLoading || instructorLoading || categoryLoading;

  if (isPageLoading) return <Preloader />;

  if (courseError) {
    return (
      <div className="p-6">
        <ComponentCard
          title="Edit Course"
          buttonText="Back to Courses"
          buttonLink="/admin/courses"
        >
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-red-600">{courseError}</p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ComponentCard
        title="Edit Course"
        buttonText="Back to Courses"
        buttonLink="/admin/courses"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
              <p className="text-red-600">{errors.general}</p>
            </div>
          )}

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
              error={!!errors.title}
              hint={errors.title}
            />
          </div>

          {/* Category Select */}
          <div>
            <Label>
              Category <span className="text-error-500">*</span>
            </Label>
            {categoryLoading ? (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500"></div>
                <span>Loading categories...</span>
              </div>
            ) : categoryError ? (
              <div className="text-red-500 text-sm mt-1 mb-2">
                {categoryError}
              </div>
            ) : (
              <>
                <Select
                  placeholder="Select a category"
                  options={categories}
                  defaultValue={form.category_id}
                  onChange={(value) => {
                    setForm({ ...form, category_id: value });
                    // Clear error when user selects a value
                    if (errors.category_id) {
                      setErrors({ ...errors, category_id: undefined });
                    }
                  }}
                />
                {errors.category_id && (
                  <p className="mt-1 text-xs text-error-500">
                    {errors.category_id}
                  </p>
                )}
              </>
            )}
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
            {instructorLoading ? (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand-500"></div>
                <span>Loading instructors...</span>
              </div>
            ) : instructorError ? (
              <div className="text-red-500 text-sm mt-1 mb-2">
                {instructorError}
              </div>
            ) : (
              <Select
                placeholder="Select an instructor"
                options={instructors}
                defaultValue={form.instructor_id}
                onChange={(value) => setForm({ ...form, instructor_id: value })}
              />
            )}
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
              error={!!errors.duration_weeks}
              hint={errors.duration_weeks}
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              className="w-full"
              type="submit"
              size="sm"
              disabled={submitting}
            >
              {submitting ? "Updating..." : "Update Course"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
