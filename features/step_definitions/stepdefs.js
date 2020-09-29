const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');
const { processToFindDriver } = require('../../src/services/business');
const Driver = require('../../src/models/driver');
const Order = require('../../src/models/order');

Given('the available orders:', function (dataTable) {

  this.orders = dataTable.rows().map((row, i) => {
    [number, name, status, lat, long] = row;

    return new Order(i, { name, online: true, lat, long }, status);
  });

});

Given('the available drivers:', function (dataTable) {

  this.drivers = dataTable.rows().map((row, i) => {
    [name, _, lat, long] = row;

    return new Driver(i, true, lat, long, name);
  });

});

When('the job scheduler runs', async function () {

  const driverPromises = [];

  this.orders.forEach(order => {
    driverPromises.push(processToFindDriver(order, this.drivers));
  });

  this.selectedDrivers = await Promise.all(driverPromises);
});

Then('the job scheduler should choose the drivers:', function (dataTable) {

  console.log(this.selectedDrivers);
  dataTable.rows().forEach((row, i) => {
    [name, _, lat, long] = row;

    assert.strictEqual(name, this.selectedDrivers[i].name);
  });
});
