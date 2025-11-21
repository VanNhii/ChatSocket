import express from 'express';
import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/authController.js';
const router = Router();

// Example route for user login
router.post('/signup', signUp);

router.post('/signin', signIn);

router.post('/signout', signOut);
export default router;