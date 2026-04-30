const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-change-in-production';

// Demo users — in a real app these would be in a database
const DEMO_USERS = [
  {
    id: 1,
    email: 'fe@demo.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'frontend',
    name: 'Priya (FE Dev)',
  },
  {
    id: 2,
    email: 'be@demo.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    role: 'backend',
    name: 'Arjun (BE Dev)',
  },
];

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = DEMO_USERS.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: (req, res) => {
    return res.json({ success: true, message: 'Logged out successfully' });
  },

  getProfile: (req, res) => {
    return res.json({ user: req.user });
  },
};

module.exports = authController;
