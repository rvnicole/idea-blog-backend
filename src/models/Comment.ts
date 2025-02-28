import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import Post from "./Post";
import User from "./User";

interface CommentAttributes {
    id: number;
    post: number;
    user: number;
    content: string;
}

class Comment extends Model<CommentAttributes> {    
}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        post: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Post,
                key: 'id'
            }
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize: db,
        tableName: 'comments',
        timestamps: true
    }
);

export default Comment;