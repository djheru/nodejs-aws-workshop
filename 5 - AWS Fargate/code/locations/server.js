const app = require('koa')();
const router = require('koa-router')();
const db = require('./db.json');
const axios = require('axios');

// Log requests
app.use(function *(next) {
  const start = new Date;
  yield next;
  const ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

router.get('/api/locations', function *() {
  this.body = db.locations;
});

router.get('/api/locations/:id', function *() {
  const id = parseInt(this.params.id, 10);
  this.body = db.locations.find((location) => location.id === id);
});

router.get('/api/locations/butts', function* () {
  try {
    const res = axios.get('/api/characters');
    this.body = (res && res.data) ? res.data : { ohai: 'lolwut' };
  } catch (e) {
    this.body = { ohai: e.message };
  }
});

router.get('/api/', function *() {
  this.body = 'API ready to receive requests';
});

router.get('/', function *() {
  this.body = 'Ready to receive requests';
});

app.use(router.routes());
app.use(router.allowedMethods());

var server = app.listen(80);

process.on('SIGTERM', function() {
  console.log('Shutting down...');
  server.close();
});
