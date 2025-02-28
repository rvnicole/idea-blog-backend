import cron from "node-cron";
import Token from "../models/Token";
import { Op } from "sequelize";

cron.schedule('*/1 * * * *', async () => {
    try {
        console.log("Limpiando...");
        const expiredDate = new Date(Date.now() - 10 * 60 * 1000);

        const deletedTokens = await Token.destroy({
            where: {
                createdAt: {
                    [Op.lt]: expiredDate,
                },
            },
        });
        
        console.log("Tokens expirados eliminados: ", deletedTokens);
    }
    catch(error) {
        console.log('Error Tokens Expirados:', error)
    }
});