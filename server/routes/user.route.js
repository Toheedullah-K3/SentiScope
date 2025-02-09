import { Router } from 'express';
import { registerUserTesting } from '../controllers/user.controller.js';


const router = Router();

router.route('/testing').get(registerUserTesting);

export default router;