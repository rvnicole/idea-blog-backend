import type { Request, Response } from "express";
import Post from "../models/Post";
import User from "../models/User";
import Like from "../models/Like";
import Comment from "../models/Comment";
import { checkPassword } from "../utils/auth";
import { Op } from "sequelize";
import Followed from './../models/Followed';

export class PostController {

    // Crear un Post
    static createPost = async (req: Request, res: Response ) => {
        try {
            const fecha = new Date(req.body.publishedDate);
            
            const post = await Post.create({
                "title": req.body.title,
                "author": req.user.dataValues.id,
                "publishedDate": fecha,
                "category": req.body.category,
                "excerpt": req.body.excerpt,
                "content": req.body.content
            });

            res.status(200).json({ success: true, message: "Publicación realizada" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Obtener Mis Posts
    static getMyPosts = async (req: Request, res: Response) => {
        try {
            const posts = await Post.findAll({ 
                where: { 
                    author: req.user.dataValues.id 
                },
                include: [
                    {
                        model: User, 
                        as: 'authorPost',
                        attributes: ['id', 'name', 'lastname', 'email'],
                    },                    
                    {
                        model: Like,
                        as: 'postLikes',
                        include: [{
                            model: User,
                            as: 'userLikeDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },                    
                    {
                        model: Comment,
                        as: 'postComments',
                        include: [{
                            model: User,
                            as: 'userDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },
                ],
                order: [['createdAt', 'DESC']]
            });

            if( !posts ) {
                res.status(200).json({ success: false, errors: "Posts no encontrados" });
                return;
            }

            const data = posts.map((post: any) => ({
                id: post.dataValues.id,
                title: post.dataValues.title,
                author: post.dataValues.authorPost,
                publishedDate: post.dataValues.publishedDate,
                category: post.dataValues.category,
                excerpt: post.dataValues.excerpt,
                content: post.dataValues.content,
                views: post.dataValues.views,
                likes: post.dataValues.postLikes.map((like: any) => ({
                    id: like.dataValues.id,
                    user: like.userLikeDetails,
                })),
                comments: post.dataValues.postComments.map((comment: any) => ({
                    id: comment.dataValues.id,
                    content: comment.dataValues.content,
                    user: comment.userDetails,
                }))
            }));
            
            res.status(200).json({ success: true, message: "Posts encontrados", data });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Obtener Post por ID
    static getPostByID = async (req: Request, res: Response) => {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User, 
                        as: 'authorPost',
                        attributes: ['id', 'name', 'lastname', 'email'],
                    },                    
                    {
                        model: Like,
                        as: 'postLikes',
                        include: [{
                            model: User,
                            as: 'userLikeDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },                    
                    {
                        model: Comment,
                        as: 'postComments',
                        include: [{
                            model: User,
                            as: 'userDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },
                ]
            }) as any;

            if( !post ) {
                res.status(200).json({ success: false, errors: "Post no encontrado" });
                return;
            }

            const data = {
                id: post.dataValues.id,
                title: post.dataValues.title,
                author: post.dataValues.authorPost,
                publishedDate: post.dataValues.publishedDate,
                category: post.dataValues.category,
                excerpt: post.dataValues.excerpt,
                content: post.dataValues.content,
                views: post.dataValues.views,
                likes: post.dataValues.postLikes.map((like: any) => ({
                    id: like.dataValues.id,
                    user: like.userLikeDetails,
                })),
                comments: post.dataValues.postComments.map((comment: any) => ({
                    id: comment.dataValues.id,
                    content: comment.dataValues.content,
                    user: comment.userDetails,
                })),
            }
            
            res.status(200).json({ success: true, message: "Post encontrado", data });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Obtener Todos los Post de un Author
    static getAllPostsByAuthor = async (req: Request, res: Response) => {
        try {
            const posts = await Post.findAll({ 
                where: { 
                    author: req.params.id 
                },
                include: [
                    {
                        model: User, 
                        as: 'authorPost',
                        attributes: ['id', 'name', 'lastname', 'email'],
                    },                    
                    {
                        model: Like,
                        as: 'postLikes',
                        include: [{
                            model: User,
                            as: 'userLikeDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },                    
                    {
                        model: Comment,
                        as: 'postComments',
                        include: [{
                            model: User,
                            as: 'userDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const data = posts.map((post: any) => ({
                id: post.dataValues.id,
                title: post.dataValues.title,
                author: post.dataValues.authorPost,
                publishedDate: post.dataValues.publishedDate,
                category: post.dataValues.category,
                excerpt: post.dataValues.excerpt,
                content: post.dataValues.content,
                views: post.dataValues.views,
                likes: post.dataValues.postLikes.map((like: any) => ({
                    id: like.dataValues.id,
                    user: like.userLikeDetails,
                })),
                comments: post.dataValues.postComments.map((comment: any) => ({
                    id: comment.dataValues.id,
                    content: comment.dataValues.content,
                    user: comment.userDetails,
                }))
            }));
            
            res.status(200).json({ success: true, message: "Posts encontrados", data });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Editar el Post
    static editPost = async (req: Request, res: Response) => {
        try {
            const fecha = new Date(req.body.publishedDate);
            const post = await Post.findByPk(req.params.id);
            
            if( !post ) {
                res.status(200).json({ success: false, errors: "Post no encontrado" });
                return;
            }

            await post.update({
                "title": req.body.title,
                "category": req.body.category,
                "excerpt": req.body.excerpt,
                "content": req.body.content
            });

            res.status(200).json({ success: true, message: "Posts actualizado" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Eliminar el Post
    static deletePost = async (req: Request, res: Response) => {
        try {
            const user = await User.findByPk(req.user.dataValues.id);
            if( !user ) {
                res.status(200).json({ success: false, errors: "Usuario no encontrado" });
                return;
            }
            
            const confirmada = await checkPassword(req.body.password, user.dataValues.password);
            if( !confirmada ) {
                res.status(200).json({ success: false, errors: "Contraseña incorrecta" });
                return;
            }

            const post = await Post.findByPk(req.params.id);
            if( !post ) {
                res.status(200).json({ success: false, errors: "Post no encontrado" });
                return;
            }

            await Comment.destroy({ where: { post: post.dataValues.id } });
            await Like.destroy({ where: { post: post.dataValues.id } });

            await post.destroy();
            res.status(200).json({ success: true, message: "Posts eliminado" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

     // Like al Post
    static registerLike = async (req: Request, res: Response) => {
        try {
            const post = await Post.findByPk(req.params.id);
            if( !post ) {
                res.status(200).json({ success: false, errors: "Post no encontrado" });
                return;
            }

            const exist = await Like.findOne({ 
                where: { 
                    [Op.and]: [
                        { user: req.user.dataValues.id },
                        { post: post.dataValues.id }
                    ]
                } 
            });
            if( exist ) {
                await exist.destroy();
                res.status(200).json({ success: true, message: "Like eliminado" });
                return;
            }

            const like = await Like.create({
                user: req.user.dataValues.id,
                post: post.dataValues.id
            });

            res.status(200).json({ success: true, message: "Like registrado" });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Registrar una Vista
    static registerView = async (req: Request, res: Response) => {
        try {
            const post = await Post.findByPk(req.params.id);
            if( !post ) {
                res.status(200).json({ success: false, errors: "Post no encontrado" });
                return;
            }
            
            await post.update({ "views": post.dataValues.views + 1 });

            res.status(200).json({ success: true, message: "Vista registrado" });
        }
        catch(error) {
            console.log(error);
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Buscar Posts
    static searchPosts= async (req: Request, res: Response) => {
        try {
            const { author, category, title } = req.query;
            const filters: any = {};

            if (category) {
                filters.category = category; // Comparación exacta
            }
            if (title) {
                filters.title = { [Op.like]: `%${title}%` }; // Búsqueda insensible a mayúsculas
            }

            const posts = await Post.findAll({
                where: filters,
                include: [
                    {
                        model: User, 
                        as: 'authorPost',
                        attributes: ['id', 'name', 'lastname', 'email'],
                        where: author ? {
                            [Op.or]: [
                                { name: { [Op.like]: `%${author}%` } },
                                { lastname: { [Op.like]: `%${author}%` } },
                                { email: { [Op.like]: `%${author}%` } }
                            ]
                        } : undefined
                    },                    
                    {
                        model: Like,
                        as: 'postLikes',
                        include: [{
                            model: User,
                            as: 'userLikeDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },                    
                    {
                        model: Comment,
                        as: 'postComments',
                        include: [{
                            model: User,
                            as: 'userDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const data = posts.map((post: any) => ({
                id: post.dataValues.id,
                title: post.dataValues.title,
                author: post.dataValues.authorPost,
                publishedDate: post.dataValues.publishedDate,
                category: post.dataValues.category,
                excerpt: post.dataValues.excerpt,
                content: post.dataValues.content,
                views: post.dataValues.views,
                likes: post.dataValues.postLikes.map((like: any) => ({
                    id: like.dataValues.id,
                    user: like.userLikeDetails,
                })),
                comments: post.dataValues.postComments.map((comment: any) => ({
                    id: comment.dataValues.id,
                    content: comment.dataValues.content,
                    user: comment.userDetails,
                }))
            }));

            res.status(200).json({ success: true,  message: "Posts encontrados", data });
        }
        catch(error) {
            res.status(400).json({ success: false, errors: error });
        }
    }

    // Obtener el Feed
    static getFeed = async (req: Request, res: Response) => {
        try {      
            const followedUsers = await Followed.findAll({
                where: { user: req.user.dataValues.id },
                attributes: ["followed"]
            });
          
            if (!followedUsers.length) {
                res.status(200).json({ success: false, errors: "Aún no sigues a nadie" });
                return;
            }

            const followedIds = followedUsers.map(follow => follow.dataValues.followed);
            
            const posts = await Post.findAll({
                where: { 
                    author: [...followedIds, req.user.dataValues.id] 
                },
                include: [
                    {
                        model: User, 
                        as: 'authorPost',
                        attributes: ['id', 'name', 'lastname', 'email'],
                    },                    
                    {
                        model: Like,
                        as: 'postLikes',
                        include: [{
                            model: User,
                            as: 'userLikeDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },                    
                    {
                        model: Comment,
                        as: 'postComments',
                        include: [{
                            model: User,
                            as: 'userDetails',
                            attributes: ['id', 'name', 'lastname', 'email'],
                        }],
                    },
                ],
                order: [["createdAt", "DESC"]]
            });
            
            if( !posts ) {
                res.status(200).json({ success: false, errors: "Posts no encontrados" });
                return;
            }

            const data = posts.map((post: any) => ({
                id: post.dataValues.id,
                title: post.dataValues.title,
                author: post.dataValues.authorPost,
                publishedDate: post.dataValues.publishedDate,
                category: post.dataValues.category,
                excerpt: post.dataValues.excerpt,
                content: post.dataValues.content,
                views: post.dataValues.views,
                likes: post.dataValues.postLikes.map((like: any) => ({
                    id: like.dataValues.id,
                    user: like.userLikeDetails,
                })),
                comments: post.dataValues.postComments.map((comment: any) => ({
                    id: comment.dataValues.id,
                    content: comment.dataValues.content,
                    user: comment.userDetails,
                }))
            }));
            
            res.status(200).json({ success: true, message: "Posts encontrados", data });
        } 
        catch (error) {
            console.log(error);
          res.status(500).json({ success: false, errors: error });
        }
    };
}