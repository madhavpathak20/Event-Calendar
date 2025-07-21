import React, { useState } from 'react';
import { format } from 'date-fns';

const recurrenceOptions = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

function EventForm({ event = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(event.title || '');
  const [date, setDate] = useState(event.date ? format(new Date(event.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(event.time || '12:00');
  const [description, setDescription] = useState(event.description || '');
  const [recurrence, setRecurrence] = useState(event.recurrence || 'none');
  const [color, setColor] = useState(event.color || '#1976d2');
  const [category, setCategory] = useState(event.category || '');

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      ...event,
      title,
      date,
      time,
      description,
      recurrence,
      color,
      category,
    });
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <label>Title<input value={title} onChange={e => setTitle(e.target.value)} required /></label>
      <label>Date<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>
      <label>Time<input type="time" value={time} onChange={e => setTime(e.target.value)} required /></label>
      <label>Description<textarea value={description} onChange={e => setDescription(e.target.value)} /></label>
      <label>Recurrence<select value={recurrence} onChange={e => setRecurrence(e.target.value)}>{recurrenceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></label>
      <label>Color<input type="color" value={color} onChange={e => setColor(e.target.value)} /></label>
      <label>Category<input value={category} onChange={e => setCategory(e.target.value)} /></label>
      <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}

export default EventForm; 