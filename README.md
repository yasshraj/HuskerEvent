# Nebraska Husker Events - Vite + React + Tailwind
The three tasks our prototype supports

Filtering Events
Students can use a simple search filter, sort option, calender to find only the events they care about. 

RSVP Included
Students can RSVP directly inside the app while viewing an event. They no longer need to look for outside registration links or forms. Everything they need is in one place.

Create Event & Map Integrated Alongside
The app allows you to create an event and includes a map that shows where events are happening across campus.

We developed the Google Maps integration and the Create Event feature in greater depth because they work closely together. Authorized users can create events from the home screen, enter the event details and location on the campus, and the app automatically adds a pinpoint to the campus map. This lets students instantly see new events and where they are happening, giving them a smooth and easy experience.


## How to run

1. clone the Repo.
2. Open the project in VSCode (or terminal).
3. Install dependencies:
   ```
   npm install
   ```
4. Run the dev server:
   ```
   npm install @vitejs/plugin-react
   ```
   ```
   npm install lucide-react
   ```
   ```
   npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/google-calendar @fullcalendar/interaction
   ```
   ```
   npm run dev
   ```

5. Open the local address shown by Vite (usually http://localhost:5173)

## Notes
- Google Maps API key is embedded in `src/components/MapView.jsx`.
- Google Calender API is embedded in `src/components/Calender.jsx`

