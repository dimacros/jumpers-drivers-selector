const firestore = require('../client/firestore');
const Driver = require('../models/driver');
const Order = require("../models/order");

const orderPromise = async (id, { branch: branchRef, status, time }) => {
    const branchDoc = await branchRef.get();

    return new Order(id, branchDoc.data(), status, time);
}

/**
 * @returns {Promise<Order[]>} orders
 */
async function getOrders() {
    const orderPromises = [];

    const snapshot = await firestore.collection('orders')
                                    .where('status', 'in', [3, 4])
                                    .orderBy('time', 'asc')
                                    .get();

    snapshot.forEach(doc => {
        orderPromises.push(orderPromise(doc.id, doc.data()));
    });

    return await Promise.all(orderPromises);
}

/**
 * @returns {Promise<Driver[]>} drivers
 */
async function getDrivers() {
    const drivers = [];
    const snapshot = await firestore.collection('drivers')
                                    .where('connection.online', '==', true)
                                    .get();

    snapshot.forEach(doc => {
        const driverData = doc.data();
        const { connection, lat, long, name } = driverData;

        if (! driverData.hasOwnProperty('order')) {
            drivers.push(
                new Driver(doc.id, connection, lat, long, name) 
            );
        }
    });

    return drivers;
}

module.exports = { getOrders, getDrivers };
