const firestore = require('../client/firestore');
const mapboxApi = require('../client/mapboxApi');
const Driver = require('../models/driver');
const Order = require('../models/order');

async function getDurationOptimized(source, destination) {
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

/**
 * 
 * @param {Order} order 
 * @param {Driver[]} drivers 
 */
async function processToFindDriver(order, drivers) {

    const tripDurationPromises = [];

    drivers.forEach((driver, i) => {
        tripDurationPromises[i] = getDurationOptimized(order.branch.location, driver.currentLocation);
    });

    const tripDurations = await Promise.all(tripDurationPromises);
    const minTripDuration = Math.min(...tripDurations);
    const index = tripDurations.findIndex(tripDuration => tripDuration === minTripDuration);
    const selectedDriver = drivers.splice(index, 1)[0];

    return selectedDriver.withOrder(order);
}

/**
 * 
 * @param {Order} order
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

module.exports = { processToFindDriver, processToUpdateDriver };
