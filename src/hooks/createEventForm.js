// ./hooks/createEventForm.js
import { useState } from "react";

export default function useEventForm(coordsByLocation, selectedDate) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const todayDMY = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // DD/MM/YYYY
  };

  const openForm = () => {
    const today = todayDMY();
    let prefill = today;
    if (selectedDate) {
      const [y, m, d] = selectedDate.split("-").map(Number);
      const selected = new Date(y, m - 1, d);
      const now = new Date();
      if (
        selected >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
      ) {
        prefill = `${String(d).padStart(2, "0")}/${String(m).padStart(
          2,
          "0"
        )}/${y}`;
      }
    }
    setForm((f) => ({ ...f, date: prefill }));
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const addEvent = (e, setEvents) => {
    e.preventDefault();
    const coords = coordsByLocation[form.location] || null;
    setEvents((prev) => [...prev, { ...form, coords }]);
    // Reset and close
    setForm({ title: "", date: "", time: "", location: "", description: "" });
    setShowForm(false);
  };

  return {
    showForm,
    form,
    setForm,
    openForm,
    closeForm,
    addEvent,
  };
}
