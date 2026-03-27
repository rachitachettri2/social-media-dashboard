import express from 'express';
import { metricsController } from '../controllers/metrics.controllers.js';

const router = express.Router();

router.post('/:id', metricsController.updateMetrics);
router.get('/export/:id', metricsController.exportMetrics);

export default router;