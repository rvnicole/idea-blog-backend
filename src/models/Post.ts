import { DataType, DataTypes, Model } from "sequelize";
import db from "../config/db";
import User from "./User";

interface PostAttributes {
    id: number;
    title: string;
    author: number;
    publishedDate: Date;
    category: string;
    excerpt: string;
    content: string;
    views: number;

}

class Post extends Model<PostAttributes> {
}

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        publishedDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            allowNull:false
        },
        excerpt: {
            type: DataTypes.TEXT,
            allowNull:false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull:false,
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull:false,
            defaultValue: 0
        }
    },
    {
        sequelize: db,
        tableName: 'posts',
        timestamps: true
    }
);

export default Post;