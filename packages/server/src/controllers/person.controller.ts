import { Router, Request, Response } from 'express';
import { PersonControllerBackEnd, InitServerIdentity } from '../convector';

const router: Router = Router();

export const PersonExpressController: Router = router;