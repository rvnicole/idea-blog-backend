import { DataTypes, Model } from "sequelize";
import db from "../config/db";
import User from "./User";

interface FollowedAttributes {
    id: number;
    user: number;
    followed: number;
}

class Followed extends Model<FollowedAttributes> {    
}

Followed.init(
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
        followed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        }
    },
    {
        sequelize: db,
        tableName: 'followed',
        timestamps: true
    }
);

export default Followed;