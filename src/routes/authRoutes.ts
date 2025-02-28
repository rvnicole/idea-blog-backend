import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/create-account",
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("lastname")
        .notEmpty().withMessage("El apellido no puede ir vacio"),
    body("email")
        .isEmail().withMessage('E-mail no válido'),
    body("password")
        .isLength({min: 8}).withMessage('El password debe tener como minimo 8 caracteres'),
    body('confirm_password')
        .custom((value, {req}) => { 
            if(value !== req.body.password) {
                throw new Error("Las contraseñas no son iguales");
            }

            return true;
        }),
    body("description")
        .notEmpty().withMessage("La descripción no puede ir vacia"),
    handleInputErrors,
    AuthController.createAccount
);

authRouter.put("/confirm-account",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacio"),
    body("id")
        .isInt().withMessage("El id del usuario es invalido"),
    handleInputErrors,
    AuthController.confirmAccount
);

authRouter.post("/new-token",
    body("id")
        .isInt().withMessage("El id del usuario es invalido"),
    handleInputErrors,
    AuthController.generateNewToken
);

authRouter.post("/send-token",
    body("email")
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.generateTokenRestorePassword
);

authRouter.put("/validate-token",
    body("token")
        .notEmpty().withMessage("El token no puede ir vacio"),
    body("email")
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    AuthController.validateToken
);

authRouter.put("/edit-password",
    body("email")
        .isEmail().withMessage('E-mail no válido'),
    body("password")
        .isLength({min: 8}).withMessage('El password debe tener como minimo 8 caracteres'),
    body('confirm_password')
        .custom((value, {req}) => { 
            if(value !== req.body.password) {
                throw new Error("Las contraseñas no son iguales");
            }

            return true;
        }),
    handleInputErrors,
    AuthController.editPassword
);

authRouter.post('/login', 
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.login
);

authRouter.get('/user',
    authenticate,
    handleInputErrors,
    AuthController.user
);

authRouter.put("/edit-account",
    authenticate,
    body("name")
        .notEmpty().withMessage("El nombre no puede ir vacio"),
    body("lastname")
        .notEmpty().withMessage("El apellido no puede ir vacio"),
    body("description")
        .notEmpty().withMessage("La descripción no puede ir vacia"),
    handleInputErrors,
    AuthController.editAccount
);

export default authRouter;