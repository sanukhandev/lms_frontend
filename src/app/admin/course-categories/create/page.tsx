"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";
import Preloader from "@/components/common/Preloader";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
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
      await api.post("/course-categories", form);
      alert("Category created successfully!");
      router.push("/admin/course-categories");
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Failed to create category.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="p-6">
      <ComponentCard
        title="Create New Category"
        buttonText="Back to Categories"
        buttonLink="/admin/course-categories"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <Label>
              Name <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="Category name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Category Description */}
          <div>
            <Label>Description</Label>
            <textarea
              name="description"
              placeholder="Category description"
              className="h-32 w-full rounded-lg border border-gray-300 p-4 dark:bg-gray-900 dark:border-gray-700"
              value={form.description}
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
              {loading ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

