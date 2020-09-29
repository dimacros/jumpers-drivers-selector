const actions = require('./src/services/actions');
const business = require('./src/services/business');
const Agenda = require('agenda');

const agenda = new Agenda({ 
    db: { address: process.env.MONGO_URL }
});

agenda.define('check orders and assign driver', async job => {
    const orders = await actions.getOrders();
    const drivers = await actions.getDrivers();
    const driverPromises = [];

    orders.sort((a, b) => b.status > a.status);

    orders.forEach(order => {
        driverPromises.push(
            business.processToFindDriver(order, drivers)
        );
    });

    const selectedDrivers = await Promise.all(driverPromises);

    selectedDrivers.forEach(driver =>  {
        driver && business.processToUpdateDriver(driver).then(res => console.log(res));
    });
});

const init = async function () {
    await agenda.start();
    await agenda.every('60 seconds', 'check orders and assign driver');
};

init();
