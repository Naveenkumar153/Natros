const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const envFileName = `.env.${"development"}`;
const envFilePath = path.join(__dirname, '../../', envFileName);
const fs = require('fs');
const tourModel = require('../../src/models//toursModel');


console.log('envFilePath',envFilePath);
dotenv.config({ path: envFilePath });

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_CONNECTION_URL).then((success) => {
      console.log('DB connection successful!');
      
    });

  } catch (error) {
    console.log('error',error);
  }
};
connectDB();


const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
console.log('tours',tours);

// IMPORT DATA INTO DB
const importData = async () => {
try {
await tourModel.create(tours);
console.log('data successfully loaded');
process.exit();
} catch (error) {
console.log('error',error);
}
};
// importData();

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
try {
await tourModel.deleteMany();
console.log('data successfully deleted');
process.exit();
} catch (error) {
console.log('error',error);
}
};

if(process.argv[2] === '--import'){
  importData();
}else if(process.argv[2] === '--delete'){
  deleteData();
}

console.log(process.argv);
