import { Request, Response } from "express";
import BacteriaService from "../services/bacteriaService";

class BacteriaController {
	private bacteriaService: BacteriaService;

	constructor() {
		this.bacteriaService = new BacteriaService();
	}

	fetchBacteriaData = async (req: Request, res: Response) => {
		try {
			const range = req.query.range as string;
			let bacteriaData: any;
			if (range != undefined) {
				const rangeArray = range.split(",");
				bacteriaData = await this.bacteriaService.getBacteriaData(
					+rangeArray[0],
					+rangeArray[1]
				);
			} else {
				bacteriaData = await this.bacteriaService.getBacteriaData();
			}

			res.send(bacteriaData);
		} catch (error) {
			res.status(500).json({ error: "Failed to fetch data" });
		}
	};
}

export default BacteriaController;
