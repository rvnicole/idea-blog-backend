import bcrypt from "bcrypt";

// Encriptación de la contraseña
export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);    
}

// Comparación de la contraseña con la constraseña encriptada
export const checkPassword = async (password: string, hashPassword: string) => {
    return await bcrypt.compare(password, hashPassword);
}