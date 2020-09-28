const actions = require('./src/services/actions');
const Agenda = require('agenda');
const fs = require('fs');
/*
const agenda = new Agenda({ 
    db: { address: process.env.MONGO_URL }
});

agenda.define('check orders and assign driver', async job => {
    let r = Math.random().toString(36);
    console.log(r);
    await fs.writeFile(`storage/txt/${r}.txt`, r, 'utf8', e => e && console.log(e));
});

const init = async function () {
    await agenda.start();

    await agenda.every('60 seconds', 'check orders and assign driver');

    actions.getOrders().then((snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
};

const turf = require('turf');

var from = turf.point([-75.343, 39.984]);
var to = turf.point([-75.534, 39.123]);

var distance = turf.distance(from, to);

init();
*/





actions.getOrders().then(orders => {
  fs.writeFileSync('firestore.json', JSON.stringify(orders));
});