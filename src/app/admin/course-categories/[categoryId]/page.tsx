"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";
import Preloader from "@/components/common/Preloader";
import { CourseCategory } from "@/components/tables/CategoryTable";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.categoryId as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });

  // Fetch category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/course-categories/${categoryId}`);
        const categoryData = response.data.data;
        
        if (categoryData) {
          setForm({
            name: categoryData.name || "",
            description: categoryData.description || "",
          });
          setError("");
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

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
      await api.put(`/course-categories/${categoryId}`, form);
      alert("Category updated successfully!");
      router.push("/admin/course-categories");
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Preloader />;

  if (error) {
    return (
      <div className="p-6">
        <ComponentCard
          title="Edit Category"
          buttonText="Back to Categories"
          buttonLink="/admin/course-categories"
        >
          <p className="text-red-500">{error}</p>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ComponentCard
        title="Edit Category"
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
              required
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
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

