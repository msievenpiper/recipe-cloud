import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Account, Session, VerificationToken } from "@next-auth/typeorm-adapter/dist/entities";
import { Recipe } from "../entities/Recipe";

const AppDataSource = new DataSource({
    type: "sqlite",
    database: "recipes.db",
    synchronize: true,
    logging: true,
    entities: [User, Account, Session, VerificationToken, Recipe],
});

let dataSourcePromise: Promise<DataSource>;

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._dataSource) {
        global._dataSource = AppDataSource.initialize();
    }
    dataSourcePromise = global._dataSource;
} else {
    // In production mode, it's best to not use a global variable.
    dataSourcePromise = AppDataSource.initialize();
}

export default dataSourcePromise;
