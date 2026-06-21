import { Router } from 'express';
import { authenticate } from '../shared/middleware/authenticate';
import { validateDto } from '../shared/middleware/validateDto';
import { asyncWrapper } from '../shared/utils/asyncWrapper';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import * as ctrl from './auth.controller';

const router: Router = Router();

router.post('/register', validateDto(RegisterDto), asyncWrapper(ctrl.register));
router.post('/login', validateDto(LoginDto), asyncWrapper(ctrl.login));
router.post('/logout', authenticate, ctrl.logout);
router.get('/me', authenticate, asyncWrapper(ctrl.getMe));

export default router;
