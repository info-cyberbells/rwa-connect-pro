import User from "../models/user.js";

export const list = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) { next(err); }
};

export const get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
};
