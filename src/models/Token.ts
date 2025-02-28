import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import User from "./User";

interface TokenAttributes {
    id: number,
    token: string,
    user: number;
    createdAt: Date;
}

class Token extends Model<TokenAttributes> {
    declare id: number;
    declare token: string;
    declare user: number;
    public readonly createdAt!: Date;
}

Token.init({
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE
    }
}, {
    sequelize: db, 
    tableName: 'tokens',
    timestamps: true,
});

export default Token;