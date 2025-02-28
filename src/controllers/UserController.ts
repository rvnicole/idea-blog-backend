import type { Request, Response } from "express";
import User from "../models/User";;
import Followed from "../models/Followed";
import { Op } from "sequelize";

export class UserController {

    // Consultar usuario por ID
    static getUserById = async (req: Request, res: Response ) => {
        try {            
            // Consultar Usuario
            const user = await User.findByPk(req.params.id, {
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
                res.status(409).json({ success: false, message: "El usuario no existe" });
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

    // Registrar que siguen a un usuario
    static registerFollowed = async (req: Request, res: Response) => {
        try {
            if( req.user.dataValues.id == parseInt(req.params.id) ) {
                res.status(409).json({ success: false, message: "No puedes seguir a este Usuario" });
                return;
            }            

            const user = await User.findByPk(req.params.id);
            if( !user ) {
                res.status(409).json({ success: false, message: "Usuario a seguir no encontrado" });
                return;
            }

            if( req.user ) {
                const exist = await Followed.findOne({where: { user: req.user.dataValues.id, followed: req.params.id }});
                if( exist ) {
                    await exist.destroy();
                    res.status(200).json({ success: true, message: `Dejaste de seguir a ${user.dataValues.name}` });
                    return;
                }

                const followed = await Followed.create({
                    user: req.user.dataValues.id,
                    followed: user.dataValues.id
                });

                res.status(200).json({ success: true, message: `Siguiendo a ${user.dataValues.name}` });
            }
            else {
                res.status(409).json({ success: false, message: "Usuario no encontrado" });
            }
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Buscar usuarios
    static searchUsers = async (req: Request, res: Response ) => {
        try {
            const { user } = req.query;

            const users = await User.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${user}%` } },
                        { lastname: { [Op.like]: `%${user}%` } },
                        { email: { [Op.like]: `%${user}%` } }
                    ]
                },
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
            });

            if( !user ) {
                res.status(409).json({ success: false, message: "El usuario no existe" });
                return;
            }

            const data = users.map((user: any) => ({
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
            }));

            res.status(200).json({ success: true, message: "Usuarios encontrados", data });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }
}