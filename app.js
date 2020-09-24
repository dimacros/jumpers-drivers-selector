const Agenda = require('agenda');
const fs = require('fs');

const { MONGO_URL } = process.env;

const agenda = new Agenda({ 
    db: { address: MONGO_URL }
});

agenda.define('check orders and assign driver', async job => {
    let r = Math.random().toString(36);
    console.log(r);
    await fs.writeFile(`default.txt`, r, 'utf8', e => e && console.log(e));
});

const init = async function () {
    await agenda.start();

    await agenda.every('10 seconds', 'check orders and assign driver');
};

init();
