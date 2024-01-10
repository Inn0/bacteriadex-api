import { Router } from "express";
import BacteriaController from "../controllers/bacteriaController";

class BacteriaRoutes {
	private controller: BacteriaController;
	public router: Router;
	private routeString: string;

	constructor() {
		this.router = Router();
		this.controller = new BacteriaController();
		this.routeString = "/bacteria";
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(this.routeString, this.controller.fetchBacteriaData);
		this.router.get(
			this.routeString + "/name/:name",
			this.controller.fetchBacteriaByName
		);
	}
}

export default BacteriaRoutes;
