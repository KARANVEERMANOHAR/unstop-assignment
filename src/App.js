import "./App.css";
import React, { useState } from "react";
const ROWS = 10; // total number of rows in the coach
const ROW_CAPACITY = [7, 7, 7, 7, 7, 7, 3]; // capacity of each row
const SEAT_STATUS = {
  AVAILABLE: "available",
  BOOKED: "booked",
  SELECTED: "selected"
}; // possible seat statuses

function App() {
  const [seats, setSeats] = useState(
    Array(ROWS)
      .fill(null)
      .map(() => Array(7).fill(SEAT_STATUS.AVAILABLE))
  );
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState("");

  const handleSeatClick = (rowIndex, seatIndex) => {
    const seatStatus = seats[rowIndex][seatIndex];
    if (seatStatus === SEAT_STATUS.AVAILABLE) {
      // select the seat
      const newSelectedSeats = [
        ...selectedSeats,
        { row: rowIndex, seat: seatIndex }
      ];
      setSelectedSeats(newSelectedSeats);
      // update the seat status
      const newSeats = [...seats];
      newSeats[rowIndex][seatIndex] = SEAT_STATUS.SELECTED;
      setSeats(newSeats);
    } else if (seatStatus === SEAT_STATUS.SELECTED) {
      // unselect the seat
      const newSelectedSeats = selectedSeats.filter(
        (s) => s.row !== rowIndex || s.seat !== seatIndex
      );
      setSelectedSeats(newSelectedSeats);
      // update the seat status
      const newSeats = [...seats];
      newSeats[rowIndex][seatIndex] = SEAT_STATUS.AVAILABLE;
      setSeats(newSeats);
    }
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      setError("Please select at least one seat");
      return;
    }
    const sortedSelectedSeats = selectedSeats.sort(
      (a, b) => a.row - b.row || a.seat - b.seat
    );
    const startRow = sortedSelectedSeats[0].row;
    const endRow = sortedSelectedSeats[sortedSelectedSeats.length - 1].row;
    const startSeat = sortedSelectedSeats[0].seat;
    const endSeat = sortedSelectedSeats[sortedSelectedSeats.length - 1].seat;
    const rowCapacities = ROW_CAPACITY.slice(
      startRow === ROWS - 1 ? ROWS - 2 : startRow,
      endRow + 1
    );
    const totalCapacity = rowCapacities.reduce((acc, val) => acc + val, 0);
    if (selectedSeats.length > totalCapacity) {
      setError(
        "Cannot book more than " + totalCapacity + " seats in this range"
      );
      return;
    }
    // update the seat status
    const newSeats = [...seats];
    for (let i = startRow; i <= endRow; i++) {
      for (
        let j = 0;
        j < 7 &&
        (i !== startRow || j >= startSeat) &&
        (i !== endRow || j <= endSeat);
        j++
      ) {
        newSeats[i][j] = SEAT_STATUS.BOOKED;
      }
    }
    setSeats(newSeats);
    setSelectedSeats([]);
    setError("");
    alert(
      "Successfully booked seats: " +
        selectedSeats.map((s) => `${s.row + 1}${s.seat + 1}`).join(", ")
    );
  };

  return (
    <div className="train Booking">
      <h1>Train Booking</h1>
      {error && <div className="error">{error}</div>}
      <div className="coach">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((seatStatus, seatIndex) => (
              <div
                key={seatIndex}
                className={`seat ${seatStatus}`}
                onClick={() => handleSeatClick(rowIndex, seatIndex)}
              >
                {seatStatus === SEAT_STATUS.AVAILABLE &&
                  `${rowIndex + 1}${seatIndex + 1}`}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={handleBooking}>Book Selected Seats</button>
        <button onClick={() => setSelectedSeats([])}>Clear Selection</button>
      </div>
    </div>
  );
}

export default App;
