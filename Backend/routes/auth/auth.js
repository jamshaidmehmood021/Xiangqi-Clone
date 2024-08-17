const { Router, Request, Response } = require('express');
const signup = require('../../controllers/auth/signup');
const login = require('../../controllers/auth/login');

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
