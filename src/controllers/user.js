

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import UserModal from "../models/user.js";

const secret = 'test';

//sign in 
export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
//signup 

export const signup = async (req, res) => {
  const { email, password, firstName, lastName, role, picture } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const result = await UserModal.create({ email, password: hashedPassword, role, picture, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong2" });
    
    console.log(error);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////

//fetch users

export const getUsers = async (req, res) => {
  try {
    const users = await UserModal.find();
    res.status(200).json(users)
    
  } catch (error) {
    res.status(500).json({ message: "Something went wrong2" });
    console.log(error);
  }
}

//block user
export const blockUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with such id')

  const user = await UserModal.findById(id)
  const active = user.active

  if (active) {
    user.active = false
  } else {
    user.active = true
  }

  const userStatus = await UserModal.findByIdAndUpdate(id, {...user})

  res.json({ message : `User ${!userStatus.active ? "blocked" : "unblocked"} successfully`});

}
//delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params

  
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with such id')

  await UserModal.findByIdAndRemove(id);

  res.json({ message : 'User deleted successfully' });
    
}