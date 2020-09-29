const actions = require('./src/services/actions');
const business = require('./src/services/business');

const Agenda = require('agenda');

const agenda = new Agenda({ 
    db: { address: process.env.MONGO_URL }
});

agenda.define('check orders and assign driver', async job => {
    const orders = await actions.getOrders();
    const drivers = await actions.getDrivers();
    const readyOrders = orders.filter(order => order.status === 4);
    const acceptedOrders = orders.filter(order => order.status === 3);

    readyOrders.forEach(order => { 
        drivers.length && business.processToFindDriver(order, drivers).then(driver => {
            business.processToAssingOrderToDriver(order, driver);
        })
    });

    acceptedOrders.forEach(order => { 
        drivers.length && business.processToFindDriver(order, drivers).then(driver => {
            business.processToAssingOrderToDriver(order, driver).then(res => console.log(res));
        })
    });
});

const init = async function () {
    await agenda.start();
    await agenda.every('5 seconds', 'check orders and assign driver');
};

init();
 