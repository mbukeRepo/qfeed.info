const mongoose = require("mongoose");
const redis = require('redis');
const util = require('util');
const client = redis.createClient("redis://127.0.0.1:6379");


client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options){
    this.useCache = true;
     this.hashKey = options.key;
    return this;
}

mongoose.Query.prototype.exec = async function() {
    if (!this.useCache) return exec.apply(this, arguments);
	const key = JSON.stringify(this.getQuery())
	// see if we have a value for key in redis
	const cacheValue = await client.hget(this.hashKey, key)
	// if we do, return that
	if (cacheValue){
		console.log("SERVED FROM REDIS");
		const doc = JSON.parse(cacheValue);
		return Array.isArray(doc) ?
			doc.map(d => new this.model(d))
			:
			new this.model(doc)
		 ;
	}
	// otherwise, issue the query to mongoose and store the results
	const result = await  exec.apply(this, arguments);
	client.hset(this.hashKey, key, JSON.stringify(result))
	return result;

}
module.exports = client;
