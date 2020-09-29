const Branch = require("./branch");

class Order {
    constructor(
        id,
        { name, online, lat, long },
        status,
        time
    ) {
        this.id = id;
        this.branch = new Branch(name, online, lat, long);
        this.status = status;
        this.time = time;
    }
}

module.exports = Order;
