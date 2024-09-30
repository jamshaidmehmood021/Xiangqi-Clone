const { Router, Request, Response } = require('express');
const signup = require('../../controllers/auth/signup');
const login = require('../../controllers/auth/login');
const getUser = require('../../controllers/auth/getUser');
const getAllUsers = require('../../controllers/auth/getAllUsers');
const authenticate = require('../../middleWare/authMiddleware');
const createGig = require('../../controllers/gig/createGig');
const getAllGigs = require('../../controllers/gig/getAllGigs');
const getGigsByUserId = require('../../controllers/gig/getUserGigs');
const deleteGig = require('../../controllers/gig/deleteGig');
const updateGig = require('../../controllers/gig/updateGig');
const sendMessage = require('../../controllers/message/sendMessage');
const getMessages = require('../../controllers/message/getMessages');
const getConversationsByGig = require('../../controllers/conversations/getConversations');
const createOrder = require('../../controllers/Orders/createOrder');
const getAiSuggestions = require('../../controllers/AI/getAiSuggessions');
const getOrderById = require('../../controllers/Orders/getOrderById');
const updateOrderStatus = require('../../controllers/Orders/updateOrderStatus');
const getOrderByIdAndGig = require('../../controllers/Orders/getOrderByIdAndGig');
const createRating = require('../../controllers/rating/createRating');
const checkUserRatingByOrder = require('../../controllers/rating/checkUserRatingByOrder');
const checkUserRating = require('../../controllers/rating/checkUserRating');
const getAllOrder = require('../../controllers/Orders/getAllOrders');
const blockUser = require('../../controllers/auth/blockUser');

const upload = require('../../middleWare/multer');

const router = Router();

router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);
router.use(authenticate);
router.get('/user/:id', getUser);
router.get('/getAllUsers', getAllUsers);
router.post('/blockUser/:id', blockUser);
router.post('/createGig', upload.fields([{ name: 'image' }, { name: 'video' }]), createGig);
router.get('/getAllGigs', getAllGigs);
router.get('/getUserGigs/:userId', getGigsByUserId);
router.delete('/deleteGig/:id', deleteGig); 
router.post('/updateGig/:id', upload.fields([{ name: 'image' }, { name: 'video' }]), updateGig); 
router.post('/sendMessage', sendMessage);
router.get('/messages/:conversationId', getMessages);
router.get('/conversations/:gigId', getConversationsByGig);
router.post('/createOrder', createOrder);
router.get("/suggestions" , getAiSuggestions);
router.get('/getOrderById/:id', getOrderById);
router.put('/updateOrderStatus/:orderId', updateOrderStatus);
router.post('/orders/:id', getOrderByIdAndGig);
router.get('/orders', getAllOrder);
router.post('/createRating', createRating);
router.get('/ratings/:orderId', checkUserRatingByOrder);
router.get('/rating/:userId', checkUserRating);
router.post('/uploadFile', upload.single('file'), (req, res) => {
    if (req.file) {
      res.status(200).json({ fileName: req.file.filename });
    } else {
      res.status(400).json({ message: 'File upload failed.' });
    }
});
  

module.exports = router;
