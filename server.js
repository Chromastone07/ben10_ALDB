require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/aliens', require('./routes/aliens'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/planets', require('./routes/planets'));
app.use('/api/chat', require('./routes/chat'));

app.use('/api/ai', require('./routes/ai'));

app.use('/api/users', require('./routes/users'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/details', require('./routes/details'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/characters.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'characters.html')));
app.get('/planets.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'planets.html')));






app.get('*', (req, res) => {
    if (!req.url.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        
        res.status(404).send('API route not found');
    }
});



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });