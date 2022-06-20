import db from "../../core/db";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export interface IChat {
	id: number;
	text: string;
	file: string;
	room: number;
	fromUser: number;
	toUser: number;
}

export class ChatStorage {
	private scope = "storage.chat";

	async find(query: any): Promise<IChat[]> {
		try {
			return (
				await db.query(`SELECT * FROM chat WHERE fromUser = $1 AND toUser = $2`, [
					query.from_id,
					query.to_id
				])
			).rows;
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IChat): Promise<IChat> {
		try {
			return (
				await db.query(
					"INSERT INTO chat (text, file, room, fromUser, toUser) VALUES ($1, $2, $3, $4, $5) RETURNING *",
					[payload?.text, payload?.file, payload.room, payload.fromUser, payload.toUser]
				)
			).rows[0];
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async delete(id: number): Promise<any> {
		try {
			const user = await (
				await db.query("DELETE FROM chat WHERE id = $1 RETURNING *", [id])
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
