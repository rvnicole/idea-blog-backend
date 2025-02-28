import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Followed from "../models/Followed";
import { generateJWT } from "../utils/jwt";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { sendMailConfirmAccount, sendMailRestorePassword } from "../utils/mailer";
import { Op } from "sequelize";

export class AuthController {

    // Crear cuenta
    static createAccount = async ( req: Request, res: Response ) => {
        try {            
            // Consultar Usuario para evitar duplicados
            const userExists = await User.findOne({ where: { email: req.body.email } });
            if( userExists ) {
                res.status(409).json({ success: false, message: "El usuario ya esta registrado" });
                return;
            }

            // Encriptación de la contraseña
            const password = await hashPassword(req.body.password);

            // Crear un usuario
            const user = await User.create({
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                description: req.body.description,
                password
            });

            // Crear Token
            const token = await Token.create({
                token: generateToken(),
                user: user.dataValues.id
            });

            // Enviar Email
            sendMailConfirmAccount(user.dataValues.email, token.dataValues.token);
            
            res.status(200).json({ success: true, message: "Cuenta creada, revisa tu email para confirmarla", data: {user: user.dataValues.id} });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Confirmar cuenta
    static confirmAccount = async ( req: Request, res: Response ) => {
        try {
            // Consultar token
            const token = await Token.findOne({ 
                where: { 
                    [Op.and]: [
                        { token: req.body.token },
                        { user: req.body.id }
                    ]
                } 
            });
            
            if(!token) {
                res.status(409).json({ success: false, message: "El token es invalido" });
                return;
            }

            // Consultar usuario
            const user = await User.findOne({ where: { id: token.dataValues.user } });
            if(!user) {
                res.status(409).json({ success: false, message: "Usuario no encontrado" });
                return;
            }
            
            await user.update({
                "confirmada": true
            });

            res.status(200).json({ success: true, message: "Cuenta confirmada" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Generar Nuevo Token
    static generateNewToken = async ( req: Request, res: Response ) => {
        try {
            // Consultar token
            const token = await Token.findOne({ where: { user: req.body.id }});
            if(token) {
                await token.destroy();
            }

            // Consultar usuario
            const user = await User.findOne({ where: { id: req.body.id } });
            if(!user) {
                res.status(409).json({ success: false, message: "Usuario no encontrado" });
                return;
            }
            
            // Crear Token
            const newToken = await Token.create({
                token: generateToken(),
                user: user.dataValues.id
            });

            // Enviar Email
            sendMailConfirmAccount(user.dataValues.email, newToken.dataValues.token);

            res.status(200).json({ success: true, message: "Nuevo token generado, revisa tu email" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // user
    static user = async ( req: Request, res: Response ) => {
        try {            
            const user = await User.findByPk(req.user.dataValues.id, {
                attributes: ['id', 'name', 'lastname', 'email', 'description'],
                include: [                  
                    {
                        model: Followed,
                        as: 'following',
                        include: [{
                            model: User,
                            as: 'followedUser',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },                    
                    {
                        model: Followed,
                        as: 'followers',
                        include: [{
                            model: User,
                            as: 'followerUser',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },
                ]
            }) as any;

            if( !user ) {
                const error = new Error('El usuario no existe');
                res.status(409).json({ success: false, errors: error.message });
                return;
            }

            const data = {
                id: user.dataValues.id,
                name: user.dataValues.name,
                lastname: user.dataValues.lastname,
                email: user.dataValues.email,
                description: user.dataValues.description,
                following: user.dataValues.following.map((followed: any) => ({
                    id: followed.dataValues.id,
                    followed: followed.dataValues.followedUser,
                })),
                followers: user.dataValues.followers.map((follower: any) => ({
                    id: follower.dataValues.id,
                    follower: follower.dataValues.followerUser,
                }))
            }

            res.status(200).json({ success: true, message: "Usuario encontrado", data });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // LogIn
    static login = async ( req: Request, res: Response ) => {
        try {            
            // Consultar Usuario
            const userExists = await User.findOne({ where: { email: req.body.email } });
            if( !userExists ) {
                res.status(409).json({ success: false, message: "Usuario no encontrado" });
                return;
            }

            // Comparar contraseña
            const validado = await checkPassword(req.body.password, userExists.dataValues.password);
            if( !validado ) {
                res.status(409).json({ success: false, message: "Email o contraseña incorrecta" });
                return;
            }

            const token = generateJWT({ id: userExists.dataValues.id });
            res.send(token);
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Editar Cuenta
    static editAccount =  async ( req: Request, res: Response ) => {
        try {            
            req.user.update({
                "name": req.body.name,
                "lastname": req.body.lastname,
                "description": req.body.description,
            });

            res.status(200).json({ success: true, message: "Usuario actualizado" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    static generateTokenRestorePassword = async ( req: Request, res: Response ) => {
        try {
            // Consultar usuario
            const user = await User.findOne({ where: { email: req.body.email } });
            if(!user) {
                res.status(409).json({ success: false, message: "No se encontro un usuario con este email" });
                return;
            }

            // Consultar token
            const token = await Token.findOne({ where: { user: user.dataValues.id }});
            if(token) {
                await token.destroy();
            }
            
            // Crear Token
            const newToken = await Token.create({
                token: generateToken(),
                user: user.dataValues.id
            });

            // Enviar Email
            sendMailRestorePassword(user.dataValues.email, newToken.dataValues.token);

            res.status(200).json({ success: true, message: "Se envio un token a tu email" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Validar si es un token valido
    static validateToken = async ( req: Request, res: Response ) => {
        try {
            // Consultar usuario
            const user = await User.findOne({ where: { email: req.body.email } });
            if(!user) {
                res.status(409).json({ success: false, message: "No se encontro un usuario con este email" });
                return;
            }

            // Consultar token
            const token = await Token.findOne({ 
                where: { 
                    [Op.and]: [
                        { token: req.body.token },
                        { user: user.dataValues.id }
                    ]
                } 
            });
            
            if(!token) {
                res.status(409).json({ success: false, message: "El token es invalido" });
                return;
            }
            await token.destroy();
            res.status(200).json({ success: true, message: "Código Validado" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    static editPassword =  async ( req: Request, res: Response ) => {
        try {
            // Consultar usuario
            const user = await User.findOne({ where: { email: req.body.email } });
            if(!user) {
                res.status(409).json({ success: false, message: "No se encontro un usuario con este email" });
                return;
            }
            
            // Encriptación de la contraseña
            const password = await hashPassword(req.body.password);
            await user.update({ password });

            res.status(200).json({ success: true, message: "Contraseña actualizada" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }
}