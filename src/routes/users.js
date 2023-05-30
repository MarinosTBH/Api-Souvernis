import express  from "express";
import { signin, signup, getUsers, deleteUser, blockUser } from '../controllers/user.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/signin', signin);
router.post('/signup', signup);
router.patch('/blockuser/:id', blockUser);
router.delete('/:id', deleteUser);


export default router;