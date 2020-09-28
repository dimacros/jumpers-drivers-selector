const firestore = require('../client/firestore');
const { createOrder, createDriver } = require('./factories');

async function getOrders() {
    const orderPromises = [];
    const snapshot = await firestore.collection('orders')
                                    .where('status', 'in', [3, 4])
                                    .orderBy('time', 'asc')
                                    .get();

    snapshot.forEach(doc => {
        orderPromises.push(createOrder(doc.id, doc.data()));
    });

    return await Promise.all(orderPromises);
}

async function getDrivers() {
    const drivers = [];
    const snapshot = await firestore.collection('drivers')
                                    .where('connection.online', '==', true)
                                    .get();

    snapshot.forEach(doc => {
        const driverData = doc.data();

        if (! driverData.hasOwnProperty('order')) {
            drivers.push(createDriver(doc.id, driverData));
        }
    });

    return drivers;
}

module.exports = { getOrders, getDrivers };
