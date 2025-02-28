import nodemailer from "nodemailer";
import colors from "colors";

const transporte = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendMailConfirmAccount = async (to: string, token: string) => {
    try {
      const info = await transporte.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Confirma tu cuenta de Idea Blog",
        html: `
            <div style="text-align: center; font-family: Arial, Helvetica, sans-serif;">
                <h1 style="font-size: larger; color:#818cf8;">¡Bienvenido a Idea Blog!🎉</h1>
                <p style="color:#1e293b; font-weight: 600;">💡Confirma tu cuenta con el siguiente token✨</p>
                <p style="font-size: larger; font-weight: 900; color:#1e293b;">${token}</p>
                <p style="font-size: small; color:#1e293b; font-weight: 600;">Este token estara activo por solo 10 minutos⏳</p>
            </div>
        ` 
      });
  
      console.log(colors.green.bold("Correo enviado"));
      return info;
    } 
    catch (error) {
      console.error(colors.red.bold("Error al enviar el correo:"));
      console.log(error);
      throw error;
    }
  };

  export const sendMailRestorePassword = async (to: string, token: string) => {
    try {
      const info = await transporte.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Restablece la constraseña de Idea Blog",
        html: `
          <div style="text-align: center; font-family: Arial, Helvetica, sans-serif;">
            <h1 style="font-size: larger; color:#818cf8;">💡Idea Blog</h1>
            <p style="color:#1e293b; font-weight: 600;">Restablece tu contraseña con el siguiente token✨</p>
            <p style="font-size: larger; font-weight: 900; color:#1e293b;">${token}</p>
            <p style="font-size: small; color:#1e293b; font-weight: 600;">Este token estara activo por solo 10 minutos⏳</p>
          </div>
        ` 
      });
  
      console.log(colors.green.bold("Correo enviado"));
      return info;
    } 
    catch (error) {
      console.error(colors.red.bold("Error al enviar el correo:"));
      console.log(error);
      throw error;
    }
  };