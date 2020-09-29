class Branch {
    constructor(
        name,
        online,
        latitude,
        longitude
    ) {
        this.name = name;
        this.online = online,
        this.location = { latitude, longitude };
    }
}

module.exports = Branch;
