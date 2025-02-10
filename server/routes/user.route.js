import { Router } from 'express';
import { registerUser, login } from '../controllers/user.controller.js';


const router = Router();

router.route('/register').post(registerUser);
router.route('/login').get(login);

export default router;