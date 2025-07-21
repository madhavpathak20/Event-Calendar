import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO, getYear, getMonth } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const YEARS = Array.from({ length: 21 }, (_, i) => 2015 + i);

function getEventsForDay(events, day) {
  return events.filter(ev => {
    if (!ev.recurrence || ev.recurrence === 'none') {
      return format(parseISO(ev.date || ev.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }
    const eventDate = parseISO(ev.date || ev.date);
    if (ev.recurrence === 'daily') {
      return eventDate <= day;
    }
    if (ev.recurrence === 'weekly') {
      return eventDate <= day && eventDate.getDay() === day.getDay();
    }
    if (ev.recurrence === 'monthly') {
      return eventDate <= day && eventDate.getDate() === day.getDate();
    }
    return false;
  });
}

function Calendar({ onEventClick, onDayClick, events = [], onDragEnd }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const handleMonthChange = (e) => {
    setCurrentMonth(new Date(getYear(currentMonth), Number(e.target.value), 1));
  };
  const handleYearChange = (e) => {
    setCurrentMonth(new Date(Number(e.target.value), getMonth(currentMonth), 1));
  };

  const renderHeader = () => (
    <div className="calendar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, gap: 8 }}>
      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>{'<'}</button>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select value={getMonth(currentMonth)} onChange={handleMonthChange} style={{ fontSize: '1em', borderRadius: 4, padding: '0.2em 0.5em' }}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <select value={getYear(currentMonth)} onChange={handleYearChange} style={{ fontSize: '1em', borderRadius: 4, padding: '0.2em 0.5em' }}>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>{'>'}</button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = startOfWeek(currentMonth, { weekStartsOn: 0 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="calendar-day-name" style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {format(addDays(date, i), 'EEE')}
        </div>
      );
    }
    return <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const rows = [];
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const weeks = Math.ceil(totalDays / 7);
    for (let week = 0; week < weeks; week++) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const cellDate = addDays(startDate, week * 7 + i);
        const isCurrentMonth = isSameMonth(cellDate, monthStart);
        const isToday = isSameDay(cellDate, today);
        const dayEvents = getEventsForDay(events, cellDate);
        const droppableId = format(cellDate, 'yyyy-MM-dd');
        days.push(
          <Droppable droppableId={droppableId} key={droppableId}>
            {(provided) => (
              <div
                className={`calendar-day${isToday ? ' today' : ''}${!isCurrentMonth ? ' not-current-month' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
                onClick={e => { if (e.target === e.currentTarget) onDayClick(cellDate); }}
                style={{
                  opacity: isCurrentMonth ? 1 : 0.4,
                  background: isToday ? '#e0e7ff' : undefined,
                  minWidth: 110,
                  minHeight: 80,
                  maxWidth: 140,
                  margin: '0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '1.1em', marginBottom: 2 }}>{format(cellDate, 'd')}</div>
                <div className="calendar-events">
                  {dayEvents.map((ev, idx) => (
                    <Draggable draggableId={ev.id} index={idx} key={ev.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="calendar-event"
                          style={{ background: ev.color || '#1976d2', color: '#fff', borderRadius: 4, padding: '2px 4px', margin: '2px 0', cursor: 'pointer', fontSize: 12, ...provided.draggableProps.style }}
                          onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        );
      }
      rows.push(
        <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }} key={week}>
          {days}
        </div>
      );
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="calendar-component">
      {renderHeader()}
      {renderDays()}
      <DragDropContext onDragEnd={onDragEnd}>
        {renderCells()}
      </DragDropContext>
    </div>
  );
}

export default Calendar; 