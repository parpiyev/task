import db from "../../core/db";
import { logger } from "../../config/logger";
import AppError from "../../utils/appError";

export interface IUser {
	id: number;
	firstName: string;
	lastName: string;
	firebasetokens: string[];
	phoneNumber: number;
	password: string;
}

export class UserStorage {
	private scope = "storage.users";

	async find(query: object): Promise<IUser[]> {
		try {
			return (await db.query(`SELECT * FROM users ORDER BY id ASC`)).rows;
		} catch (error) {
			logger.error(`${this.scope}.find: finished with error: ${error}`);
			throw error;
		}
	}

	async findById(id: number): Promise<IUser> {
		try {
			const user = (await db.query("SELECT * FROM users WHERE id = $1", [id])).rows[0];

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

	async findOne(phoneNumber: number): Promise<IUser> {
		try {
			const user = (
				await db.query("SELECT * FROM users WHERE phoneNumber = $1", [phoneNumber])
			).rows[0];

			return user;
		} catch (error) {
			logger.error(`${this.scope}.findOne: finished with error: ${error}`);
			throw error;
		}
	}

	async create(payload: IUser): Promise<IUser> {
		try {
			return (
				await db.query(
					"INSERT INTO users (firstName, lastName, firebasetokens, phoneNumber, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
					[
						payload.firstName,
						payload.lastName,
						payload.firebasetokens,
						payload.phoneNumber,
						payload.password
					]
				)
			).rows[0];
		} catch (error) {
			logger.error(`${this.scope}.create: finished with error: ${error}`);
			throw error;
		}
	}

	async update(id: number, payload: IUser): Promise<IUser> {
		try {
			const user = (
				await db.query("UPDATE users SET firebasetokens = $1 WHERE id = $2 RETURNING *", [
					payload.firebasetokens,
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
				await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id])
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
