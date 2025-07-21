import { useState } from 'react'
import './App.css'
import Calendar from './components/Calendar'
import EventModal from './components/EventModal'
import { useEventContext } from './context/EventContext'
import { parseISO, format } from 'date-fns'

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { state, dispatch } = useEventContext();

  const handleSaveEvent = (event) => {
    if (event.id) {
      dispatch({ type: 'UPDATE_EVENT', payload: event });
    } else {
      dispatch({ type: 'ADD_EVENT', payload: { ...event, id: Date.now().toString() } });
    }
    setModalOpen(false);
    setSelectedEvent(null);
  };

  // Prevent overlapping events at the same date and time
  const hasConflict = (event, newDate) => {
    return state.events.some(ev =>
      ev.id !== event.id &&
      format(parseISO(ev.date), 'yyyy-MM-dd') === format(newDate, 'yyyy-MM-dd') &&
      ev.time === event.time
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const eventId = result.draggableId;
    const newDate = result.destination.droppableId;
    const event = state.events.find(ev => ev.id === eventId);
    if (!event) return;
    // Check for conflict
    if (hasConflict(event, parseISO(newDate))) {
      alert('Event conflict: another event exists at this time.');
      return;
    }
    dispatch({ type: 'UPDATE_EVENT', payload: { ...event, date: newDate } });
  };

  return (
    <div className="app-container">
      <header>
        <h1>Event Calendar</h1>
      </header>
      <main>
        <Calendar
          events={state.events}
          onEventClick={event => { setSelectedEvent(event); setModalOpen(true); }}
          onDayClick={date => { setSelectedEvent({ date: format(date, 'yyyy-MM-dd') }); setModalOpen(true); }}
          onDragEnd={handleDragEnd}
        />
        <EventModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedEvent(null); }}
          event={selectedEvent}
          onSave={handleSaveEvent}
        />
      </main>
    </div>
  )
}

export default App
