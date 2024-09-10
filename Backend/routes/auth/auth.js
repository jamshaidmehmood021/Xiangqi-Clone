const { Router, Request, Response } = require('express');
const signup = require('../../controllers/auth/signup');
const login = require('../../controllers/auth/login');
const addPost = require('../../controllers/post/addPost');
const getPosts = require('../../controllers/post/getPosts');
const getPostsByUser = require('../../controllers/post/fetchPostByUser');
const deletePost = require('../../controllers/post/deletePost');
const addComment = require('../../controllers/comment/addComment');
const getCommentsByPost = require('../../controllers/comment/getCommentsByPost');
const deleteComment = require('../../controllers/comment/deleteComment');
const likePost = require('../../controllers/post/likePost');
const unlikePost = require('../../controllers/post/unlikePost');
const getLikesInfo = require('../../controllers/post/getLikesInfo');

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/addPost', addPost);
router.get('/getPosts', getPosts);
router.get('/getPostsByUser', getPostsByUser);
router.delete('/deletePost/:id', deletePost);
router.post('/addComment', addComment);
router.get('/getCommentsByPost', getCommentsByPost);
router.delete('/deleteComment/:id', deleteComment);
router.post('/posts/like', likePost);
router.delete('/posts/like', unlikePost);
router.get('/likesInfo', getLikesInfo);


module.exports = router;
