const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Mock data configuration
const LEADERBOARDS = [
  'general_knowledge',
  'science_quiz', 
  'history_challenge',
  'geography_test',
  'sports_trivia'
];

const USERS = [
  { username: 'admin', email: 'admin@nomadsoft.us' },
  { username: 'john.doe', email: 'john.doe@nomadsoft.us' },
  { username: 'jane.smith', email: 'jane.smith@nomadsoft.us' },
  { username: 'bob.wilson', email: 'bob.wilson@nomadsoft.us' },
  { username: 'alice.brown', email: 'alice.brown@nomadsoft.us' },
  { username: 'charlie.davis', email: 'charlie.davis@nomadsoft.us' }
];

function generateRandomScore() {
  return Math.floor(Math.random() * 2000) + 500; // Scores between 500-2500
}

function generateRandomMetadata() {
  const difficulties = ['easy', 'medium', 'hard'];
  const categories = ['multiple-choice', 'true-false', 'fill-in-blank'];
  
  return {
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    timeSpent: Math.floor(Math.random() * 300) + 60, // 60-360 seconds
    questionsAnswered: Math.floor(Math.random() * 20) + 10
  };
}

function generateRandomTimestamp() {
  const now = new Date();
  const pastDays = Math.floor(Math.random() * 30); // Within last 30 days
  const pastTime = new Date(now.getTime() - (pastDays * 24 * 60 * 60 * 1000));
  return pastTime;
}

async function generateMockData() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/nomadquiz');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    const leaderboardsCollection = db.collection('leaderboardentries');
    
    // Get all users from database
    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users in database`);
    
    if (users.length === 0) {
      console.log('No users found. Please run user seeds first.');
      return;
    }
    
    // Clear existing leaderboard data
    await leaderboardsCollection.deleteMany({});
    console.log('Cleared existing leaderboard data');
    
    const entries = [];
    
    // Generate entries for each user and leaderboard combination
    for (const user of users) {
      for (const leaderboardId of LEADERBOARDS) {
        // Each user gets 1-3 entries per leaderboard
        const numEntries = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numEntries; i++) {
          const timestamp = generateRandomTimestamp();
          
          const entry = {
            leaderboardId,
            userId: user._id,
            username: user.username,
            score: generateRandomScore(),
            metadata: generateRandomMetadata(),
            timestamp,
            createdAt: timestamp,
            updatedAt: timestamp
          };
          
          entries.push(entry);
        }
      }
    }
    
    // Insert all entries
    if (entries.length > 0) {
      await leaderboardsCollection.insertMany(entries);
      console.log(`Generated ${entries.length} leaderboard entries`);
      
      // Display summary
      console.log('\nSummary:');
      for (const leaderboardId of LEADERBOARDS) {
        const count = entries.filter(e => e.leaderboardId === leaderboardId).length;
        const topScore = Math.max(...entries.filter(e => e.leaderboardId === leaderboardId).map(e => e.score));
        console.log(`${leaderboardId}: ${count} entries, top score: ${topScore}`);
      }
    }
    
  } catch (error) {
    console.error('Error generating mock data:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

generateMockData().then(() => {
  console.log('Mock data generation completed');
  process.exit(0);
}).catch(error => {
  console.error('Failed to generate mock data:', error);
  process.exit(1);
});