// Script to remove duplicate products
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'gangsar_unitech';

async function removeDuplicateProducts() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const products = await db.collection('products').find({}).toArray();
    
    console.log(`Found ${products.length} products`);
    
    // Group by SKU to find duplicates
    const seen = new Map();
    const duplicates = [];
    
    for (const product of products) {
      if (seen.has(product.sku)) {
        duplicates.push(product._id);
        console.log(`Duplicate found: ${product.name} (SKU: ${product.sku})`);
      } else {
        seen.set(product.sku, product);
      }
    }
    
    if (duplicates.length > 0) {
      const result = await db.collection('products').deleteMany({
        _id: { $in: duplicates }
      });
      console.log(`Removed ${result.deletedCount} duplicate products`);
    } else {
      console.log('No duplicates found');
    }
    
    const remainingCount = await db.collection('products').countDocuments();
    console.log(`Products remaining: ${remainingCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

removeDuplicateProducts();
