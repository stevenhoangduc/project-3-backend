// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');



// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const carsRouter = require('./controllers/cars');
const { upload, uploadImage } = require('./controllers/uploads')


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use("/uploads", express.static("uploads"));

// Upload route
app.post("/uploads", upload.single("image"), uploadImage);
// if you want to verify whole controllers
// import verifytoken above
// then just set it up as a middleware function like below
// app.use(verifyToken)
app.use('/cars', carsRouter);

// Start the server and listen on port 3000
app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), () => {
  console.log(`✅ PORT: ${app.get("port")} 🌟`);
});
