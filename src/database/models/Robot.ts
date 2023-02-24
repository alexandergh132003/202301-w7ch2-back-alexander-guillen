import { model, Schema } from "mongoose";

export const robotSchema = new Schema({
  name: String,
  image: String,
  stats: {
    speed: Number,
    endurance: Number,
  },
  creationDate: Date,
});

export const Robot = model("Robot", robotSchema, "alexander-robots");
