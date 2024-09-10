import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Container, Avatar, Button, Tabs, Tab, Paper, Divider } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';
import { Flag, Edit } from '@mui/icons-material';
import { Image } from 'antd';

import { fetchPostsByUser, STATUS } from 'slice/PostSlice';

const useStyles = makeStyles((theme) => ({
    profileContainer: {
        padding: theme.spacing(4),
        marginTop: theme.spacing(4),
    },
    profileHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3),
        backgroundColor: '#f9f9f9',
        borderRadius: theme.shape.borderRadius,
        marginBottom: theme.spacing(4),
    },
    avatar: {
        marginRight: theme.spacing(3),
    },
    profileInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    tabsContainer: {
        marginTop: theme.spacing(4),
    },
    postGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: theme.spacing(2),
        marginTop: theme.spacing(6),
        justifyContent: 'center',
    },
    postCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
    },
}));

const Profile = () => {
    const classes = useStyles();
    const { email } = useParams(); 
    const dispatch = useDispatch();
    const { posts, status, error } = useSelector((state) => state.post);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (email) {
            dispatch(fetchPostsByUser(email)); 
        }
    }, [dispatch, email]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container className={classes.profileContainer} maxWidth="md">
            <Paper className={classes.profileHeader} elevation={3}>
                <Avatar
                    className={classes.avatar}
                    style={{ width: 150, height: 150, fontSize: '4rem', backgroundColor: '#ff5722', color: '#ffffff', }}
                >
                    {email.charAt(0).toUpperCase()}
                </Avatar>

                <div className={classes.profileInfo}>
                    <Typography variant="h4">{email} <Flag style={{ marginLeft: 8 }} /> </Typography>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Edit />}
                        style={{ marginTop: 8 }}
                    >
                        Edit Profile
                    </Button>
                </div>
            </Paper>
            <Divider />
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                className={classes.tabsContainer}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Posts" />
            </Tabs>

            {activeTab === 0 && (
                <div>
                    {status === STATUS.LOADING && (
                        <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', marginTop: 16 }}>
                            Loading posts...
                        </Typography>
                    )}
                    {status === STATUS.ERROR && (
                        <Typography variant="body1" color="error" style={{ textAlign: 'center', marginTop: 16 }}>
                            {error}
                        </Typography>
                    )}
                    {status === STATUS.SUCCESS && (
                        <div className={classes.postGrid}>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <Image
                                        width="100%"
                                        src={post.image}
                                        alt={post.caption}
                                        key={post.id}
                                        className={classes.postCard}
                                    />
                                ))
                            ) : (
                                <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center' }}>
                                    No posts available.
                                </Typography>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Container>
    );
};

export default Profile;
