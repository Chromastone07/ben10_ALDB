require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());


if (!process.env.MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined.");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', require('./routes/users')); 
app.use('/api/aliens', require('./routes/aliens'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/planets', require('./routes/planets'));
app.use('/api/episodes', require('./routes/episodes'));
app.use('/api/ai', require('./routes/ai'));


app.use('/api/profile', authMiddleware, require('./routes/profile'));
app.use('/api/favorites', authMiddleware, require('./routes/favorites'));

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

app.get('*', (req, res) => {
    if (!req.url.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ msg: 'API route not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));