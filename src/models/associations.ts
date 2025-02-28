import colors from "colors";
import User from "./User";
import Post from "./Post";
import Followed from "./Followed";
import Like from "./Like";
import Comment from "./Comment";
import Token from "./Token";

export default function setupAssociations() {
    try {
        // USER - POST
        User.hasMany(Post, { foreignKey: "author", sourceKey: "id", as: "posts" });
        Post.belongsTo(User, { foreignKey: "author", targetKey: "id", as: "authorPost", onDelete: "CASCADE"});
 
        // USER - TOKEN
        User.hasOne(Token, { foreignKey: 'user', as: 'token', onDelete: 'CASCADE'});
        Token.belongsTo(User, { foreignKey: 'user', as: 'userToken', onDelete: 'CASCADE'});

        // USER - COMMENT
        User.hasMany(Comment, { foreignKey: "user", sourceKey: "id", as: "userComments" });
        Comment.belongsTo(User, { foreignKey: "user", targetKey: "id", as: "userDetails", onDelete: "CASCADE" });

        // USER - FOLLOWED
        User.hasMany(Followed, { foreignKey: "user", sourceKey: "id", as: "following" });
        User.hasMany(Followed, { foreignKey: "followed", sourceKey: "id", as: "followers" });
        Followed.belongsTo(User , { foreignKey: "user", targetKey: "id", as: "followerUser", onDelete: "CASCADE" });
        Followed.belongsTo(User , { foreignKey: "followed", targetKey: "id", as: "followedUser", onDelete: "CASCADE" });

        // USER - LIKE
        User.hasMany(Like, { foreignKey: "user", sourceKey: "id", as: "userLikes" });
        Like.belongsTo(User , { foreignKey: "user", targetKey: "id", as: "userLikeDetails", onDelete: "CASCADE" });

        // POST - COMMENT
        Post.hasMany(Comment, { foreignKey: "post", sourceKey: "id", as: "postComments"  });
        Comment.belongsTo(Post, { foreignKey: "post", targetKey: "id", as: "postDetails", onDelete: "CASCADE" });

        // POST - LIKE
        Post.hasMany(Like, { foreignKey: "post", sourceKey: "id", as: "postLikes"  });
        Like.belongsTo(Post , { foreignKey: "post", targetKey: "id", as: "postDetails", onDelete: "CASCADE" });
    }
    catch(error){
        console.error(colors.bgRed.bold("Error conectando a la base de datos:"));
        console.error(error);
    }    
};