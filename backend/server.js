require('dotenv').config();

const app = require('./src/app.js');
const connectDb = require('./src/config/database.js');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
