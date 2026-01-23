import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BookingContextType {
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
  setCheckIn: (date: Date | undefined) => void;
  setCheckOut: (date: Date | undefined) => void;
  setGuests: (count: number) => void;
  setDateRange: (from: Date | undefined, to: Date | undefined) => void;
  clearDates: () => void;
  clearAll: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

interface BookingProviderProps {
  children: ReactNode;
}

export function BookingProvider({ children }: BookingProviderProps) {
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(2);

  const setDateRange = useCallback((from: Date | undefined, to: Date | undefined) => {
    setCheckIn(from);
    setCheckOut(to);
  }, []);

  const clearDates = useCallback(() => {
    setCheckIn(undefined);
    setCheckOut(undefined);
  }, []);

  const clearAll = useCallback(() => {
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests(2);
  }, []);

  return (
    <BookingContext.Provider
      value={{
        checkIn,
        checkOut,
        guests,
        setCheckIn,
        setCheckOut,
        setGuests,
        setDateRange,
        clearDates,
        clearAll,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
