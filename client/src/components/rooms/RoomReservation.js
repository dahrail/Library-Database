import React, { useState, useEffect } from "react";

const RoomReservation = ({ userData, navigateToHome }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    RoomNumber: "",
    RoomName: "",
    Capacity: "",
    Notes: "",
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDuration, setBookingDuration] = useState("");

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
    const response = await fetch("/api/addRoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoom),
    });
    const data = await response.json();
    if (data.success) {
      alert("Room added successfully!");
      setNewRoom({ RoomNumber: "", RoomName: "", Capacity: "", Notes: "" });
      const updatedRooms = await fetch("/api/rooms").then((res) => res.json());
      setRooms(updatedRooms.rooms);
    } else {
      alert("Failed to add room: " + data.error);
    }
  };

  const handleBookRoom = async () => {
    const response = await fetch("/api/bookRoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        RoomID: selectedRoom,
        UserID: userData.UserID,
        Duration: bookingDuration,
      }),
    });
    const data = await response.json();
    if (data.success) {
      alert("Room booked successfully!");
      setSelectedRoom(null);
      setBookingDuration("");
    } else {
      alert("Failed to book room: " + data.error);
    }
  };

  return (
    <div className="content-container">
      <h2>Room Reservations</h2>

      {userData?.Role === "Admin" && (
        <div>
          <h3>Add a New Room</h3>
          <input
            type="text"
            placeholder="Room Number"
            value={newRoom.RoomNumber}
            onChange={(e) =>
              setNewRoom({ ...newRoom, RoomNumber: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Room Name"
            value={newRoom.RoomName}
            onChange={(e) =>
              setNewRoom({ ...newRoom, RoomName: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Capacity"
            value={newRoom.Capacity}
            onChange={(e) =>
              setNewRoom({ ...newRoom, Capacity: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Notes"
            value={newRoom.Notes}
            onChange={(e) => setNewRoom({ ...newRoom, Notes: e.target.value })}
          />
          <button onClick={handleAddRoom}>Add Room</button>
        </div>
      )}

      <div>
        <h3>Available Rooms</h3>
        {rooms.map((room) => (
          <div key={room.RoomID}>
            <p>
              {room.RoomName} (Capacity: {room.Capacity})
            </p>
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
                <button onClick={() => setSelectedRoom(room.RoomID)}>
                  Book Room
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={navigateToHome}>Back to Menu</button>
    </div>
  );
};

export default RoomReservation;
