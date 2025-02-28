import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User 
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if( !bearer ) {
        res.status(401).json({ success: false, message: "No Autorizado" });
        return;
    }

    const [ , token] = bearer.split(' ');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(typeof decoded === "object" && decoded.id) {
            const user = await User.findByPk(decoded.id, {
                attributes: ['id', 'name', 'lastname', 'email', 'description']
            });
           
            if(user) {
                req.user = user;
            }
            else {
                res.status(500).json({ success: false, message: "Token invalido" });
                return;
            }
        }
    }
    catch( error ) {
        res.status(500).json({ success: false, message: "Token invalido" });
        return;
    }

    next();
}