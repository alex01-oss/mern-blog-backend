import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userModel from '../models/user.js';

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const avatarUrl = `http://localhost:4444${req.body.avatarUrl}`;

    const doc = new userModel({
      fullName,
      email,
      avatarUrl,
      passwordHash: hash
    });

    const user = await doc.save();

    const token = jwt.sign(
      { _id: user._id },
      'secret123',
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'registration failed'
    });
  }
}

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if(!user) {
      return res.status(404).json({
        message: 'user is not exist'
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if(!isValidPass) {
      return res.status(400).json({
        message: 'incorrect login or password'
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      'secret123',
      { expiresIn: '30d' }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'authorization failed'
    });
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'user not found'
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'no access'
    });
  }
}