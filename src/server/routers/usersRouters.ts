import { Router } from "express";
import { loginUser, registerUser } from "../controllers/usersControllers.js";
import multer from "multer";

export const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });

const usersRouter = Router();

usersRouter.post("/login", loginUser);
usersRouter.post("/register", upload.single("image"), registerUser);

export default usersRouter;
