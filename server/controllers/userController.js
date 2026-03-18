const db = require('../db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, status, created_at FROM users'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  if (req.user.id === parseInt(req.params.id))
    return res.status(403).json({ message: 'You cannot change your own role' });

  const { role } = req.body;
  const validRoles = ['user', 'admin', 'superadmin'];
  if (!validRoles.includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  try {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    await db.query(
      'INSERT INTO activity_logs (actor_id, action, target_user_id) VALUES (?, ?, ?)',
      [req.user.id, `Changed role to ${role}`, req.params.id]
    );
    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.banUser = async (req, res) => {
  if (req.user.id === parseInt(req.params.id))
    return res.status(403).json({ message: 'You cannot ban yourself' });

  try {
    await db.query('UPDATE users SET status = "banned" WHERE id = ?', [req.params.id]);
    await db.query(
      'INSERT INTO activity_logs (actor_id, action, target_user_id) VALUES (?, ?, ?)',
      [req.user.id, 'Banned user', req.params.id]
    );
    res.json({ message: 'User banned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    await db.query('UPDATE users SET status = "active" WHERE id = ?', [req.params.id]);
    await db.query(
      'INSERT INTO activity_logs (actor_id, action, target_user_id) VALUES (?, ?, ?)',
      [req.user.id, 'Unbanned user', req.params.id]
    );
    res.json({ message: 'User unbanned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.user.id === parseInt(req.params.id))
    return res.status(403).json({ message: 'You cannot delete yourself' });

  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    await db.query(
      'INSERT INTO activity_logs (actor_id, action, target_user_id) VALUES (?, ?, ?)',
      [req.user.id, 'Deleted user', req.params.id]
    );
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  if (req.user.id === parseInt(req.params.id))
    return res.status(403).json({ message: 'Use profile settings to change your own password' });

  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ message: 'Password must be at least 6 characters' });

  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.params.id]);
    await db.query(
      'INSERT INTO activity_logs (actor_id, action, target_user_id) VALUES (?, ?, ?)',
      [req.user.id, 'Reset user password', req.params.id]
    );
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email and password are required' });

  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role || 'user']
    );
    await db.query(
      'INSERT INTO activity_logs (actor_id, action, target_user_id) VALUES (?, ?, LAST_INSERT_ID())',
      [req.user.id, 'Created new user']
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const [logs] = await db.query(
      `SELECT activity_logs.*, users.name as actor_name 
       FROM activity_logs 
       JOIN users ON activity_logs.actor_id = users.id 
       ORDER BY activity_logs.created_at DESC`
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM users');
    const [[{ active }]] = await db.query('SELECT COUNT(*) as active FROM users WHERE status = "active"');
    const [[{ banned }]] = await db.query('SELECT COUNT(*) as banned FROM users WHERE status = "banned"');
    const [[{ admins }]] = await db.query('SELECT COUNT(*) as admins FROM users WHERE role = "admin"');
    const [[{ newThisWeek }]] = await db.query(
      'SELECT COUNT(*) as newThisWeek FROM users WHERE created_at >= NOW() - INTERVAL 7 DAY'
    );
    res.json({ total, active, banned, admins, newThisWeek });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};