const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
  const { name, bio, phone, avatar } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, bio, phone, avatar },
      select: { id: true, email: true, name: true, role: true, bio: true, phone: true, avatar: true },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error updating profile', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, bio: true, phone: true, avatar: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

module.exports = { updateProfile, getProfile };
