const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv =  require('dotenv');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const logger = require('./middleware/logger');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();
dotenv.config();



// Middleware
app.use(logger);
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"], // Add the new URL
  credentials: true,  // Allow credentials
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

/*if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}*/

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => console.error(error));
