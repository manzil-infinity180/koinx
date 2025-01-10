import express, { Request, Response } from "express";
import cron from "node-cron"
export const app = express();
import bodyParser from "body-parser";
import { router as coinRoute} from "./routers/coinRoute.js";
import { scheduleCronJob } from "./controllers/coinController.js";

app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req:Request, res: Response) => {
    res.send("server is running");
})
app.use('/', coinRoute);
cron.schedule('0 */2 * * *',async () => {
    console.log("Running cron job to fetch latest coin details...");
    try {
      await scheduleCronJob(
        {} as Request,
        {
          status: (statusCode: number) => ({
            json: (response: any) => console.log(response),
          }),
        } as unknown as Response
      );
    } catch (error) {
      console.error("Error running cron job:", error);
    }
});
