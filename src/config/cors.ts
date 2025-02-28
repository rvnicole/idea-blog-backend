import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = [process.env.URL_FRONTEND, undefined];

        if(process.argv.includes('--api')) {
            whiteList.push(undefined);
        }

        if(whiteList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Error de CORS'));
        }
    }
} 