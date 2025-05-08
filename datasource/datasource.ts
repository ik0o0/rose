import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { File } from "../entities/File";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "rose-database.db",
    synchronize: true, // False in production
    logging: true,
    entities: [User, File],
})

export async function initializeDatabase() {
    try {
        await AppDataSource.initialize()
        console.log("Data source has been initialized.")
    } catch (err) {
        console.error("Error during data source initialization", err)
    }
}
