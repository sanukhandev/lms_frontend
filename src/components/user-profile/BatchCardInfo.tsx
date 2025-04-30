"use client";

import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { api } from "@/util/api";
import MultiSelect from "../form/MultiSelect";
import DatePicker from "../form/date-picker";
import { TimeIcon } from "@/icons";

const WEEKDAY_OPTIONS = [
  { value: "Monday", text: "Monday", selected: false },
  { value: "Tuesday", text: "Tuesday", selected: false },
  { value: "Wednesday", text: "Wednesday", selected: false },
  { value: "Thursday", text: "Thursday", selected: false },
  { value: "Friday", text: "Friday", selected: false },
  { value: "Saturday", text: "Saturday", selected: false },
  { value: "Sunday", text: "Sunday", selected: false },
];

interface Batch {
  id: string | number;
  name: string;
  course_id: string | number;
  start_date: string;
  end_date: string;
  session_days?: string[];
  session_start_time: string;
  session_end_time: string;
}

export default function BatchInfoCard({
  batch,
  onUpdate,
}: {
  batch: Batch;
  onUpdate: () => void;
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<Batch>({ ...batch });
  const [selectedDays, setSelectedDays] = useState<string[]>(
    batch.session_days || []
  );

  const handleInputChange = (
    field: keyof Batch,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // remove the session_days from formData before sending it to the API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { session_start_time, session_end_time, ...rest } = formData;
    api
      .put(`/batches/${formData.id}`, {
        ...rest,
        session_time: {
          start: formData.session_start_time,
          end: formData.session_end_time,
        },

        session_days: selectedDays,
      })
      .then((response) => {
        closeModal();
        onUpdate(); // Call the onUpdate function to refresh the data
        console.log("Batch updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error updating batch:", error);
        setError("Failed to update batch. Please try again.");
      });
  };

  return (
    <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-white/[0.03]">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex-1">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
            Batch Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Name: {formData.name}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Course ID: #{formData.course_id}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Start Date: {formData.start_date}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              End Date: {formData.end_date}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Session Days: {selectedDays.join(", ") || "N/A"}
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Session Time: {formData.session_start_time} -{" "}
              {formData.session_end_time}
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
            Edit Batch Information
          </h4>
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Batch Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label>Course ID</Label>
                <Input
                  type="number"
                  value={formData.course_id}
                  onChange={(e) =>
                    handleInputChange("course_id", e.target.value)
                  }
                />
              </div>
              <div>
                <DatePicker
                  id="start-date"
                  label="Start Date"
                  placeholder="Select start date"
                  defaultDate={formData.start_date}
                  onChange={(d, val) => handleInputChange("start_date", val)}
                />
              </div>
              <div>
                <DatePicker
                  id="end-date"
                  label="End Date"
                  placeholder="Select end date"
                  defaultDate={formData.end_date}
                  onChange={(d, val) => handleInputChange("end_date", val)}
                />
              </div>
              <div className="md:col-span-2">
                <MultiSelect
                  label="Session Days"
                  options={WEEKDAY_OPTIONS}
                  defaultSelected={formData.session_days || []}
                  onChange={(days) => setSelectedDays(days)}
                />
              </div>
              <div>
                <Label>Start Time</Label>
                <div className="relative">
                  <Input
                    type="time"
                    value={formData.session_start_time}
                    onChange={(e) =>
                      handleInputChange("session_start_time", e.target.value)
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <TimeIcon />
                  </span>
                </div>
              </div>
              <div>
                <Label>End Time</Label>
                <div className="relative">
                  <Input
                    type="time"
                    value={formData.session_end_time}
                    onChange={(e) =>
                      handleInputChange("session_end_time", e.target.value)
                    }
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    <TimeIcon />
                  </span>
                </div>
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
