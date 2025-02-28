import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const postRouter = Router();

postRouter.get("/get-feed",
    authenticate,
    handleInputErrors,
    PostController.getFeed
);

postRouter.get("/search",
    authenticate,
    handleInputErrors,
    PostController.searchPosts
);

postRouter.post("/create-post",
    authenticate,
    body("title")
        .notEmpty().withMessage("El titulo no puede ir vacio"),
    body("publishedDate")
        .notEmpty().withMessage('La fecha no es válida'),
    body("category")
        .notEmpty().withMessage("La categoria no puede ir vacia"),
    body("excerpt")
        .isLength({ min: 150, max: 300 }).withMessage("El resumen no tiene la longitud necesaria"),
    body("content")
        .isLength({ min: 150 }).withMessage("El contenido no tiene la longitud necesaria"),
    handleInputErrors,
    PostController.createPost
);

postRouter.get("/",
    authenticate,
    handleInputErrors,
    PostController.getMyPosts
);

postRouter.get("/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del post es invalido"),
    handleInputErrors,
    PostController.getPostByID
);

postRouter.get("/get-posts-author/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del autor es invalido"),
    handleInputErrors,
    PostController.getAllPostsByAuthor
);

postRouter.put("/edit-post/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del post es invalido"),
    body("title")
        .notEmpty().withMessage("El titulo no puede ir vacio"),
    body("category")
        .notEmpty().withMessage("La categoria no puede ir vacia"),
    body("excerpt")
        .isLength({ min: 150, max: 300 }).withMessage("El resumen no tiene la longitud necesaria"),
    body("content")
        .isLength({ min: 150 }).withMessage("El contenido no tiene la longitud necesaria"),
    handleInputErrors,
    PostController.editPost
);

postRouter.post("/delete-post/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del post es invalido"),
    body("password")
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    PostController.deletePost
);

postRouter.post("/like-post/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del post es invalido"),
    handleInputErrors,
    PostController.registerLike
);

postRouter.put("/views-post/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del post es invalido"),
    handleInputErrors,
    PostController.registerView
);

export default postRouter;