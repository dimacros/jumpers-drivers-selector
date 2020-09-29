const firestore = require('../client/firestore');
const mapboxApi = require('../client/mapboxApi');

async function getDurationOptimized(source, destination) {
    const sourceCoordinate = `${source.latitude},${source.longitude}`;
    const destinationCoordinate =  `${destination.latitude},${destination.longitude}`;
    const profile = 'driving-traffic';

    const response = await mapboxApi.get(`/optimized-trips/v1/mapbox/${profile}/${sourceCoordinate};${destinationCoordinate}`, {
        params: {
            roundtrip: false,
            source: 'first',
            destination: 'last'
        }
    });

    if (response.data.code === 'OK' && response.data.trips.length) {
        return response.data.trips[0].duration;
    }

    return Infinity;
}

async function processToFindDriver(order, drivers) {

    const tripDurationPromises = [];

    drivers.forEach((driver, i) => {
        tripDurationPromises[i] = getDurationOptimized(order.branch.location, driver.currentLocation);
    });

    const tripDurations = await Promise.all(tripDurationPromises);
    const minTripDuration = Math.min(...tripDurations);
    const index = tripDurations.findIndex(tripDuration => tripDuration === minTripDuration);

    return drivers.splice(index, 1)[0];
}

async function processToAssingOrderToDriver(order, driver) {
    const driverRef = firestore.collection('drivers').doc(driver.id);

    return await driverRef.update({
        order: {
            order_request: firestore.collection('orders').doc(order.id)
        }
    })
}

module.exports = { processToFindDriver, processToAssingOrderToDriver };
