import express from 'express';
import { getUserDetails, login, signup, updateRequests, verifyEmail, verifyLoginCode } from '../controller/AuthController.js';
import { signupSchema, validateRequest } from '../middleware/validateRequest.js';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/signup', validateRequest(signupSchema), signup);
userRouter.get('/user', getUserDetails);
userRouter.get('/update-requests', updateRequests);
userRouter.get('/verify', verifyEmail);
userRouter.post('/verify-login', verifyLoginCode);


export default userRouter