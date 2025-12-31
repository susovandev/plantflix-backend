export class ApiResponse<T> {
	public status: boolean;
	constructor(
		public statusCode: number,
		public message: string = 'OK',
		public data?: T,
	) {
		this.status = true;
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
	}
}
