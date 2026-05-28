// Script to remove duplicate categories
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'gangsar_unitech';

async function removeDuplicates() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const categories = await db.collection('categories').find({}).toArray();
    
    console.log(`Found ${categories.length} categories`);
    
    // Group by slug to find duplicates
    const seen = new Map();
    const duplicates = [];
    
    for (const cat of categories) {
      if (seen.has(cat.slug)) {
        duplicates.push(cat._id);
        console.log(`Duplicate found: ${cat.name} (${cat.slug})`);
      } else {
        seen.set(cat.slug, cat);
      }
    }
    
    if (duplicates.length > 0) {
      const result = await db.collection('categories').deleteMany({
        _id: { $in: duplicates }
      });
      console.log(`Removed ${result.deletedCount} duplicate categories`);
    } else {
      console.log('No duplicates found');
    }
    
    const remainingCount = await db.collection('categories').countDocuments();
    console.log(`Categories remaining: ${remainingCount}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

removeDuplicates();
