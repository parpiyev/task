import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { storage } from "../storage/main";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { IUser } from "../storage/postgreSQL/user";
import { signToken } from "../middleware/auth";

export class UserController {
	getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const users = await storage.user.find(req.query);

		res.status(200).json({
			success: true,
			data: {
				users
			}
		});
	});

	get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const user = await storage.user.findById(parseInt(req.params.id));

		res.status(200).json({
			success: true,
			data: {
				user
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		let user = await storage.user.findOne(req.body.phoneNumber);

		if (user) throw new AppError(400, "Bu telefon raqami mavjud!");

		const salt = await bcrypt.genSalt();
		req.body.password = await bcrypt.hash(req.body.password, salt);

		user = await storage.user.create(req.body);

		res.status(201).json({
			success: true,
			data: {
				token: await signToken({ id: user.id }),
				user
			}
		});
	});

	login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { phoneNumber, password, firebaseToken } = req.body;
		let user = await storage.user.findOne(phoneNumber);

		const check_password = await bcrypt.compare(password, user?.password);

		if (!user || !check_password) {
			throw new AppError(
				400,
				"Parol yoki telefon raqamni notoʻgʻri. Tekshirib qayta urunib koʻring!"
			);
		}

		if (firebaseToken) {
			user.firebasetokens.push(firebaseToken);
			user = await storage.user.update(user.id, {
				firebasetokens: user.firebasetokens
			} as IUser);
		}

		res.status(201).json({
			success: true,
			data: {
				token: await signToken({ id: user.id }),
				user
			}
		});
	});

	update = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { type, firebaseToken } = req.body,
			{ id } = res.locals;

		let user = await storage.user.findById(parseInt(id));

		if (type === "add") {
			user.firebasetokens.push(firebaseToken);
			user = await storage.user.update(parseInt(id), user);
		} else if (type === "remove") {
			user.firebasetokens = user.firebasetokens.filter((token) => token !== firebaseToken);
			user = await storage.user.update(parseInt(id), user);
		}

		res.status(200).json({
			success: true,
			data: {
				user
			}
		});
	});

	delete = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		await storage.user.delete(parseInt(res.locals.id));

		res.status(204).json({
			success: true,
			data: null
		});
	});
}
