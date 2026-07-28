require("dotenv/config");
const dns = require("dns");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI env variable");
  process.exit(1);
}

const url = new URL(uri);
const host = url.hostname;
const username = url.username;
const password = url.password;
const dbName = url.pathname.replace(/^\//, "");
const query = url.searchParams.toString();

console.log("SRV host:", host);

dns.resolveSrv(`_mongodb._tcp.${host}`, (err, records) => {
  if (err) {
    console.error("ERR", err.message);
    process.exit(1);
  }
  const hosts = records.map(r => `${r.name}:${r.port}`).join(",");
  const credentials = `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`;
  const queryString = query ? `?${query}` : "";
  console.log(`mongodb://${credentials}${hosts}/${dbName}${queryString}`);
});
