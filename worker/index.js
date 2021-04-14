const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000, // try to reconnect to redis server once every 1 sec once lose connection
});
const sub = redisClient.duplicate(); // sub = subscription, is used to watch Redis

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message))); // hset: create a hash table. HSET(KEY_NAME, FIELD, VALUE) // KEY_NAME is similar to object name, FIELD is similar to key. VALUE is similar to value.
});
sub.subscribe('insert'); // anytime someone insert new value into redis, we will get the value & calculate the fib to it
