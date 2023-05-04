require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

//connectDB
const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learnit-dev.k2fxfpa.mongodb.net/learnIT_dev?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log('connect successfully');
    } catch (error) {
        console.log('connect false');
    }
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

//router
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

app.listen(port, () => {
    console.log(`Example app listen on port ${port}`);
});
