// Script to check user roles in the database
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUserRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.mongodbURI);
    console.log('Connected to MongoDB');

    // Get all users and their roles
    const users = await User.find({}, 'email userName role isActive');
    
    console.log('\n📋 User Roles in Database:');
    console.log('='.repeat(60));
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Username: ${user.userName}`);
        console.log(`   Role: ${user.role || 'user'}`);
        console.log(`   Active: ${user.isActive}`);
        console.log('   ' + '-'.repeat(40));
      });
    }

    // Check for admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`\n👑 Admin Users: ${adminUsers.length}`);
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found!');
      console.log('\nTo create an admin user, run:');
      console.log('node make-admin.js <email>');
    } else {
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.email} (${admin.userName})`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkUserRoles();
