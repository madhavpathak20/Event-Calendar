import React, { createContext, useReducer, useContext, useEffect } from 'react';

const EventContext = createContext();

const initialState = {
  events: [],
};

function eventReducer(state, action) {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(ev => ev.id === action.payload.id ? action.payload : ev),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(ev => ev.id !== action.payload),
      };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    default:
      return state;
  }
}

export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('events');
    if (stored) {
      dispatch({ type: 'SET_EVENTS', payload: JSON.parse(stored) });
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(state.events));
  }, [state.events]);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEventContext() {
  return useContext(EventContext);
} 