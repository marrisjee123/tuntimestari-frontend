import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import fiLocale from '@fullcalendar/core/locales/fi';
import { Container } from '@mui/material';

function CalendarHomePage() {
  const calendarRef = useRef(null);

  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGrid"
        views={{
          dayGrid: {
            type: 'dayGrid',
            duration: { weeks: 3 },
            buttonText: '3 weeks'
          }
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGrid'
        }}
        events={[
          { title: 'Event 1', start: '2024-08-01' },
          { title: 'Event 2', start: '2024-08-02' }
        ]}
        locale={fiLocale}
        height="auto"
        style={{ width: '100%', maxWidth: '900px' }}
      />
    </Container>
  );
}

export default CalendarHomePage;

