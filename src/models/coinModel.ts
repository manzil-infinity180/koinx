import mongoose, { Schema, model } from "mongoose";
import { number, string } from "zod";

export interface Coin {
  coin: string;
  price: number;
  marketCap: number;
  change24h: number;
}

const coinSchema = new Schema<Coin>(
  {
    coin: {
      type: String,
      required: [true, "Missing parameter coin"],
    },
    price: {
      type: Number,
      required: [true, "Missing parameter price"],
    },
    marketCap: {
      type: Number,
      required: [true, "Missing parameter marketCap"],
    },
    change24h: {
      type: Number,
      required: [true, "Missing parameter change24h"],
    },
  },
  {
    timestamps: true,
  }
);

export const Coin = model<Coin>("Coin", coinSchema);
