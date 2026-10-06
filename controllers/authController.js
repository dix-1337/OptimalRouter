const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

function createToken(user) {
    if (!process.env.JWT_SECRET) {
        const error = new Error('JWT_SECRET не задан в файле .env');
        error.status = 500;
        throw error;
    }

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        }
    );
}

function getPublicUser(user) {
    return {
        id: user.id,
        email: user.email,
        role: user.role,
    };
}

async function register(req, res, next) {
    try {
        const email =
            typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';

        const password =
            typeof req.body?.password === 'string'
                ? req.body.password
                : '';

        if (!email || !password) {
            return res.status(400).json({
                error: 'Поля email и password обязательны',
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                error: 'Некорректный формат email',
            });
        }

        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Пользователь с таким email уже существует',
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            passwordHash,
            role: 'user',
        });

        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: getPublicUser(user),
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Пользователь с таким email уже существует',
            });
        }

        next(error);
    }
}

async function login(req, res, next) {
    try {
        const email =
            typeof req.body?.email === 'string'
                ? req.body.email.trim().toLowerCase()
                : '';

        const password =
            typeof req.body?.password === 'string'
                ? req.body.password
                : '';

        if (!email || !password) {
            return res.status(400).json({
                error: 'Поля email и password обязательны',
            });
        }

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                error: 'Неверный email или пароль',
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: 'Неверный email или пароль',
            });
        }

        const token = createToken(user);

        res.json({
            message: 'Вход выполнен успешно',
            token,
            user: getPublicUser(user),
        });
    } catch (error) {
        next(error);
    }
}

async function getProfile(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return res.status(404).json({
        error: 'Пользователь не найден',
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    register,
    login,
    getProfile,
};