'use client';
import React, {  useState, useContext } from 'react';
import { Typography, Container, Button, Tabs, Tab, Paper, Divider } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { Flag, Edit } from '@mui/icons-material';
import { Image } from 'antd';

import { AuthContext } from '@/app/context/authContext';

const useStyles = makeStyles((theme: { spacing: (arg0: number) => any; shape: { borderRadius: any; }; }) => ({
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
    
    const posts = [
        {
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            caption: 'Image 1',
            id: 1,
        },
        {
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            caption: 'Image 2',
            id: 2,
        },
        {
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            caption: 'Image 3',
            id: 3,
        },
        {
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            caption: 'Image 4',
            id: 4,
        },
    ];
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is not available");
    }

    const { name, profilePicture} = authContext;
    
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
        setActiveTab(newValue);
    };

    return (
        <Container className={classes.profileContainer} maxWidth="md">
            <Paper className={classes.profileHeader} elevation={3}>
                <Image
                    className={classes.avatar}
                    style={{ width: 150, height: 150, fontSize: '4rem', backgroundColor: '#ff5722', color: '#ffffff',borderRadius: '50%' }}
                    alt='Profile Avatar'
                    src={profilePicture as string}
                />
                <div className={classes.profileInfo}>
                    <Typography variant="h4">{name}<Flag style={{ marginLeft: 8 }} /> </Typography>
                    
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
                        <div className={classes.postGrid}>
                            {posts.length > 0 ? (
                                posts.map((post: { image: string | undefined; caption: string | undefined; id: React.Key | null | undefined; }) => (
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
                </div>
            )}
        </Container>
    );
};

export default Profile;