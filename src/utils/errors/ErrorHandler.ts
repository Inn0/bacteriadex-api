import { NextFunction, Request, Response } from "express";
import { CustomError, NotFoundError, BadRequestError } from "./CustomErrors";

export class ErrorHandler {
	handleError(res: Response, err: unknown) {
		if (err instanceof CustomError) {
			if (err instanceof NotFoundError) {
				return res.status(404).json({ error: err.message });
			}
			if (err instanceof BadRequestError) {
				return res.status(400).json({ error: err.message });
			}
		}
		res.status(500).json({ error: "Internal Server Error" });
	}
}
