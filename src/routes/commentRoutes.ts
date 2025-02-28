import { Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { handleInputErrors } from "../middleware/validation";
import { body, param } from "express-validator";
import { authenticate } from "../middleware/auth";

const commentRouter = Router();

commentRouter.post("/create-comment",
    authenticate,
    body("post")
        .isInt().withMessage("El id del post es invalido"),
    body("content")
        .notEmpty().withMessage("El comentario no puede ir vacio"),
    handleInputErrors,
    CommentController.createComment
);

commentRouter.get("/post/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del post es invalido"),
    handleInputErrors,
    CommentController.getAllCommentsByPost
);

commentRouter.delete("/delete-comment/:id",
    authenticate,
    param("id")
        .isInt().withMessage("El id del comentario es invalido"),
    handleInputErrors,
    CommentController.deleteComment
);

export default commentRouter;