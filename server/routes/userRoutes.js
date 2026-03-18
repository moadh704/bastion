const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  banUser,
  unbanUser,
  deleteUser,
  resetPassword,
  createUser,
  getActivityLogs,
  getDashboardStats,
} = require('../controllers/userController');

router.get('/', protect, requireRole('admin', 'superadmin'), getAllUsers);
router.get('/stats', protect, requireRole('admin', 'superadmin'), getDashboardStats);
router.get('/logs', protect, requireRole('superadmin'), getActivityLogs);
router.get('/:id', protect, requireRole('admin', 'superadmin'), getUserById);
router.post('/', protect, requireRole('admin', 'superadmin'), createUser);
router.put('/:id/role', protect, requireRole('superadmin'), updateUserRole);
router.put('/:id/ban', protect, requireRole('admin', 'superadmin'), banUser);
router.put('/:id/unban', protect, requireRole('admin', 'superadmin'), unbanUser);
router.put('/:id/reset-password', protect, requireRole('superadmin'), resetPassword);
router.delete('/:id', protect, requireRole('superadmin'), deleteUser);

module.exports = router;