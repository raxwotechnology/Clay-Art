import express from 'express';
import { getCompanySettings, updateCompanySettings } from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public GET so Login page, public bills/receipts, and sidebars can display the company logo & name
router.route('/company')
    .get(getCompanySettings)
    .put(protect, authorize('admin', 'manager'), updateCompanySettings);

export default router;
