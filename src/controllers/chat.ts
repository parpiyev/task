import { NextFunction, Request, Response } from "express";
import { storage } from "../storage/main";
import path from "path";
import { writeFile } from "fs/promises";
import { io } from "../app";
import catchAsync from "../utils/catchAsync";
import { firebase_admin } from "../config/firebase";
import { IRoom } from "../storage/postgreSQL/room";

export class ChatController {
	get = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { id } = res.locals,
			_id = req.params.id;

		const chat1 = await storage.chat.find({ from_id: parseInt(id), to_id: parseInt(_id) }),
			chat2 = await storage.chat.find({ from_id: parseInt(_id), to_id: parseInt(id) });

		res.status(200).json({
			success: true,
			data: {
				chat1,
				chat2
			}
		});
	});

	create = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const { toUser } = req.body,
			{ id, user } = res.locals;

		const to = await storage.user.findById(toUser);

		if (req.file) {
			req.body.file = `${req.file.originalname.split(".")[0]}-${Date.now()}${path.extname(
				req.file.originalname
			)}`;
			await writeFile(path.join(__dirname, "../uploads", req.body.file), req.file.buffer);
		}

		const chat = await storage.chat.create({ ...req.body, fromUser: parseInt(id) });

		await storage.room.update(chat.room, { chat: chat.id } as IRoom);

		io.emit(`${chat.room}`, chat);

		const notification_options = {
			contentAvailable: true,
			priority: "high",
			timeToLive: 60 * 60 * 24
		};

		// firebaase token bo'lsa komentan o'chin push xarab qurulmaga boradi

		// if (to.firebasetokens.length)
		// 	await firebase_admin.messaging().sendToDevice(
		// 		to.firebasetokens,
		// 		{
		// 			notification: {
		// 				title: `${user.first_name} ${user.last_name}`,
		// 				body: `${chat.text ?? chat.file}`
		// 			}
		// 		},
		// 		notification_options
		// 	);

		res.status(201).json({
			success: true,
			data: {
				chat
			}
		});
	});
}
