import { DataTypes, Model } from "sequelize";
import db from "../config/db";

interface UserAttributes {
    id: number;
    name: string;
    lastname: string;
    email: string;
    password: string;
    description: string;
    confirmada: boolean;
}

class User extends Model<UserAttributes> {
    declare id: number;
    declare name: string;
    declare lastname: string;
    declare email: string;
    declare password: string;
    declare description: string;
    declare confirmada: boolean;
}

User.init(
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        confirmada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    },
    {
        sequelize: db, // La instancia de Sequelize
        tableName: 'users', // Nombre de la tabla en la base de datos
        timestamps: true, // Sequelize manejará automáticamente createdAt y updatedAt
        indexes: [
            {
                unique: true,
                fields: ['email'], // Crea un índice único explícitamente
            },
        ],
    }
);

export default User;