"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { api } from "@/util/api";

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Corrected the state property name from `secondry_phone` to `secondry_phone `
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    secondry_phone: "", // corrected the typo here
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message before submitting

    try {
      await api.post("/students", form);
      alert("Student created successfully!");
      router.push("/admin/students");
    } catch (err: unknown) {
      console.error(err);
      setError("Failed to create student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <ComponentCard
        title="Create New Student"
        buttonText="Back to Students"
        buttonLink="/admin/students"
      >
        {/* Display error message if any */}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label>
              Name <span className="text-error-500">*</span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="Student name"
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
              placeholder="Student email"
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
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Secondary Phone */}
          <div>
            <Label>Secondary Phone</Label>
            <Input
              type="text"
              name="secondry_phone " // corrected name here as well
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
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Student"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
