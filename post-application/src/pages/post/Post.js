import React, { useState, useContext, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardHeader, CardContent, IconButton, Typography, Menu, MenuItem, TextField, Button, Modal } from '@mui/material';
import { FavoriteBorder, Favorite, ChatBubbleOutline, MoreVert, Delete } from '@mui/icons-material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Image } from 'antd';

import { deletePost, fetchComments, addComment, deleteComment, likePost, unlikePost, getLikesInfo } from 'slice/PostSlice';
import { AuthContext } from 'context/authContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Post = memo((props) => {
  const { post } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userID } = useContext(AuthContext);

  const [liked, setLiked] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentOpen, setCommentOpen] = useState(false);
  const [visibleComments, setVisibleComments] = useState(2);
  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  const [likesInfo, setLikesInfo] = useState({ likedByMe: false, likes: [], count: 0 });

  const comments = useSelector(state => state.post.comments[post.id]);
  const likedPosts = useSelector(state => state.post.likedPosts);

  const open = Boolean(anchorEl);

  useEffect(() => {
    setLiked(likedPosts.includes(post.id));

    dispatch(getLikesInfo({ postId: post.id }))
      .then(({ payload }) => {
        const likesData = payload?.likedBy || [];
        const likedByMe = likesData.some(like => like.email === user);
        setLikesInfo({
          likedByMe,
          likes: likesData,
          count: likesData.length
        });
      });
  }, [dispatch, post.id, likedPosts, user]);

  const handleLikeClick = useCallback(() => {
    if (liked || likesInfo.likedByMe) {
      dispatch(unlikePost({ postId: post.id, userId: userID }));
    } else {
      dispatch(likePost({ postId: post.id, userId: userID }));
    }
    setLiked(prev => !prev);
  }, [dispatch, post.id, liked, likesInfo.likedByMe, userID]);

  const handleMenuClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleDelete = useCallback(() => {
    dispatch(deletePost(post.id));
    handleMenuClose();
  }, [dispatch, post.id, handleMenuClose]);

  const handleCommentChange = useCallback((event) => {
    setNewComment(event.target.value);
  }, []);

  const handleCommentSubmit = useCallback(() => {
    if (newComment.trim()) {
      dispatch(addComment({ postId: post.id, text: newComment, userId: userID }));
      setNewComment('');
    }
  }, [dispatch, post.id, newComment, userID]);

  const handleToggleComments = useCallback(() => {
    if (!commentsLoaded) {
      dispatch(fetchComments(post.id));
      setCommentsLoaded(true);
    }
    setCommentOpen(prev => !prev);
  }, [dispatch, post.id, commentsLoaded]);

  const handleDeleteComment = useCallback((commentId) => {
    dispatch(deleteComment({ postId: post.id, commentId }));
  }, [dispatch, post.id]);

  const handleShowMoreComments = useCallback(() => {
    setVisibleComments(comments.length);
  }, [comments]);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card
      sx={{
        marginBottom: 4,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        overflow: 'hidden',
        width: { xs: '100%', sm: 'auto' },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            onClick={() => navigate(`/profile/${post.user.email}`)}
            sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
          >
            {post.user.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <div>
            <IconButton
              aria-controls={open ? 'post-menu' : undefined}
              aria-haspopup="true"
              onClick={handleMenuClick}
            >
              <MoreVert />
            </IconButton>
            {post.user.email === user && (
              <Menu
                id="post-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    width: '200px',
                  },
                }}
              >
                <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
              </Menu>
            )}
          </div>
        }
        title={
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {post.user.name}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        }
        sx={{ paddingBottom: 2 }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          marginLeft: 4,
          marginBottom: 2,
        }}
      >
        {post.caption}
      </Typography>
      <Image
        width="100%"
        src={post.image}
        alt={post.caption}
        style={{
          objectFit: 'contain',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          height: 'auto',
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          marginLeft: 4,
          marginTop: 3,
        }}
      >
        {post.description}
      </Typography>
      <CardContent sx={{ paddingX: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              onClick={handleLikeClick}
              sx={{ color: likesInfo.likedByMe || liked ? '#ff1744' : 'inherit' }}
            >
              {likesInfo.likedByMe || liked ? (
                <Favorite sx={{ fontSize: 28 }} />
              ) : (
                <FavoriteBorder sx={{ fontSize: 28 }} />
              )}
              <Typography variant="body2" sx={{ marginRight: 1, color: 'black' }}>
                {likesInfo.count}
              </Typography>
            </IconButton>

            <IconButton onClick={handleToggleComments}>
              <ChatBubbleOutline sx={{ fontSize: 28 }} />
            </IconButton>
            <IconButton>
              <SendOutlinedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={()=> handleOpen()}>
          {likesInfo.likedByMe && (
            <Typography variant="body2" sx={{ marginRight: 1 }}>
              You &
            </Typography>
          )}
          {likesInfo.likes.length > 0 && (
            <Typography variant="body2" onClick={() => setOpenModal(true)}>
              {likesInfo.likes
                .filter((like) => like.email !== user)
                .map((like, index) => (
                  index < likesInfo.likes.length - 2 ? <span key={like.id}>{like.name}, </span> : <span key={like.id}>{like.name}</span>
                ))}
              &nbsp;Liked the Post <u><b>show all</b></u>
            </Typography>
          )}
        </Box>
        <Modal
          open={openModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              People who liked this post
            </Typography>
            <Box sx={{ mt: 2 }}>
              {likesInfo.likes.map((like) => (
                <Box
                  key={like.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{ bgcolor: 'primary.main', marginRight: 1 }}
                      onClick={() => navigate(`/profile/${like.email}`)}
                    >
                      {like.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography>{like.name}</Typography>
                  </Box>
                  <Favorite sx={{ fontSize: 28, color: '#ff1744' }} />
                </Box>
              ))}
            </Box>
            <Button
              onClick={handleClose}
              sx={{
                marginTop: 2,
                background: '#ff1744',
                color: 'white',
                marginLeft: 'auto',
                display: 'block',
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </CardContent>

      {commentOpen && comments && (
        <Box sx={{ paddingX: 2, paddingY: 1 }}>
          <TextField
            fullWidth
            label="Add a comment"
            variant="outlined"
            value={newComment}
            onChange={handleCommentChange}
          />
          <Button onClick={handleCommentSubmit} sx={{ marginTop: 1 }}>
            Post
          </Button>
          {comments.slice(0, visibleComments).map((comment) => (
            <Box key={comment.id} sx={{ marginBottom: 1, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Avatar sx={{ marginRight: 1, bgcolor: 'primary.main' }} onClick={() => navigate(`/profile/${comment.user?.email || comment.userEmail}`)}>
                  {comment.user?.name?.[0] || comment.userName?.[0]}
                </Avatar>
                <Typography variant="body2" color="text.primary">
                  <strong>{comment.user?.name || comment.userName}:</strong>
                  {`${comment.text}`}
                </Typography>
              </Box>
              {userID === comment.userId && (
                <IconButton onClick={() => handleDeleteComment(comment.id)} size="small" sx={{ color: 'red' }}>
                  <Delete />
                </IconButton>
              )}
            </Box>
          ))}
          {comments.length > visibleComments && (
            <Button onClick={handleShowMoreComments} sx={{ marginTop: 1 }}>
              Show more comments
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
});

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    caption: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    date: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;
