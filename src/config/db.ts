import { Sequelize } from "sequelize";
import colors from "colors";
import path from 'path';

// Crear una instancia de sequalize
const db = new Sequelize(process.env.URL_DB, {
    dialect: "postgres",
    logging: false
});

const syncModels = async () => {
    try {
        await db.sync({ force: false, alter: true });
        console.log(colors.bgCyan.bold("Todos los modelos se sincronizaron correctamente"));
    }
    catch(error) {
        console.error(colors.bgRed.bold("Error al sincronizar los modelos:"));
        console.error(error);
    }
}

export const connectDB = async (): Promise<void> => {
    try {
        await db.authenticate();
        console.log(colors.bgBlue.bold("Conexión exitosa a la base de datos"));
        await syncModels();
    }
    catch(error) {
        console.error(colors.bgRed.bold("Error conectando a la base de datos:"));
        console.error(error);
        throw error;
    }
};

export default db;
