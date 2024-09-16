const { Router, Request, Response } = require('express');
const signup = require('../../controllers/auth/signup');
const login = require('../../controllers/auth/login');
const getUser = require('../../controllers/auth/getUser');
const authenticate = require('../../middleWare/authMiddleware');
const createGig = require('../../controllers/gig/createGig');
const getAllGigs = require('../../controllers/gig/getAllGigs');
const upload = require('../../middleWare/multer');

const router = Router();

router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);
router.use(authenticate);
router.get('/user/:id', getUser);
router.post('/createGig', upload.fields([{ name: 'image' }, { name: 'video' }]), createGig);
router.get('/getAllGigs', getAllGigs);

module.exports = router;
