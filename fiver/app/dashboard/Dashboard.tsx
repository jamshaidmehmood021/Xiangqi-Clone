'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

import { Box, Typography, Paper, Grid, CircularProgress, Button} from '@mui/material';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { fetchAllGigs } from '@/app/redux/slice/gigSlice';
import { fetchAllOrders } from '@/app/redux/slice/orderSlice';

import Chart from '@/app/components/Chart';
import DataTable from '@/app/components/Table';

import withAuth from '@/app/components/ProtectedRoute';
import useAuth from '@/app/hook/useAuth';



interface User {
    id: string;
    name: string;
    role: string;
    blocked: boolean;
};

const StyledBox = styled(Box)`
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Dashboard = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { apiCall, loading, error } = useAuth();

    const gigs = useAppSelector((state) => state.gigs.gigs);
    const [userData, setUserData] = useState({ sellers: 0, buyers: 0 });
    const [weeklyRegistrations, setWeeklyRegistrations] = useState(Array(7).fill(0));
    const [weeklyGigsCreated, setWeeklyGigsCreated] = useState(Array(7).fill(0));
    const [labels, setLabels] = useState<string[]>([]);
    const [isGraphMode, setIsGraphMode] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [userRevenue, setUserRevenue] = useState<number>(0);
    const [companyRevenue, setCompanyRevenue] = useState<number>(0);


    const orders = useAppSelector((state) => state.orders.orders);
    const [orderStats, setOrderStats] = useState({ completed: 0, inProgress: 0, declined: 0 });

    useEffect(() => {
        const totalUserRevenue = orders.reduce((total, order) => {
            return total + Number(order.amount);
        }, 0);
        setUserRevenue(totalUserRevenue);

        const totalCompanyRevenue = totalUserRevenue * 0.20;
        setCompanyRevenue(totalCompanyRevenue);
    }, [orders]);

    useEffect(() => {
        const fetchOrders = async () => {
            await dispatch(fetchAllOrders());
        };

        fetchOrders();
    }, [dispatch]);

    useEffect(() => {
        const completedCount = orders.filter(order => order.orderStatus === 'Completed').length;
        const inProgressCount = orders.filter(order => order.orderStatus === 'In Progress').length;
        const declinedCount = orders.filter(order => order.orderStatus === 'Declined').length;

        setOrderStats({ completed: completedCount, inProgress: inProgressCount, declined: declinedCount });
    }, [orders]);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await apiCall(`${process.env.NEXT_PUBLIC_BACKEND}/getAllUsers`, {}, 'GET');
                if (response && response.data) {
                    const sellersCount = response.data.filter((user: { role: string; }) => user.role === 'Seller').length;
                    const buyersCount = response.data.filter((user: { role: string; }) => user.role === 'Buyer').length;

                    setUserData({ sellers: sellersCount, buyers: buyersCount });
                    setUsers(response.data);

                    const registrationsCount = Array(7).fill(0);
                    const today = new Date();

                    const dayLabels = Array.from({ length: 7 }, (_, i) => {
                        const date = new Date(today);
                        date.setDate(today.getDate() - i);
                        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                    }).reverse();

                    setLabels(dayLabels);

                    response.data.forEach((user: { createdAt: string | number | Date; }) => {
                        const createdAt = new Date(user.createdAt);
                        const createdDayIndex = today.getDate() - createdAt.getDate();

                        if (createdDayIndex >= 0 && createdDayIndex < 7) {
                            registrationsCount[createdDayIndex]++;
                        }
                    });

                    setWeeklyRegistrations(registrationsCount.reverse());
                }
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };

        fetchUsers();
    }, [apiCall]);

    useEffect(() => {
        const fetchGigs = async () => {
            await dispatch(fetchAllGigs());
        };

        fetchGigs();
    }, [dispatch]);

    useEffect(() => {
        const today = new Date();
        const weeklyGigsCount = Array(7).fill(0);

        gigs.forEach((gig: { createdAt: string | number | Date; }) => {
            const createdAt = new Date(gig.createdAt);
            const createdDayIndex = today.getDate() - createdAt.getDate();

            if (createdDayIndex >= 0 && createdDayIndex < 7) {
                weeklyGigsCount[createdDayIndex]++;
            }
        });

        setWeeklyGigsCreated(weeklyGigsCount.reverse());
    }, [gigs]);

    const chartData = useMemo(() => ({
        labels: ['Sellers', 'Buyers'],
        datasets: [
            {
                label: 'User Count',
                data: [userData.sellers, userData.buyers],
                backgroundColor: ['#4caf50', '#2196f3'],
            },
        ],
    }), [userData]);

    const lineChartData = useMemo(() => ({
        labels: labels,
        datasets: [
            {
                label: 'User Registrations ',
                data: weeklyRegistrations,
                fill: true,
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: '#2196f3',
                tension: 0.1,
            },
        ],
    }), [labels, weeklyRegistrations]);

    const gigsCountData = useMemo(() => {
        const categories = gigs.reduce((acc:any , gig:any) => {
            acc[gig.category] = (acc[gig.category] || 0) + 1;
            return acc;
        }, {});

        const colors = [
            '#ff9800',
            '#f44336',
            '#4caf50',
            '#2196f3',
            '#9c27b0',
            '#ffeb3b',
            '#ff5722',
            '#00bcd4',
            '#8bc34a',
            '#e91e63',
        ];

        const backgroundColors = Object.keys(categories).map((_, index) => {
            return colors[index % colors.length];
        });

        return {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Gigs Count by Category',
                data: Object.values(categories),
                backgroundColor: backgroundColors,
            }],
        };
    }, [gigs]);

    const weeklyGigsChartData = useMemo(() => ({
        labels: labels,
        datasets: [
            {
                label: 'Gigs Created',
                data: weeklyGigsCreated,
                fill: true,
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                borderColor: '#ff9800',
                tension: 0.1,
            },
        ],
    }), [labels, weeklyGigsCreated]);

    const orderChartData = useMemo(() => ({
        labels: ['Completed', 'In Progress', 'Declined'],
        datasets: [
            {
                label: 'Order Status Count',
                data: [orderStats.completed, orderStats.inProgress, orderStats.declined],
                backgroundColor: ['#4caf50', '#2196f3', '#f44336'],
            },
        ],
    }), [orderStats]);


    const toggleMode = () => {
        setIsGraphMode((prev) => !prev);
    };

    const blockUser = useCallback(async (userId: string) => {
        const endpoint = `${process.env.NEXT_PUBLIC_BACKEND}/blockuser/${userId}`;
        const response:any = await apiCall(endpoint, {}, 'POST');
    
        if (response && response.error) {
            toast.error('Error blocking user:', response.error);
        } else {
            toast.success('User blocked successfully');
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
        }
    }, [setUsers,apiCall]);
    
    const handleInviteClick = () => {
        router.push('/invite');  
    };

    return (
        <StyledBox>
            <Typography variant="h4" gutterBottom sx={{color: 'white'}}>
                Dashboard
            </Typography>
            {loading && <CircularProgress />}
            {error && <Typography variant="body1" color="error" sx={{color: 'white'}}>{error}</Typography>}
            <ButtonContainer>
            <Button variant="contained" color="primary" onClick={toggleMode}>
                Switch to {isGraphMode ? 'Table' : 'Graph'} View
            </Button>
            <Button variant="contained" color="secondary" onClick={handleInviteClick}>
                Invite User
            </Button>
            </ButtonContainer>

            <Typography variant="h6" style={{ marginTop: '20px', color: 'white' }}>
                User Revenue: ${userRevenue.toFixed(2)}
            </Typography>
            <Typography variant="h6" sx={{color: 'white'}}>
                Company Revenue: ${typeof companyRevenue === 'number' ? companyRevenue.toFixed(2) : '0.00'}
            </Typography>

            <Grid container spacing={3} style={{ marginTop: '20px' }}>
                {isGraphMode ? (
                    <>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Chart title="User Count" type="bar" data={chartData} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Chart title="User Registrations (Last 7 Days)" type="line" data={lineChartData} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Chart title='Gigs Count by Category' type='pie' data={gigsCountData} options={{ responsive: true, maintainAspectRatio: false }} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Chart title="Gigs Created (Last 7 Days)" type="line" data={weeklyGigsChartData} />
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={3} style={{ padding: '20px' }}>
                                <Chart title="Orders by Status" type="bar" data={orderChartData} />
                            </Paper>
                        </Grid>
                    </>
                ) : (
                    <>
                    <Grid item xs={12}>
                            <DataTable
                                title="User List"
                                headers={['User ID', 'Name', 'Role', 'Actions']}
                                rows={users.filter(user => user.role !== 'Admin' && user.blocked === false).map(user => ({
                                    'User ID': user.id,
                                    Name: user.name,
                                    Role: user.role,
                                    Actions: (
                                        <Button variant="outlined" 
                                                color="secondary"
                                                onClick={() => blockUser(user.id)}>
                                            Block User
                                        </Button>
                                    ),
                                }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DataTable
                                title="User Count"
                                headers={['Role', 'Count']}
                                rows={[
                                    { Role: 'Sellers', Count: userData.sellers },
                                    { Role: 'Buyers', Count: userData.buyers },
                                ]}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DataTable
                                title="Gigs Count by Category"
                                headers={['Category', 'Count']}
                                rows={gigsCountData.labels.map((category, index) => ({
                                    Category: category,
                                    Count: gigsCountData.datasets[0].data[index] as number,
                                }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DataTable
                                title="User Registrations (Last 7 Days)"
                                headers={['Date', 'Registrations']}
                                rows={labels.map((label, index) => ({
                                    Date: label,
                                    Registrations: weeklyRegistrations[index],
                                }))}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DataTable
                                title="Gigs Created (Last 7 Days)"
                                headers={['Date', 'Gigs Created']}
                                rows={labels.map((label, index) => ({
                                    Date: label,
                                    'Gigs Created': weeklyGigsCreated[index],
                                }))}
                            />
                        </Grid>
                    </>
                )}
            </Grid>
        </StyledBox>
    );
};

export default withAuth(Dashboard);
