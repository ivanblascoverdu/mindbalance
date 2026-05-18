// Garantiza que env.ts encuentre variables críticas antes de que cualquier módulo lo importe
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret-mindbalance-only-for-tests";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:0/test";
process.env.NODE_ENV = "test";

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        if (collection) {
            await collection.deleteMany({});
        }
    }
});
