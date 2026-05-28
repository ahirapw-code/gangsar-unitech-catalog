// Script to clean test products
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'gangsar_unitech';

async function cleanTestProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(dbName);
    
    // Remove test products with invalid SKUs
    const result = await db.collection('products').deleteMany({
      $or: [
        { sku: '162562' },
        { sku: '17163627' },
        { name: 'lalala' },
        { name: 'XXXJEDHDKSK' }
      ]
    });
    
    console.log(`Removed ${result.deletedCount} test products`);
    
    const count = await db.collection('products').countDocuments();
    console.log(`Products remaining: ${count}`);
    
  } finally {
    await client.close();
  }
}

cleanTestProducts();
