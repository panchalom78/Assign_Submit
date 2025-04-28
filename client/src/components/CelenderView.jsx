import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const CalendarView = ({ assignments }) => {
  // Map assignments to events for FullCalendar
  const events = assignments.map((assignment) => ({
    title: assignment.title,
    start: assignment.deadline,
    end: assignment.deadline,
    color: assignment.status === 'Pending' ? '#ED739F' : '#A560CF', // Color based on status
    textColor: '#FFFFFF', // White text for better contrast
  }));

  return (
    <div className="bg-[#1F1F1F] text-white rounded-2xl shadow-2xl p-4 md:p-6 border border-gray-700">
      <h2 className="text-xl md:text-2xl font-bold text-[#FB773C] mb-4 md:mb-6 text-center">
        Assignment Calendar
      </h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        eventContent={(eventInfo) => (
          <div className="flex flex-col items-center justify-center p-1">
            <div className="font-semibold text-xs md:text-sm">{eventInfo.event.title}</div>
            <div className="text-2xs md:text-xs">{eventInfo.timeText}</div>
          </div>
        )}
        dayHeaderClassNames="text-purple-600 font-bold text-sm md:text-base"
        dayCellClassNames="hover:bg-purple-50 transition-colors duration-200"
        height="auto"
        contentHeight="auto"
        aspectRatio={1.5} // Adjust aspect ratio for better responsiveness
      />
    </div>
  );
};

export default CalendarView;