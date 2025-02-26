import React, { useEffect, useState } from 'react';
import { getReservations } from '../services/bookService';
import { Link } from 'react-router-dom';

const ReservationsPage = () => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            const data = await getReservations();
            setReservations(data);
        };

        fetchReservations();
    }, []);

    return (
        <div>
            <h1>Your Reservations</h1>
            {reservations.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <ul>
                    {reservations.map(reservation => (
                        <li key={reservation.id}>
                            <Link to={`/books/${reservation.bookId}`}>
                                {reservation.bookTitle}
                            </Link> - Reserved on: {new Date(reservation.reservedDate).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ReservationsPage;