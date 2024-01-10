import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import BacteriaRoutes from "./routes/BacteriaRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;
const bacteriaRoutes = new BacteriaRoutes();

app.use("/", bacteriaRoutes.router);

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
