const Room = require('../models/Room');
const RoomReservation = require('../models/RoomReservation');

// Get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.findAll();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving rooms', error });
    }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findByPk(id);
        if (room) {
            res.status(200).json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving room', error });
    }
};

// Create a new room
exports.createRoom = async (req, res) => {
    const { roomNumber, capacity, roomName, notes } = req.body;
    try {
        const newRoom = await Room.create({ roomNumber, capacity, roomName, notes });
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error });
    }
};

// Update room details
exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const { roomNumber, capacity, roomName, notes } = req.body;
    try {
        const room = await Room.findByPk(id);
        if (room) {
            await room.update({ roomNumber, capacity, roomName, notes });
            res.status(200).json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating room', error });
    }
};

// Delete a room
exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findByPk(id);
        if (room) {
            await room.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error });
    }
};

// Reserve a room
exports.reserveRoom = async (req, res) => {
    const { userId, roomId, startTime, endTime, purpose } = req.body;
    try {
        const reservation = await RoomReservation.create({ userId, roomId, startTime, endTime, purpose });
        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error reserving room', error });
    }
};