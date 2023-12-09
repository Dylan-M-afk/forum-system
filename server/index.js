const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId} = require("mongodb");
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

async function connectToMongoDB() {
    try {
        // MongoDB Connection Info
        const mongoURI = process.env.MONGODB_URI;
        const databaseName = process.env.DATABASE_NAME;

        // Create a new MongoClient instance
        const client = new MongoClient(mongoURI);

        // Connect to MongoDB and return the client
        await client.connect();
        console.log("Connected to MongoDB");

        // Use the specified database
        const db = client.db(databaseName);

        // Perform a simple query to trigger the creation of the database
        await db.command({ ping: 1 });

        console.log("Database created or already exists:", databaseName);

        return client;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}


// Function to get the MongoDB collection
const getCollection = async (collectionName, client) => {
    try {
        const databaseName = process.env.DATABASE_NAME;
        const db = client.db(databaseName);
        const collection = db.collection(collectionName);
        return collection;
    } catch (error) {
        console.error("Error getting MongoDB collection:", error);
        throw error;
    }
};



app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

//👇🏻 generates a random string as ID

const generateID = () => Math.random().toString(36).substring(2, 10);

// Function to get user data by ID
const getUserById = async (id) => {
    let client;
    try {
        client = await connectToMongoDB();
        const usersCollection = await getCollection("Users", client);
        const user = await usersCollection.findOne({ id });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await client.close();
    }
};

app.post("/api/login", async (req, res) => {
    let client;
    let usersCollection;
    try {
        // Retrieve user data from MongoDB
        const { email, password } = req.body;
        client = await connectToMongoDB();
        const usersCollection = await getCollection("Users", client);
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.json({
                error_message: "Incorrect credentials",
            });
        }
        console.log("User:", user);
        console.log("Password:", password);
        console.log("email:", email);
        // Compare hashed password with PEPPER
        bcrypt.compare(password + process.env.PEPPER, user.password, (err, match) => {
            if (err || !match) {
                return res.json({
                    error_message: "Incorrect credentials",
                });
            }

            res.json({
                message: "Login successfully",
                id: user.id,
            });
        });
    } catch (error) {
        console.error(error);
        res.json({
            error_message: "An error occurred while fetching user data",
        });
    } finally {
        await client.close();
    }
});


app.post("/api/register", async (req, res) => {
    let client;
    try {
        const { email, password, username } = req.body;
        console.log(req.body);
        client = await connectToMongoDB();
        const usersCollection = await getCollection("Users", client);


        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.json({
                error_message: "User already exists",
            });
        }
        // Create a salt
        const salt = await bcrypt.genSalt(10);
        // Retrieve the pepper value from the environment variable
        const pepper = process.env.PEPPER;
        console.log("Pepper:", pepper);
        // Concatenate the password and pepper
        const pepperedPassword = password + pepper;
        console.log("Peppered Password:", pepperedPassword);
        // Hash the peppered password with the generated salt
        const hashedPassword = await bcrypt.hash(pepperedPassword, salt);
        console.log(hashedPassword);
        // Save user data to MongoDB
        await usersCollection.insertOne({
            id: generateID(),
            email,
            password: hashedPassword,
            salt,
            username,
        });
        console.log("Account created successfully!")
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Username:", username);
        console.log("Salt:", salt);
        res.json({
            message: "Account created successfully!",    
        });
    } catch (error) {
        console.error(error);
        res.json({
            error_message: "An error occurred while registering the user",
        });
    } finally {
        if (client) await client.close();
    }
});

app.post("/api/create/thread", async (req, res) => {
    const { thread, userId } = req.body;
    console.log(req.body);
    const client = await connectToMongoDB();
    const threadsCollection = await getCollection("Posts", client);

    try {
        const result = await threadsCollection.insertOne({
            id: generateID(),
            title: thread,
            userId,
            replies: [],
            likes: [],
        });
        console.log("Thread Creation Result: ",result);
        if (result.acknowledged) {
            res.json({
                message: "Post created successfully!"
            });
        } else {
            res.json({
                error_message: "Post creation failed",
            });
        }        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error_message: "Post creation failed",
            detailed_error: error.message, // Remove this later
        });
    } finally {
        await client.close();
    }
});

app.get("/api/all/threads", async (req, res) => {
    const client = await connectToMongoDB();
    const threadsCollection = await getCollection("Posts", client);

    try {
        const threads = await threadsCollection.find().toArray();
        res.json({
            threads,
        });
    } catch (error) {
        console.error(error);
        res.json({
            error_message: "An error occurred while fetching threads",
        });
    } finally {
        await client.close();
    }
});

app.post("/api/thread/like", async (req, res) => {
    const { threadId, userId } = req.body;
    console.log(req.body);
    const client = await connectToMongoDB();
    
    const threadsCollection = await getCollection("Posts", client);

    try {
        const result = await threadsCollection.findOne({ id: threadId });

        if (result) {
            if (result.likes.includes(userId)) {
                res.json({
                    message: "You've already liked the thread!",
                });
            } else {
                const updatedResult = await threadsCollection.findOneAndUpdate(
                    { id: threadId },
                    { $addToSet: { likes: userId } },
                    { returnDocument: 'after' }
                );

                res.json({
                    message: "You've reacted to the thread!",
                    updatedLikes: updatedResult.likes,
                });
            }
        } else {
            res.json({
                error_message: "Thread not found",
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            error_message: "An error occurred while updating likes",
        });
    } finally {
        await client.close();
    }
});


app.post("/api/thread/replies", async (req, res) => {
    const { id } = req.body;
    const client = await connectToMongoDB();
    const threadsCollection = await getCollection("Posts", client);
  
    try {
      const result = await threadsCollection.findOne({ id });
  
      if (result) {
        const repliesWithNames = await Promise.all(
          result.replies.map(async (reply) => {
            const user = await getUserById(reply.userId);
            return {
              ...reply,
              name: user.username, // Add the username to the reply object
            };
          })
        );
  
        res.json({
          replies: repliesWithNames,
          title: result.title,
        });
      } else {
        res.json({
          error_message: "Thread not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        error_message: "An error occurred while fetching thread details",
      });
    } finally {
      await client.close();
    }
  });
app.post("/api/create/reply", async (req, res) => {
    const { id, userId, reply } = req.body;
    const client = await connectToMongoDB();
    const threadsCollection = await getCollection("Posts", client);

    try {
        const result = await threadsCollection.findOneAndUpdate(
            { id: id},
            { $push: { replies: { userId, text: reply } } },
            { returnDocument: 'after' }
        );
        console.log(result);
        if (result) {
            res.json({
                message: "Response added successfully!",
            });
        } else {
            res.json({
                error_message: "Thread not found",
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            error_message: "An error occurred while adding the response",
        });
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {

    console.log(`Server listening on ${PORT}`);

});