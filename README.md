# <img src="/public/logo-ideablog.png" width="28" heigth="28"/> Idea Blog (Backend)

Backend de **Idea Blog**, una aplicación de blog **fullstack** que gestiona la autenticación de usuarios, la creación de publicaciones y el envío de correos.  
Este repositorio expone una **API REST** consumida por el frontend.

🔗 Repositorio frontend: https://github.com/rvnicole/idea-blog-frontend

---

### 🌐 Demo
https://idea-blog-frontend.vercel.app/

---

### ✨ Características
- 🗝️ Autenticación de usuarios con JWT
- 🔒 Registro y login con contraseñas cifradas
- 📝 Gestión de posts y categorías
- 📧 Envío de correos con Nodemailer
- ⚙️ Arquitectura REST

---

### ⚡​Stack tecnológico
- Node.js
- Express
- Sequelize
- Base de Datos de PostgreSQL
- JSON Web Token (JWT)
- bcrypt
- Nodemailer

---

### 🛠️ Arquitectura
- API REST construida con Express
- Autenticación basada en JWT
- Cifrado de contraseñas con bcrypt
- ORM Sequelize para manejo de base de datos de PostgreSQL
- Envío de correos desde el servidor

### 🚀 Instalación
- npm install
- npm run dev

### 🔐 Environment Variables
- URL_DB
- URL_FRONTEND
- JWT_SECRET
- EMAIL_USER
- EMAIL_PASS