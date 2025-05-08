"use client";

import { useEffect, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { api } from "@/util/api";
import CategoryTable, { CourseCategory } from "@/components/tables/CategoryTable";
import Preloader from "@/components/common/Preloader";

export default function CourseCategories() {
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/course-categories");
      setCategories(response.data.data || []);
      setError("");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to load course categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this category? This action cannot be undone.");
    
    if (confirmDelete) {
      try {
        setLoading(true);
        await api.delete(`/course-categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete category. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <ComponentCard
        title="Course Categories"
        buttonText="Add Category"
        buttonLink="/admin/course-categories/create"
        className="mb-6"
      >
        {loading ? (
          <Preloader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <CategoryTable items={categories} onDelete={handleDelete} />
        )}
      </ComponentCard>
    </div>
  );
}

