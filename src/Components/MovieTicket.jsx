import React, { useState, useEffect } from 'react';

function MovieTicket() {

      const [rowCount, setRowCount] = useState(3);
      const [seats, setSeats] = useState([]);
      const [selectedSeats, setSelectedSeats] = useState([]);
    
      useEffect(() => {
        fetchSeats(rowCount);
      }, [rowCount]);
    
      const fetchSeats = async (count) => {
        const response = await fetch(`https://codebuddy.review/seats?count=${count}`);
        const data = await response.json();
        setSeats(data);
      };
    
      const handleRowCountChange = (e) => {
        setRowCount(e.target.value);
      };
    
      const handleSeatClick = (seat) => {
        if (seat.isReserved || selectedSeats.length >= 5) return;
        if (selectedSeats.includes(seat)) {
          setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
          setSelectedSeats([...selectedSeats, seat]);
        }
      };
    
      const handleSubmit = async () => {
        if (selectedSeats.length < 1 || selectedSeats.length > 5) return;
        await fetch('https://codebuddy.review/submit', {
          method: 'POST',
          body: JSON.stringify(selectedSeats.map(seat => seat.id)),
        });
        alert('Seats submitted successfully');
      };
    
      const calculateTotalCost = () => {
        const ticketCost = 20;
        const seatCost = selectedSeats.reduce((acc, seat) => acc + seat.row * 10, 0);
        return ticketCost + seatCost;
      };
    
      return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Movie Theater Seat Booking</h1>
          <div className="mb-4">
            <label className="mr-2">Number of Rows:</label>
            <input
              type="number"
              min="3"
              max="10"
              value={rowCount}
              onChange={handleRowCountChange}
              className="border p-1"
            />
            <button onClick={() => fetchSeats(rowCount)} className="ml-2 bg-blue-500 text-white p-1">
              Fetch Seats
            </button>
          </div>
          <div>
            {Array.from({ length: rowCount }, (_, rowIndex) => {
              const rowNumber = rowIndex + 1;
              return (
                <div key={rowNumber} className="flex justify-center mb-2">
                  {Array.from({ length: rowNumber }, (_, seatIndex) => {
                    const seatNumber = seatIndex + 1;
                    const isReserved = isPrime(seatNumber);
                    const seat = { id: `${rowNumber}-${seatNumber}`, row: rowNumber, number: seatNumber, isReserved };
                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        className={`border p-2 cursor-pointer ${isReserved ? 'bg-gray-400' : 'bg-green-400'} ${selectedSeats.includes(seat) ? 'bg-yellow-300' : ''}`}
                      >
                        {`Row ${rowNumber}, Seat ${seatNumber}`}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <button onClick={handleSubmit} className="bg-blue-500 text-white p-2">Submit</button>
          </div>
          <div className="mt-2">
            <p>Total Cost: ${calculateTotalCost()}</p>
          </div>
        </div>
      );
    }
    
    const isPrime = (num) => {
      if (num < 2) return false;
      for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    };

export default MovieTicket;