import Joi from "joi";
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

export class ChatValidator {
	private createSchema = Joi.object({
		text: Joi.string(),
		room: Joi.number().required(),
		toUser: Joi.number().required()
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { error } = this.createSchema.validate(req.body);
		if (error) throw error;

		next();
	});
}
