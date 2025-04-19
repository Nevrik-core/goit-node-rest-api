import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatarURL;
    try {
      avatarURL = gravatar.url(email, { s: '250', d: 'retro' }, true);
    } catch {
      avatarURL = null;
    }

    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (err) {
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

    await user.update({ token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL
      },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    await user.update({ token: null });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription, avatarURL } = req.user;
    res.status(200).json({ email, subscription, avatarURL });
  } catch (err) {
    next(err);
  }
};


export const updateAvatar = async (req, res, next) => {
  try {
    const { path: tempPath, filename } = req.file;
    const avatarsDir = path.resolve("public", "avatars");
    const finalPath = path.join(avatarsDir, filename);

    await fs.rename(tempPath, finalPath);
    const avatarURL = `/avatars/${filename}`;

    await req.user.update({ avatarURL });

    res.json({ avatarURL });
  } catch (err) {
    next(err);
  }
};