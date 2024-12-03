const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const local ="mongodb+srv://123:123@e-store.uf5qztz.mongodb.net/TAPTAP";
    await mongoose.connect(local, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  }
};

module.exports = connectDB;