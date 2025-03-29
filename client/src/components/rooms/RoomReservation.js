import React, { useState, useEffect } from "react";
import "./RoomReservation.css"; // Import the CSS file for styling

const RoomReservation = ({ userData, navigateToHome }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    RoomNumber: "",
    RoomName: "",
    Capacity: "",
    Notes: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      if (data.success) {
        setRooms(data.rooms);
      } else {
        alert("Failed to fetch rooms: " + data.error);
      }
    };
    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    try {
      const response = await fetch("/api/addRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      const data = await response.json();
      if (data.success) {
        alert("Room added successfully!");
        setNewRoom({ RoomNumber: "", RoomName: "", Capacity: "", Notes: "" });

        // Refresh the room list
        const updatedRooms = await fetch("/api/rooms").then((res) =>
          res.json()
        );
        setRooms(updatedRooms.rooms);
      } else {
        alert("Failed to add room: " + data.error);
      }
    } catch (error) {
      console.error("Error adding room:", error);
      alert("An error occurred while adding the room.");
    }
  };

  const handleReserveRoom = async (RoomID) => {
    try {
      const duration = userData?.Role === "Faculty" ? 180 : 90; // Faculty: 3 hours, Others: 1.5 hours
      const response = await fetch("/api/reserveRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RoomID,
          UserID: userData.UserID,
          Duration: duration,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Room reserved successfully!");

        // Refresh the room list
        const updatedRooms = await fetch("/api/rooms").then((res) =>
          res.json()
        );
        setRooms(updatedRooms.rooms);
      } else {
        alert("Failed to reserve room: " + data.error);
      }
    } catch (error) {
      console.error("Error reserving room:", error);
      alert("An error occurred while reserving the room.");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="room-reservation-container">
        <h2 className="title">Room Reservations</h2>

        {/* Admin Section to Add Rooms */}
        {userData?.Role === "Admin" && (
          <div className="add-room-container">
            <h3 className="subtitle">Add a New Room</h3>
            <input
              type="text"
              placeholder="Room Number"
              value={newRoom.RoomNumber}
              onChange={(e) =>
                setNewRoom({ ...newRoom, RoomNumber: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Room Name"
              value={newRoom.RoomName}
              onChange={(e) =>
                setNewRoom({ ...newRoom, RoomName: e.target.value })
              }
              className="input-field"
            />
            <input
              type="number"
              placeholder="Capacity"
              value={newRoom.Capacity}
              onChange={(e) =>
                setNewRoom({ ...newRoom, Capacity: e.target.value })
              }
              className="input-field"
            />
            <input
              type="text"
              placeholder="Notes"
              value={newRoom.Notes}
              onChange={(e) =>
                setNewRoom({ ...newRoom, Notes: e.target.value })
              }
              className="input-field"
            />
            <button onClick={handleAddRoom} className="add-room-button">
              Add Room
            </button>
          </div>
        )}

        {/* Room List */}
        <div className="rooms-container">
          <h3 className="subtitle">Available Rooms</h3>
          {rooms.map((room) => (
            <div key={room.RoomID} className="room-card">
              <p className="room-name">
                <strong>{room.RoomName}</strong> (Capacity: {room.Capacity})
              </p>
              <p
                className={`room-status ${
                  room.IsAvailable ? "available" : "reserved"
                }`}
              >
                Status: {room.IsAvailable ? "Available" : "Reserved"}
              </p>
              {room.IsAvailable && (
                <button
                  className="reserve-button"
                  onClick={() => handleReserveRoom(room.RoomID)}
                >
                  Reserve Room
                </button>
              )}
            </div>
          ))}
        </div>

        <button onClick={navigateToHome} className="back-button">
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default RoomReservation;
