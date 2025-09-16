require('dotenv').config();
const mongoose = require('mongoose');
const Planet = require('./models/planet');

const planetData = [


     {
        name: 'Pyros',
        nativeSpecies: ['Pyronite'],
        description: 'A star-like planet with a fiery, molten core and a surface of active volcanoes. The atmosphere is composed of superheated plasma.',
        habitat: 'Pyronites live directly on the fiery surface, feeding on sources of heat. The planet is orbited by several flaming asteroids.',
        firstAppearance: 'And Then There Were 10',
        image: 'images/pyros.png'
    },
    {
        name: 'Khoros',
        nativeSpecies: ['Tetramand'],
        description: 'A harsh, red desert planet with intense gravity, which contributes to the immense strength of its inhabitants.',
        habitat: 'Tetramands live a nomadic, warrior-like lifestyle in tribes, constantly battling for resources and honor across the barren wastelands.',
        firstAppearance: 'Washington B.C.',
        image: 'images/khoros.png'
    },
    {
        name: 'Petropia',
        nativeSpecies: ['Petrosapien', 'Crystalsapien'],
        description: 'A crystalline world where everything, including the lifeforms, is made of incredibly durable silicon-based crystals.',
        habitat: 'The entire planet is a network of crystal structures, cities, and caves. Petrosapiens live in a society built upon shaping and utilizing their crystalline environment.',
        firstAppearance: 'The Coming of Goop',
        image: 'images/petropia.png'
    },
    {
        name: 'Galvan Prime',
        nativeSpecies: ['Galvan'],
        description: 'The homeworld of the Galvan, an incredibly advanced and technologically superior planet. It features vast, futuristic cities and scientific institutions.',
        habitat: 'The surface is almost entirely covered by a single, sprawling city. Galvans value intellect above all else, and their society is dedicated to scientific pursuit.',
        firstAppearance: 'Ben 10: Secret of the Omnitrix',
        image: 'images/galvan_prime.png'
    },
    {
        name: 'Vulpin',
        nativeSpecies: ['Vulpimancer'],
        description: 'A dark, polluted, and hazardous planet that serves as a galactic dumping ground. It is characterized by its toxic atmosphere and sharp terrain.',
        habitat: 'Vulpimancers are non-sentient predators that have adapted to this harsh world, relying on their enhanced senses of smell and hearing to navigate and hunt in the darkness.',
        firstAppearance: 'Permanent Retirement',
        image: 'images/vulpin.png'
    },
    {
        name: 'Kinet',
        nativeSpecies: ['Kineceleran'],
        description: 'A planet that experiences an accelerated timeframe, with extremely fast electrical storms constantly raging across its surface.',
        habitat: 'Kinecelerans are adapted to this high-speed environment. They live in a society that moves too fast for most other species to perceive.',
        firstAppearance: 'Mentioned in "The Unnaturals"',
        image: 'images/kinet.png'
    },
    {
        name: 'Terradino',
        nativeSpecies: ['Vaxasaurian'],
        description: 'A lush, prehistoric jungle world inhabited by various dinosaur-like creatures. It has a primitive and wild environment.',
        habitat: 'Vaxasaurians are the dominant species, living in herds and adapting a tribal societal structure. The planet is rich with vegetation and other large fauna.',
        firstAppearance: 'Mentioned in "Ben 10 Returns: Part 1"',
        image: 'images/terradino.png'
    },
    {
        name: 'Kylmyys',
        nativeSpecies: ['Necrofriggian'],
        description: 'An extremely cold ice planet with sub-zero temperatures. Its surface is covered in glaciers and frozen landscapes.',
        habitat: 'Necrofriggians are moth-like aliens that thrive in the intense cold. They can phase through solid matter and feed on solar plasma.',
        firstAppearance: 'Save the Last Dance',
        image: 'images/kylmyys.png'
    },
    {
        name: 'Anur Phaetos',
        nativeSpecies: ['Ectonurite'],
        description: 'The homeworld of the Ectonurites, located in the dark and eerie Anur System. It exists in a state between dimensions.',
        habitat: 'Anur Phaetos is a shadowy, terrifying world where conventional laws of physics do not always apply. It is perpetually dark and filled with ghostly structures.',
        firstAppearance: 'The Big Tick',
        image: 'images/anur_phaetos.png'
    },
    {
        name: 'Galvan B',
        nativeSpecies: ['Galvanic Mechamorph'],
        description: 'A once-uninhabited moon of Galvan Prime that was accidentally brought to life by a Galvan experiment, creating the Galvanic Mechamorphs.',
        habitat: 'The entire moon is a sentient, technological ecosystem. Structures, ground, and life are all made of the same liquid metal material.',
        firstAppearance: 'Ben 10: Secret of the Omnitrix',
        image: 'images/galvan_b.png'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecting to database for PLANETS...');
        await Planet.deleteMany({});
        await Planet.insertMany(planetData);
        console.log('Planet database seeded successfully!');
    } catch (err) {
        console.error('Error seeding planet database:', err);
    } finally {
        await mongoose.connection.close();
    }
};

seedDB();