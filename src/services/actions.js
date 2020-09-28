const firestore = require('../client/firestore');
const { createOrder, createDriver } = require('./factories');

async function getOrders() {
    const orderPromises = [];
    const snapshot = await firestore.collection('orders').get();

    snapshot.forEach(doc => {
        orderPromises.push(createOrder(doc.id, doc.data()));
    });

    return await Promise.all(orderPromises);
}

function getDrivers() {
    const drivers = [];
    const snapshot = await firestore.collection('drivers').get();

    snapshot.forEach(doc => {
        drivers.push(createDriver(doc.id, doc.data()));
    });

    return drivers;
}

module.exports = { getOrders, getDrivers };
