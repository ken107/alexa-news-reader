const axios = require("axios");
const ms = require("ms");
const { Fetch } = require("multilayer-async-cache-builder");
const { MemCache } = require("simple-cache");

const getSource = new Fetch(loadSource).cache(new MemCache(ms("1h"), ms("1h"))).dedupe();

async function loadSource(sourceIndex) {
  const res = await axios({
    method: "POST",
    url: config.serviceUrl,
    data: {
      method: "getSource",
      sourceIndex
    }
  })
  return res.data;
}

exports.getSource = getSource;
