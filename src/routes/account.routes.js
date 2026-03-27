import express from 'express';
import { accountsController } from '../controllers/account.controllers.js';

const router = express.Router();

router.post('/', accountsController.createAccount);
router.get('/dashboard', accountsController.getDashboard);
router.delete('/:id', accountsController.deleteAccount);

export default router;