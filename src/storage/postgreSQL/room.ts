import db from "../../core/db";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";
import { IChat } from "./chat";
import { IUser } from "./user";

export interface IRoom {
	id: number;
	chat: number | IChat;
	users: number[] | IUser[];
}

export class RoomStorage {
	private scope = "storage.room";

	async find(query: any): Promise<IRoom[]> {
		try {
			return (await db.query(`SELECT * FROM room WHERE $1 = ANY(users);`, [query.user])).rows;
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findById(id: number): Promise<IRoom> {
		try {
			const user = (await db.query("SELECT * FROM room WHERE id = $1", [id])).rows[0];

			if (!user) {
				logger.warn(`${this.scope}.get failed to findOne`);
				throw new AppError(404, "User is not found");
			}

			return user;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IRoom): Promise<IRoom> {
		try {
			return (
				await db.query("INSERT INTO room (users) VALUES ($1) RETURNING *", [payload.users])
			).rows[0];
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(id: number, payload: IRoom): Promise<IRoom> {
		try {
			const user = (
				await db.query("UPDATE room SET chat = $1 WHERE id = $2 RETURNING *", [
					payload.chat,
					id
				])
			).rows[0];

			if (!user) {
				logger.warn(`${this.scope}.update failed to findByIdAndUpdate`);
				throw new AppError(404, "User is not found");
			}

			return user;
		} catch (error) {
			logger.error(`${this.scope}.update: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(id: number): Promise<any> {
		try {
			const user = await (
				await db.query("DELETE FROM room WHERE id = $1 RETURNING *", [id])
			).rows[0];

			if (!user) {
				logger.warn(`${this.scope}.delete failed to findByIdAndDelete`);
				throw new AppError(404, "User is not found");
			}

			return user;
		} catch (error) {
			logger.error(`${this.scope}.delete: finished with error: ${error}`);
			throw error;
		}
	}
}
