import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        console.log("Solicito", origin);
        const whiteList = [process.env.URL_FRONTEND];

        if(process.argv.includes('--api')) {
            whiteList.push(undefined);
        }

        if(whiteList.includes(origin)) {
            console.log("Permitido");
            callback(null, true);
        }
        else {
            callback(new Error('Error de CORS'));
        }
    }
} 