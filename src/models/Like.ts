import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import User from "./User";
import Post from "./Post";

interface LikeAttributes {
    id: number;
    user: number;
    post: number;
}

class Like extends Model<LikeAttributes> {    
}

Like.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            references: {
                model: User,
                key: 'id'
            }
        },
        post: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Post,
                key: 'id'
            }
        }
    },
    {
        sequelize: db,
        tableName: 'likes',
        timestamps: true
    }
);

export default Like;