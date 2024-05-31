// Aman Mishra
// CST 2120
// MISIS: M00983641
// Coursework #2
//
// This script contains the mongodb connection and users, posts, and followings collection interactions

// ------------Connection details start------------
import { MongoClient, ServerApiVersion } from "mongodb";

const password = "ENTER YOUR PASSWORD HERE";
const userName = "ENTER YOUR USERNAME";
const server = "ENTER YOUR SERVER NAME FROM CONNECTION STRING FROM MONGODB";

const encodedUsername = encodeURIComponent(userName);
const encodedPassword = encodeURIComponent(password);

const connectionURI = `mongodb+srv://${encodedUsername}:${encodedPassword}@${server}/?retryWrites=true&w=majority`;

const client = new MongoClient(connectionURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    },
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

connectToDatabase();

const database = client.db("CST2120");
const usersCollection = database.collection("users");
const postsCollection = database.collection("posts");
const followingCollection = database.collection("following");

// ------------Connection details end------------

// ------------User database access layer start------------
// Inserts a new user document.
async function insertUser(newUser) {
    try {
        const result = await usersCollection.insertOne(newUser);
        if (result.acknowledged) return 1;
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
}

// Gets all user documents.
async function getAllUser() {
    try {
        return await usersCollection.find({}).toArray();
    } catch (error) {
        console.error("Error getting all users:", error);
        throw error;
    }
}

// Gets one user document by username.
async function getOneUser(targetUsername) {
    try {
        return await usersCollection.findOne({ username: targetUsername });
    } catch (error) {
        console.error("Error getting one user:", error);
        throw error;
    }
}

// Updates one user document by username.
async function updateUser(targetUsername, updatedUser) {
    try {
        const result = await usersCollection.updateOne(
            { username: targetUsername },
            { $set: updatedUser }
        );
        return result;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}

// Deletes one user document by username.
async function deleteUser(targetUsername) {
    try {
        const result = await usersCollection.deleteOne({ username: targetUsername });
        return result;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}
// ------------User database access layer ends------------

// ------------Post database access layer start------------
// Inserts a new post document.
async function insertPost(newPost) {
    try {
        await postsCollection.insertOne(newPost);
    } catch (error) {
        console.error("Error inserting post:", error);
        throw error;
    }
}

// Gets all post documents.
async function getAllPost() {
    try {
        return await postsCollection.find({}).toArray();
    } catch (error) {
        console.error("Error getting all posts:", error);
        throw error;
    }
}

// Gets all post documents by username.
async function getAllPostBy(username) {
    try {
        return await postsCollection.find({ username: username }).toArray();
    } catch (error) {
        console.error("Error getting all posts by username:", error);
        throw error;
    }
}

// Updates one post document.
async function updatePost(postId, updatedPost) {
    try {
        const result = await postsCollection.updateOne({ _id: postId }, { $set: updatedPost });
        return result;
    } catch (error) {
        console.error("Error updating post:", error);
        throw error;
    }
}

// Deletes one post document by post ID.
async function deletePost(postId) {
    try {
        const result = await postsCollection.deleteOne({ _id: postId });
        return result;
    } catch (error) {
        console.error("Error deleting post:", error);
        throw error;
    }
}
// ------------Post database access layer ends------------

// ------------Following database access layer start------------
// Adds or removes a follower from a user's followers list.
async function addOrRemoveFollower(username, followerUsername) {
    try {
        const user = await followingCollection.findOne({ username: username });
        if (user) {
            if (user.followers.includes(followerUsername)) {
                // Remove followerUsername from followers list
                await followingCollection.updateOne(
                    { username: username },
                    { $pull: { followers: followerUsername } }
                );
                return "Removed";
            } else {
                // Add followerUsername to followers list
                await followingCollection.updateOne(
                    { username: username },
                    { $push: { followers: followerUsername } }
                );
                return "Added";
            }
        } else {
            throw new Error("User not found in following collection");
        }
    } catch (error) {
        console.error("Error adding/removing follower:", error);
        throw error;
    }
}

// Gets all followers of a user.
async function getAllFollowers(username) {
    try {
        const user = await followingCollection.findOne({ username: username });
        if (user) {
            return user.followers;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting followers:", error);
        throw error;
    }
}

// Gets all users followed by a user.
async function getAllFollowing(username) {
    try {
        return await followingCollection.distinct("username", { followers: username });
    } catch (error) {
        console.error("Error getting following:", error);
        throw error;
    }
}
// ------------Following database access layer ends------------

// ------------Module exports start------------
export const userdb = usersCollection;
export const postdb = postsCollection;
export const followdb = followingCollection;

export const usersInsert = insertUser;
export const usersFindAll = getAllUser;
export const usersFindOne = getOneUser;
export const usersUpdate = updateUser;
export const usersDelete = deleteUser;

export const postsFindAll = getAllPost;
export const postsFindAllBy = getAllPostBy;
export const postsInsert = insertPost;
export const postsUpdate = updatePost;
export const postsDelete = deletePost;

export const followersFindAll = getAllFollowers;
export const followingFindAll = getAllFollowing;
export const followingToggle = addOrRemoveFollower;

// ------------Module exports ends------------
