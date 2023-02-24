import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDataBase from "../../database/connectDataBase";
import { app } from "../index";
import User from "../../database/models/User";
import bcryptjs from "bcryptjs";
import fs from "fs";
import path from "path";
import { upload } from "./usersRouters";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDataBase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
  jest.clearAllMocks();
});

describe("Given a POST `/users/login` endpoint", () => {
  const loginUrl = "/users/login";
  const mockUser = {
    password: "1aasdasd123123",
    username: "Marc",
    email: "marc@girbau.com",
  };

  describe("When it receives a request with a non-registered username `Róman` and password `roman1234`", () => {
    beforeAll(async () => {
      await User.create(mockUser);
    });

    test("Then it should response with a status 401 and and error with a message `Wrong credentials`", async () => {
      const expectedErrorMessage = "Wrong credentials";
      const mockRomanUser = {
        username: "Róman",
        password: "roman1234",
      };

      const expectedStatus = 401;

      const response = await request(app)
        .post(loginUrl)
        .send(mockRomanUser)
        .expect(401);

      expect(response.body).toHaveProperty("error", expectedErrorMessage);
    });
  });
});

describe("Given a POST /users/register endpoint", () => {
  const register = "/users/register";

  describe("When it receives a request with a non-regisered username 'Alexander', password '123123123', email 'aguillenhernandez@gmail.com'", () => {
    test("Then it should response with status code 201 and username 'Alexander', password '4139048023804', email 'aguillenhernandez@gmail.com'", async () => {
      bcryptjs.hash = jest.fn().mockReturnValue("4139048023804");

      const response = await request(app)
        .post(register)
        .set({
          "Content-Type": "multipart/form-data",
        })
        .field("username", "Alexander")
        .field("password", "4139048023804")
        .field("email", "aguillenhernandez@gmail.com")
        .expect(201);

      expect(response.body).toHaveProperty(
        "user",
        expect.objectContaining({
          username: "Alexander",
          password: "4139048023804",
          email: "aguillenhernandez@gmail.com",
        })
      );
    });
  });
});
