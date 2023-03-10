import "../../loadEnvironment.js";
import { type NextFunction, type Request, type Response } from "express";
import { CustomError } from "../../CustomError/CustomError.js";
import User from "../../database/models/User.js";
import { type CustomJwtPayload, type UserCredentials } from "../../types";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    const customError = new CustomError(
      "Wrong credentials",
      401,
      "Wrong credentials"
    );

    next(customError);

    return;
  }

  const jwtPayload: CustomJwtPayload = {
    sub: user?._id.toString(),
    username: user.username,
  };

  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!);

  res.status(200).json({ token });
};

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);
    const image = req.file?.originalname;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      image,
    });

    res.status(201).json({ user });
  } catch (error: unknown) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "User couldn't be created"
    );

    next(customError);
  }
};
