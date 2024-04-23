// mongo.js - MongoDB connection setup
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // MongoDB connection URI
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function closeMongoDBConnection() {
    try {
        await client.close();
        console.log('Closed MongoDB connection');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

module.exports = { client, connectToMongoDB, closeMongoDBConnection };
