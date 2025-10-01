// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');

// const app = express();

// app.use(cors());
// app.use(express.json());


// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected successfully.'))
//     .catch(err => console.error('MongoDB connection error:', err));

// app.use('/api/aliens', require('./routes/aliens'));
// app.use('/api/characters', require('./routes/characters'));
// app.use('/api/planets', require('./routes/planets'));
// app.use('/api/episodes', require('./routes/episodes'));
// app.use('/api/chat', require('./routes/chat'));

// app.use('/api/ai', require('./routes/ai'));

// app.use('/api/users', require('./routes/users'));
// app.use('/api/playlists', require('./routes/playlists'));
// app.use('/api/favorites', require('./routes/favorites'));
// app.use('/api/details', require('./routes/details'));
// app.use('/api/profile', require('./routes/profile'));

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/characters.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'characters.html')));
// app.get('/planets.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'planets.html')));
// app.get('/episodes.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'episodes.html')));






// app.get('*', (req, res) => {
//     if (!req.url.startsWith('/api/')) {
//         res.sendFile(path.join(__dirname, 'public', 'index.html'));
//     } else {
        
//         res.status(404).send('API route not found');
//     }
// });



// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });



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

// API Routes
app.use('/api/aliens', require('./routes/aliens'));
app.use('/api/characters', require('./routes/characters'));
app.use('/api/planets', require('./routes/planets'));
app.use('/api/episodes', require('./routes/episodes'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/users', require('./routes/users'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/details', require('./routes/details'));
app.use('/api/profile', require('./routes/profile'));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML Pages
app.get('/characters.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'characters.html')));
app.get('/planets.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'planets.html')));
app.get('/episodes.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'episodes.html')));

// Fallback to index.html for any other route that is not an API call
app.get('*', (req, res) => {
    if (!req.url.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).send('API route not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});