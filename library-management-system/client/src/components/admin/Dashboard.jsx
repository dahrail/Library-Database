import React from 'react';
import { useEffect, useState } from 'react';
import { getUserStats, getLoanStats, getFineStats } from '../../services/adminService';

const Dashboard = () => {
    const [userStats, setUserStats] = useState({});
    const [loanStats, setLoanStats] = useState({});
    const [fineStats, setFineStats] = useState({});

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const users = await getUserStats();
                const loans = await getLoanStats();
                const fines = await getFineStats();

                setUserStats(users);
                setLoanStats(loans);
                setFineStats(fines);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <div className="stats">
                <div className="stat-item">
                    <h2>Total Users</h2>
                    <p>{userStats.totalUsers}</p>
                </div>
                <div className="stat-item">
                    <h2>Total Loans</h2>
                    <p>{loanStats.totalLoans}</p>
                </div>
                <div className="stat-item">
                    <h2>Total Fines</h2>
                    <p>{fineStats.totalFines}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;