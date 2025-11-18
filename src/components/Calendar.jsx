import React, { useState, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// Convert "MM/DD/YYYY" (how you type dates in the form)
// into "YYYY-MM-DD" (what FullCalendar uses internally)
function toISOFromMMDDYYYY(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("/");
  if (parts.length !== 3) return "";
  const [mm, dd, yyyy] = parts;
  if (!mm || !dd || !yyyy) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export default function StyledGoogleCalendar({ events = [], onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (info) => {
    // FullCalendar gives you "YYYY-MM-DD" here
    setSelectedDate(info.dateStr);
    if (onDateSelect) {
      onDateSelect(info.dateStr);
    }
  };

  // Build events for FullCalendar using ISO dates
  const fcEvents = useMemo(
    () =>
      events
        .filter((e) => e.date)
        .map((e, index) => ({
          id: e.id ?? String(index),
          title: e.title ?? "",
          start: toISOFromMMDDYYYY(e.date),
        }))
        .filter((e) => !!e.start), 
    [events]
  );

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 rounded-xl shadow-xl text-white p-2 text-sm">
      <h2 className="text-lg font-bold mb-2 text-center">Calendar</h2>

      <div className="flex-1 overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          selectable={true}
          dateClick={handleDateClick}
          navLinks={true}
          events={fcEvents}
          dayCellClassNames={(arg) => {
            let classes =
              "transition-colors duration-200 rounded-lg cursor-pointer text-xs p-1";

            const today = new Date();
            const day = arg.date;

            // Highlight today
            if (
              day.getDate() === today.getDate() &&
              day.getMonth() === today.getMonth() &&
              day.getFullYear() === today.getFullYear()
            ) {
              classes += " bg-red-600 text-white font-semibold";
            }

            // Highlight selected date from clicking
            if (selectedDate === day.toISOString().split("T")[0]) {
              classes += " ring-2 ring-red-400 bg-red-500 font-bold";
            }

            // Hover effect
            classes += " hover:bg-red-700";

            return classes;
          }}
        />
      </div>
    </div>
  );
}