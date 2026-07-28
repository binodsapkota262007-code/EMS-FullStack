import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const buildStandardMongoUriFromSrv = async (srvUri, dbName) => {
  const uri = new URL(srvUri);
  const host = uri.hostname;
  const username = uri.username;
  const password = uri.password;
  const pathDb = uri.pathname?.replace(/^\//, "");
  const query = uri.searchParams.toString();

  const srvRecords = await dns.promises.resolveSrv(`_mongodb._tcp.${host}`);
  const hosts = srvRecords.map((record) => `${record.name}:${record.port}`).join(",");
  const credentials = username ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : "";
  const resolvedDbName = dbName || pathDb;
  const dbPath = resolvedDbName ? `/${resolvedDbName}` : "";
  const queryString = query ? `?${query}` : "";

  return `mongodb://${credentials}${hosts}${dbPath}${queryString}`;
};

const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI;
  const fallbackUri = process.env.MONGODB_URI_FALLBACK;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!primaryUri) {
    console.error("Database connection failed: MONGODB_URI is not set in environment.");
    process.exit(1);
  }

  const connectWithUri = async (uri) => {
    await mongoose.connect(uri, {
      autoIndex: true,
      dbName,
    });
  };

  try {
    mongoose.connection.on("connected", () => console.log("Database connected"));
    await connectWithUri(primaryUri);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    if (primaryUri.startsWith("mongodb+srv://")) {
      console.error(
        "Atlas SRV lookup failed. Verify your network/DNS, Atlas IP access list, and consider using a standard mongodb:// connection string."
      );
      if (!fallbackUri) {
        console.error(
          "Add MONGODB_URI_FALLBACK in server/.env with a standard mongodb:// URI from Atlas or a local MongoDB server to bypass SRV DNS lookups."
        );
      }
    }

    if (!fallbackUri && primaryUri.startsWith("mongodb+srv://")) {
      try {
        const standardUri = await buildStandardMongoUriFromSrv(primaryUri, dbName);
        console.log("Attempting standard mongodb:// URI generated from SRV records...");
        await connectWithUri(standardUri);
        return;
      } catch (standardError) {
        console.error("Generated standard mongodb:// connection also failed:", standardError.message);
      }
    }

    if (fallbackUri) {
      console.log("Attempting fallback MongoDB URI...");
      try {
        await connectWithUri(fallbackUri);
        return;
      } catch (fallbackError) {
        console.error("Fallback MongoDB connection also failed:", fallbackError.message);
      }
    }

    process.exit(1);
  }
};

export default connectDB;
