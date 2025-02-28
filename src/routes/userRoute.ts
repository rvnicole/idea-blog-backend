import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { UserController } from "../controllers/UserController";
import { authenticate } from "../middleware/auth";

const userRouter = Router();

userRouter.get("/search",
    authenticate,
    handleInputErrors,
    UserController.searchUsers
);

userRouter.get("/get-user/:id",
    param("id")
        .isInt().withMessage("El id del usuario es invalido"),
    handleInputErrors,
    UserController.getUserById
);

userRouter.post("/followed/:id",
    authenticate,
    handleInputErrors,
    UserController.registerFollowed
);

export default userRouter;