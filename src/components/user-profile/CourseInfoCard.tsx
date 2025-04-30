"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { api } from "@/util/api";



interface Course {
  id: string | number;
  title: string;
  description: string;
  instructor_id: string | number;
  duration_weeks: number;
  syllabus: string[];
}

export default function CourseInfoCard({
  course,
  onUpdate,
}: {
  course: Course;
  onUpdate: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<Course>({ ...course });

  const handleInputChange = (
    field: keyof Course,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Sending the updated course data to the API
    api
      .put(`/courses/${formData.id}`, formData)
      .then((response) => {
        closeModal();
        onUpdate(); // Call the onUpdate function to refresh the data
        console.log("Course updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating course:", error);
        setError("Failed to update course. Please try again.");
      });
  };

  return (
    <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Course Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Title: {formData.title}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Description: {formData.description}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Instructor ID: #{formData.instructor_id}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Duration: {formData.duration_weeks} weeks
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Syllabus: {formData.syllabus.join(", ") || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-4 lg:mt-0">
          <Button onClick={openModal} size="sm">
            Edit
          </Button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-3xl m-4">
        <div className="w-full overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-6 lg:p-10">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-6">
            Edit Course Information
          </h4>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Course Title</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div>
                <Label>Course Description</Label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Instructor ID</Label>
                <Input
                  type="number"
                  value={formData.instructor_id}
                  onChange={(e) =>
                    handleInputChange("instructor_id", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Duration (Weeks)</Label>
                <Input
                  type="number"
                  value={formData.duration_weeks}
                  onChange={(e) =>
                    handleInputChange("duration_weeks", e.target.value)
                  }
                />
              </div>

              {/* Syllabus */}
              <div className="md:col-span-2">
                <Label>Syllabus</Label>
                <Input
                  type="text"
                  value={formData.syllabus.join(", ")}
                  onChange={(e) =>
                    handleInputChange("syllabus", e.target.value.split(", "))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeModal} size="sm">
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
