import type { Request, Response } from "express";
import Comment from "../models/Comment";
import User from "../models/User";

export class CommentController {

    // Crear un comentario
    static createComment = async (req: Request, res: Response) => {
        try {
            const comment = await Comment.create({
                "post": req.body.post,
                "user": req.user.dataValues.id,
                "content": req.body.content,
            });

            res.status(200).json({ success: true, message: "Comentario publicado" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Obtener los comentarios de un Post
    static getAllCommentsByPost = async (req: Request, res: Response) => {
        try {
            const comments = await Comment.findAll({ 
                where: { 
                    post: req.params.id 
                },
                include: [{
                    model: User,
                    as: "userDetails",
                    attributes: ['id', 'name', 'lastname', 'email']
                }]
            });
            res.status(200).json({ success: true, message: "Comentarios encontrados", data: comments });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    static deleteComment = async (req: Request, res: Response) => {
        try {
            const comment = await Comment.findByPk(req.params.id);

            if( !comment ) {
                res.status(200).json({ success: false, errors: "Comentario no encontrado" });
                return;
            }

            await comment.destroy();
            res.status(200).json({ success: true, message: "Comentario eliminado" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }
}