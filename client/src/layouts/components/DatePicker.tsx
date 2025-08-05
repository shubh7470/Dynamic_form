"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types
type DatePickerProps = {
  placeholder?: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  type?: "date" | "month" | "year";
  error?: string; // Optional error message
  width?: string; // Optional width for the button
};

export default function DatePicker({
  placeholder = "Pick a date",
  date,
  setDate,
  type = "date",
  error = "",
  width = "100%",
}: DatePickerProps) {
  // Choose format based on type
  const getFormat = () => {
    switch (type) {
      case "month":
        return "LLLL yyyy"; // Example: September 2025
      case "year":
        return "yyyy"; // Example: 2025
      case "date":
      default:
        return "PPP"; // Example: Sep 26, 2025
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={`w-${width} justify-start text-left font-normal ${
            !date && "text-muted-foreground"
          } ${error ? "border-red-500" : ""}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, getFormat()) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          // customize based on type
          captionLayout={type === "year" ? "dropdown" : "dropdown"}
          fromYear={1970}
          toYear={new Date().getFullYear() + 10}
          // limit view based on type
          // you can customize calendar behavior based on your `Calendar` component support
        />
      </PopoverContent>
    </Popover>
  );
}
