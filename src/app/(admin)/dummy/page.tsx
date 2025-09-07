"use client"
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isWithinInterval, parseISO } from "date-fns";

export default function HotelBookingCalendar() {
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [unavailableRanges, setUnavailableRanges] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Static unavailable data by hotel
  const hotelUnavailableData = [
    { hotelId: 1, from: "2025-08-15", to: "2025-08-19" },
    { hotelId: 1, from: "2025-09-05", to: "2025-09-08" },
    { hotelId: 2, from: "2025-08-20", to: "2025-08-22" },
    { hotelId: 2, from: "2025-09-10", to: "2025-09-15" },
    { hotelId: 3, from: "2025-08-25", to: "2025-08-28" }
  ];

  // Update unavailable ranges when hotel changes
  useEffect(() => {
    if (selectedHotelId) {
      setUnavailableRanges(
        hotelUnavailableData.filter(item => item.hotelId === selectedHotelId)
      );
    } else {
      setUnavailableRanges([]);
    }
  }, [selectedHotelId]);

  // Disable unavailable dates
  const isDateDisabled = (date) => {
    return unavailableRanges.some(range =>
      isWithinInterval(date, {
        start: parseISO(range.from),
        end: parseISO(range.to)
      })
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Hotel Booking</h3>

      {/* Hotel Selector */}
      <select
        value={selectedHotelId || ""}
        onChange={(e) => {
          setSelectedHotelId(Number(e.target.value));
          setStartDate(null);
          setEndDate(null);
        }}
      >
        <option value="">Select a hotel</option>
        <option value={1}>Hotel 1</option>
        <option value={2}>Hotel 2</option>
        <option value={3}>Hotel 3</option>
      </select>

      {/* Show calendar only when hotel selected */}
      {selectedHotelId && (
        <DatePicker
          selected={startDate}
          onChange={(dates) => {
            const [start, end] = dates;
            setStartDate(start);
            setEndDate(end);
          }}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          inline
          filterDate={(date) => !isDateDisabled(date)}
        />
      )}
    </div>
  );
}
