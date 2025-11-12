// ./hooks/persistentEvents.js
import { useEffect, useState } from "react";

export default function usePersistentEvents(storageKey, initialEvents = []) {
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : initialEvents;
      }
    } catch (_) {}
    return initialEvents;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(events));
    } catch (_) {}
  }, [storageKey, events]);

  return [events, setEvents];
}