export class ErrorResponse {
	name: string;
	message: string;

	constructor(name: string, message: string) {
		this.name = name;
		this.message = message;
	}
}
