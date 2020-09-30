const firestore = require('../client/firestore');
const mapboxApi = require('../client/mapboxApi');
const Driver = require('../models/driver');
const Order = require('../models/order');

/**
 * @param {Driver} driver
 */
async function processToUpdateDriver(driver) {
    const driverRef = firestore.collection('drivers').doc(driver.id);

    return await driverRef.update({
        order: {
            order_request: firestore.collection('orders').doc(driver.order.id)
        }
    })
}

/**
 * 
 * @param {Order[]} orders
 * @param {Driver[]} drivers
 * @param {Driver[]} driversWithOrder
 * 
 * @returns {Promise<Driver[]>}
 */
async function processAlgorithm(orders, drivers, driversWithOrder = [] ) {
    const currentOrder = orders.shift();
    const driverFoundIndex = await processToFindDriverIndex(currentOrder, drivers);

    driversWithOrder.push(
        drivers[driverFoundIndex].withOrder(currentOrder)
    );

    drivers.splice(driverFoundIndex, 1);

    if (orders.length && drivers.length) {
        return process(orders, drivers, driversWithOrder);
    }

    return driversWithOrder;
}

async function processToFindDriverIndex(order, drivers) {
    const travelDurationPromises = [];

    drivers.forEach((driver, i) => {
        travelDurationPromises[i] = getTravelDuration(order.branch.location, driver.currentLocation);
    });

    const travelDurations = await Promise.all(travelDurationPromises);
    const duration = Math.min(...travelDurations);
    const driverIndex = travelDurations.findIndex(travelDuration => travelDuration === duration);

    return driverIndex;
}

async function getTravelDuration(source, destination) {
    const sourceCoordinate = `${source.latitude},${source.longitude}`;
    const destinationCoordinate =  `${destination.latitude},${destination.longitude}`;
    const profile = 'driving-traffic';

    try {
        const res = await mapboxApi.get(`/optimized-trips/v1/mapbox/${profile}/${sourceCoordinate};${destinationCoordinate}`, {
            params: {
                roundtrip: false,
                source: 'first',
                destination: 'last'
            }
        });

        if (res.data.code === 'Ok' && res.data.trips.length) {
            return res.data.trips[0].duration;
        }

        return Infinity;

    } catch (error) {
        if (error.response) {
            console.log(error.response.data);
        }

        return Infinity;
    }
}

module.exports = { processToUpdateDriver, processAlgorithm };
