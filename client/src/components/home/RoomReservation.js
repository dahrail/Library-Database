import React, { useState, useEffect } from "react";
import "../../styles/rooms/Rooms.css";
import "./Room.css";

const RoomReservation = ({
  userData,
  handleAddRoom,
  handleBookRoom,
  fetchRooms,
  navigateToHome,
}) => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDuration, setBookingDuration] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      const data = await fetchRooms();
      setRooms(data);
    };
    loadRooms();
  }, [fetchRooms]);

  const handleAddRoomSubmit = () => {
    handleAddRoom(newRoom);
    setNewRoom("");
  };

  const handleBookRoomSubmit = () => {
    handleBookRoom(selectedRoom, bookingDuration);
    setSelectedRoom(null);
    setBookingDuration("");
  };

  return (
    <div className="content-container">
      <h2>Room Reservations</h2>

      {userData?.Role === "Admin" && (
        <div className="add-room-section">
          <h3>Add a New Room</h3>
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Enter room name"
          />
          <button onClick={handleAddRoomSubmit}>Add Room</button>
        </div>
      )}

      <div className="room-list">
        <h3>Available Rooms</h3>
        {rooms.map((room) => (
          <div key={room.id} className="room-item">
            <p>{room.name}</p>
            <p>Status: {room.isAvailable ? "Available" : "Not Available"}</p>
            {room.isAvailable && userData?.Role !== "Admin" && (
              <div>
                <select
                  value={bookingDuration}
                  onChange={(e) => setBookingDuration(e.target.value)}
                >
                  <option value="">Select Duration</option>
                  <option value="1">1 Hour</option>
                  {userData?.Role === "Faculty" && (
                    <option value="3">3 Hours</option>
                  )}
                </select>
                <button
                  onClick={() => setSelectedRoom(room.id)}
                  disabled={!bookingDuration}
                >
                  Book Room
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={navigateToHome} className="btn-back">
        Back to Menu
      </button>
    </div>
  );
};

export default RoomReservation;
