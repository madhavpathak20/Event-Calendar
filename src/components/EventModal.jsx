import React from 'react';
import EventForm from './EventForm';

function EventModal({ isOpen, onClose, event, onSave }) {
  if (!isOpen) return null;
  return (
    <div className="event-modal">
      <div className="event-modal-card">
        <button className="event-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        <EventForm event={event} onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
}

export default EventModal; 