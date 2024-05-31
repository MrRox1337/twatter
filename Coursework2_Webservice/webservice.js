// Aman Mishra
// CST 2120
// 5/3/2024
// Coursework #2
//
// This script contains the webservice front-end which will host the application on an express
// server and act as the API

// Package imports
import express from "express";
import expressSession from "express-session";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import path from "path";

// Database access layer imports
import {
	usersInsert,
	usersFindAll,
	usersFindOne,
	usersUpdate,
	usersDelete,
	postsFindAll,
	postsFindAllBy,
	postsInsert,
	postsUpdate,
	postsDelete,
	followersFindAll,
	followingFindAll,
	followingToggle,
} from "./database.js";

// Create express application and use body-parser
export const app = express();
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static("public"));

app.use(
	expressSession({
		secret: "cst2120 secret",
		cookie: { maxAge: 60000 },
		resave: false,
		saveUninitialized: true,
	})
);

// Login user
async function loginUser(request, response) {
	const { username, password } = request.body;
	try {
		const user = await usersFindOne(username);
		if (user && user.password === password) {
			// Expres session management
			request.session.user = user;
			response.status(200).send("Login successful");
		} else {
			response.status(401).send("Invalid username or password");
		}
	} catch (error) {
		console.error("Error logging in:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Logout user
async function logoutUser(request, response) {
	try {
		// Express session management
		request.session.destroy();
		response.status(200).send("Logout successful");
	} catch (error) {
		console.error("Error logging out:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Read all users
async function getUsers(request, response) {
	try {
		const users = await usersFindAll();
		response.status(200).json(users);
	} catch (error) {
		console.error("Error getting users:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Read one user by username
async function getUserByUsername(request, response) {
	const formUser = request.body;
	try {
		const user = await usersFindOne(formUser.username);
		if (user) {
			response.status(200).json(user);
		} else {
			response.status(404).send("User not found");
		}
	} catch (error) {
		console.error("Error getting user:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Update user by username
async function updateUser(request, response) {
	const formUser = request.body;
	try {
		const result = await usersUpdate(formUser.username, formUser);
		if (result.modifiedCount > 0) {
			response.status(200).send("User updated successfully");
		} else {
			response.status(404).send("User not found");
		}
	} catch (error) {
		console.error("Error updating user:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Delete user by username
async function deleteUser(request, response) {
	const formUser = request.body;
	try {
		const result = await usersDelete(formUser.username);
		if (result.deletedCount > 0) {
			response.status(200).send("User deleted successfully");
		} else {
			response.status(404).send("User not found");
		}
	} catch (error) {
		console.error("Error deleting user:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Create new user
async function registerUser(request, response) {
	const newUser = request.body;
	try {
		await usersInsert(newUser);
		response.status(200).send("User registered successfully");
	} catch (error) {
		console.error("Error registering user:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Gets the follower list of the signed in user
async function getFollowersByUsername(request, response) {
	const username = request.query.username;
	try {
		const followers = await followersFindAll(username);
		response.status(200).json(followers);
	} catch (error) {
		console.error("Error getting followers:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Gets the following list of the signed in user
async function getFollowingByUsername(request, response) {
	const username = request.query.username;
	try {
		const following = await followingFindAll(username);
		response.status(200).json(following);
	} catch (error) {
		console.error("Error getting following:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Handles the following status of the target user by the signed in user. If the person not in the
// user's following list, they will be added, or else they will be removed from the following
async function handleFollow(request, response) {
	const { username, followerUsername } = request.body;
	try {
		const status = await followingToggle(username, followerUsername);
		response.status(200).send(`Follower ${status} successfully`);
	} catch (error) {
		console.error("Error handling follow:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Gets all posts made on the twatter website
async function getPosts(request, response) {
	try {
		const posts = await postsFindAll();
		response.status(200).json(posts);
	} catch (error) {
		console.error("Error getting posts:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Gets all posts made by the signed-in user
async function getPostsByUsername(request, response) {
	const username = request.query.username;
	try {
		const posts = await postsFindAllBy(username);
		response.status(200).json(posts);
	} catch (error) {
		console.error("Error getting posts by username:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Creates a new post
async function createPost(request, response) {
	const newPost = request.body;
	try {
		await postsInsert(newPost);
		response.status(200).send("Post created successfully");
	} catch (error) {
		console.error("Error creating post:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Updates an existing post made by the signed-in user
async function updatePost(request, response) {
	const { postId, updatedPost } = request.body;
	try {
		const result = await postsUpdate(postId, updatedPost);
		if (result.modifiedCount > 0) {
			response.status(200).send("Post updated successfully");
		} else {
			response.status(404).send("Post not found");
		}
	} catch (error) {
		console.error("Error updating post:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Deletes a post made by the signed-in user
async function deletePost(request, response) {
	const { postId } = request.body;
	try {
		const result = await postsDelete(username, postId);
		if (result.deletedCount > 0) {
			response.status(200).send("Post deleted successfully");
		} else {
			response.status(404).send("Post not found");
		}
	} catch (error) {
		console.error("Error deleting post:", error);
		response.status(500).send("Internal Server Error");
	}
}

// Utility/security function to check if a file is an image based on its extension
function isImage(file) {
	const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
	const fileExtension = path.extname(file.name).toLowerCase();

	return allowedExtensions.includes(fileExtension);
}

// Upload an image to the website
async function uploadImage(request, response) {
	// Check if a file has been submitted
	if (!request.files || Object.keys(request.files).length === 0) {
		return response.status(400).send('{"upload": false, "error": "Files missing"}');
	}

	// The name of the input field (i.e. "myFile") is used to retrieve the uploaded file
	let myFile = request.files.myFile;

	// Check if the uploaded file is an image
	if (!isImage(myFile)) {
		return response.status(400).send('{"upload": false, "error": "Only image files are allowed"}');
	}

	// Use the mv() method to place the file in the 'uploads' folder on the server
	myFile.mv("./uploads/" + myFile.name, function (err) {
		if (err) {
			return response
				.status(500)
				.send(
					'{"filename": "' +
						myFile.name +
						'", "upload": false, "error": "' +
						JSON.stringify(err) +
						'"}'
				);
		}

		// Send back confirmation of the upload to the client
		response.status(200).send('{"filename": "' + myFile.name + '", "upload": true}');
	});
}

// REST routes

// Login user
app.post("/M00983641/login", loginUser);

// Logout user
app.post("/M00983641/logout", logoutUser);

// Create user
app.post("/M00983641/register", registerUser);

// Read all users
app.get("/M00983641/users", getUsers);

// Read one by username
app.get("/M00983641/users/search", getUserByUsername);

// Update user
app.post("/M00983641/users/update", updateUser);

// Delete user
app.delete("/M00983641/users/delete", deleteUser);

// Get followers by username
app.get("/M00983641/follow/followers", getFollowersByUsername);

// Get followings by username
app.get("/M00983641/follow/following", getFollowingByUsername);

// Add or remove follower from username
app.post("/M00983641/follow", handleFollow);

// Get all posts
app.get("/M00983641/post", getPosts);

// Get all posts by username
app.get("/M00983641/post/home", getPostsByUsername);

// Create post
app.post("/M00983641/post", createPost);

// Update post
app.put("/M00983641/posts/update", updatePost);

// Delete post
app.delete("/M00983641/posts/delete", deletePost);

// Upload image
app.post("/M00983641/upload", uploadImage);

// Host app on port 8080
app.listen(8080);
console.log(`Express listening on port: 8080`);
