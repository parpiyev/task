import { ChatStorage } from "./postgreSQL/chat";
import { RoomStorage } from "./postgreSQL/room";
import { UserStorage } from "./postgreSQL/user";

interface IStorage {
	user: UserStorage;
	chat: ChatStorage;
	room: RoomStorage;
}

export const storage: IStorage = {
	user: new UserStorage(),
	chat: new ChatStorage(),
	room: new RoomStorage()
};
