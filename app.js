const actions = require('./src/services/actions');
const business = require('./src/services/business');
const Agenda = require('agenda');

const agenda = new Agenda({ 
    db: { address: process.env.MONGO_URL }
});

agenda.define('check orders and assign driver', async job => {
    const orders = await actions.getOrders();
    const drivers = await actions.getDrivers();

    orders.sort((a, b) => b.status > a.status);

    const driversWithOrder = await business.processAlgorithm(orders, drivers);
    const promisesToUpdateDriver = [];

    driversWithOrder.forEach(driver => {
        promisesToUpdateDriver = business.processToUpdateDriver(driver);
    });

    await Promise.all(promisesToUpdateDriver);
});

const init = async function () {
    await agenda.start();
    await agenda.every('60 seconds', 'check orders and assign driver');
};

init();
