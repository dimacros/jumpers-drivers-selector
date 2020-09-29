const Order = require("./order");

class Driver {
    constructor(
        id,
        connection, 
        latitude,
        longitude,
        name
    ) {
        this.id = id;
        this.connection = connection; 
        this.currentLocation = { latitude, longitude };
        this.name = name;
    }

    /**
     * 
     * @param {Order} order 
     */
    withOrder (order) {
        this.order = order;

        return this;
    }
}

module.exports = Driver;
