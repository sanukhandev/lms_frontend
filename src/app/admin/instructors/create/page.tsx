"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";
import Preloader from "@/components/common/Preloader"; // Import Preloader

export default function CreateInstructorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    secondry_phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.email) {
      setError("Name and Email are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/instructors", form);
      alert("Instructor created successfully!");
      router.push("/admin/instructors"); // Redirect to instructor list page
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to create instructor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Preloader />; // Show preloader while creating the instructor

  return (
    <div className="p-6">
      <ComponentCard
        title="Create New Instructor"
        buttonText="Back to Instructors"
        buttonLink="/admin/instructors"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Show error message */}
          {/* Name */}
          <div>
            <Label>
              Name <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="Instructor name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          {/* Email */}
          <div>
            <Label>
              Email <span className="text-error-500">*</span>
            </Label>
            <Input
              type="email"
              name="email"
              placeholder="Instructor email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              type="text"
              name="phone"
              placeholder="Primary phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          {/* Secondary Phone */}
          <div>
            <Label>Secondary Phone</Label>
            <Input
              type="text"
              name="secondry_phone "
              placeholder="Secondary phone number"
              value={form.secondry_phone}
              onChange={handleChange}
            />
          </div>
          {/* Submit Button */}
          <div>
            <Button
              className="w-full"
              type="submit"
              size="sm"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Creating..." : "Create Instructor"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
