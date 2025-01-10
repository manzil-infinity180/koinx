import { config } from "dotenv";
config();
import { Request, Response } from "express";
import { Coin } from "../models/coinModel.js";
import { calculateStandardDeviation } from "../utils/calculateStandardDeviation.js";

const fetchLatestCoinDetails = async (coins: string) => {
  try {
    const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coins}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=true&include_last_updated_at=false&x_cg_demo_api_key=${COINGECKO_API_KEY}`;
    const options = { method: "GET", headers: { accept: "application/json" } };
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
interface Idata {
  [key: string]: number;
}
const formatSchema = (coinName: string, data: Idata) => {
  return {
    coin: coinName,
    price: data.usd,
    marketCap: data.usd_market_cap,
    change24h: data.usd_24h_change,
  };
};
export const scheduleCronJob = async (req: Request, res: Response) => {
  try {
    const data = await Promise.all([
      fetchLatestCoinDetails("bitcoin"),
      fetchLatestCoinDetails("matic-network"),
      fetchLatestCoinDetails("ethereum"),
    ]);
    console.log(data);
    if (data.length != 3) {
      throw new Error("Bad response from coingecko");
    }
    const bitcoin = formatSchema("bitcoin", data[0].bitcoin);
    const matic = formatSchema("matic-network", data[1]["matic-network"]);
    const ethereum = formatSchema("ethereum", data[2].ethereum);
    const addBitcoin = Coin.create(bitcoin);
    const addMatic = Coin.create(matic);
    const addEthereum = Coin.create(ethereum);

    const addCoinsToDatabase = await Promise.all([
      addBitcoin,
      addMatic,
      addEthereum,
    ]);
    res.status(200).json({
      status: "success",
      message: "Coins details updated!",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: (err as Error).message,
    });
  }
};


export const latestCoinDetails = async (req: Request, res: Response) => {
    try{
        const params = req.query.coin;
        if (!params) {
            throw new Error("Missing 'coin' parameter");
        }
        const data = await fetchLatestCoinDetails((params as string));
        console.log(data);
        const {usd, usd_market_cap, usd_24h_change} = data[(params as string)];
        res.status(200).json({
            price: usd,
            marketCap: usd_market_cap,
            "24hChange": usd_24h_change
        });
    }catch(err) {
        res.status(400).json({
            status: "failed",
            message: (err as Error).message,
          });
    }
}
export const deviationCoin = async (req: Request, res: Response) => {
    try{
        const params = req.query.coin;
        if (!params) {
            throw new Error("Missing 'coin' parameter");
        }
        const data = await Coin.find({coin: params},{price:1, _id:0}).sort({ createdAt: -1 }).limit(100);
        const deviation = calculateStandardDeviation(data)
        res.status(200).json({
            deviation,
        })
    }catch(err) {
        res.status(400).json({
            status: "failed",
            message: (err as Error).message,
          });
    }
}
