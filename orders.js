// orders.js - CRUD operations for orders in MongoDB
const { client } = require('./mongo');

async function createOrder(orderData) {
    try {
        const database = client.db('bookstore');
        const ordersCollection = database.collection('orders');
        const result = await ordersCollection.insertOne(orderData);
        console.log('Order created successfully:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating order:', error);
    }
}

async function getOrder(orderId) {
    try {
        const database = client.db('bookstore');
        const ordersCollection = database.collection('orders');
        const order = await ordersCollection.findOne({ _id: orderId });
        return order;
    } catch (error) {
        console.error('Error getting order:', error);
    }
}

// Implement updateOrder and deleteOrder functions similarly

module.exports = { createOrder, getOrder, /* updateOrder, deleteOrder */ };
