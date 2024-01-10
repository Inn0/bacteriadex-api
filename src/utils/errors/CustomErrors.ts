export class CustomError extends Error {
	constructor(message: string) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class NotFoundError extends CustomError {
	constructor(message = "Not Found") {
		super(message);
	}
}

export class BadRequestError extends CustomError {
	constructor(message = "Bad Request") {
		super(message);
	}
}
