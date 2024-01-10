import { Request, Response } from "express";
import BacteriaService from "../services/bacteriaService";
import { ErrorResponse } from "../models/ErrorResponse";
import { ErrorHandler } from "../utils/errors/ErrorHandler";

class BacteriaController {
	private bacteriaService: BacteriaService;
	private errorHandler: ErrorHandler = new ErrorHandler();

	constructor() {
		this.bacteriaService = new BacteriaService();
	}

	fetchBacteriaData = async (req: Request, res: Response) => {
		try {
			const range = req.query.range as string;
			let bacteriaData: any;
			if (range != undefined) {
				const rangeArray = range.split(",");
				bacteriaData =
					await this.bacteriaService.getBacteriaDataWithRange(
						+rangeArray[0],
						+rangeArray[1]
					);
			} else {
				bacteriaData =
					await this.bacteriaService.getBacteriaDataWithRange();
			}

			res.send(bacteriaData);
		} catch (error) {
			this.errorHandler.handleError(res, error);
		}
	};

	fetchBacteriaByName = async (req: Request, res: Response) => {
		try {
			const bacteria = await this.bacteriaService.getBacteriaByName(
				req.params.name
			);
			res.send(bacteria);
		} catch (error) {
			this.errorHandler.handleError(res, error);
		}
	};
}

export default BacteriaController;
