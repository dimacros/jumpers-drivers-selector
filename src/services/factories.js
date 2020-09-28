async function createOrder(id, { branch: branchRef, status, time }) {
    const branchDoc = await branchRef.get();
    const branch = branchDoc.data();

    return {
        id,
        branch: {
            name: branch.name,
            online: branch.online,
            location: {
                latitude: branch.lat,
                longitude: branch.long
            }
        },
        status,
        time
    };
}

function createDriver(id, { connection, lat, long, name }) {
    return {
        id,
        connection, 
        currentLocation: {
            latitude: lat,
            longitude: long
        },
        name
    }
}

module.exports = { createOrder, createDriver };
