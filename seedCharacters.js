require('dotenv').config();
const mongoose = require('mongoose');
const Character = require('./models/character');
const character = require('./models/character');

const characterData = [
    

    {
        name: 'Ben Tennyson',
        species: 'Human',
        category: ['Character'],
        image: 'images/ben_tennyson.png',
        appearance: 'A teenage boy with brown hair and green eyes, famously wearing a green jacket with the number 10, later evolving into various outfits across the series.',
        personality: 'Cocky and sometimes immature, but ultimately heroic, brave, and selfless. Ben has a strong sense of justice and is willing to sacrifice himself for others. His confidence often borders on arrogance but grows into leadership with age.',
        powersAndAbilities: 'Ben’s primary power is the Omnitrix, a device that allows him to transform into numerous alien species, each with unique powers and abilities. Skilled in hand-to-hand combat, quick-thinking under pressure.',
        history: 'Ben discovered the Omnitrix at age 10 during a summer road trip with Grandpa Max and cousin Gwen. Over the years, he fought countless alien threats, matured into a respected hero, and played a key role in defending the universe multiple times.',
        relationships: 'Cousin of Gwen Tennyson, grandson of Max Tennyson, best friend and rival of Kevin Levin. Romantic interests include Julie Yamamoto and later Kai Green.'
    },
    {
        name: 'Gwen Tennyson',
        species: 'Human / Anodite',
        category: [ 'Character'],
        image: 'images/gwen_tennyson.png',
        appearance: 'Short red hair, green eyes, and outfits often featuring shades of blue, black, or magenta. She adopts a sleeker combat style in later series.',
        personality: 'Intelligent, mature, and resourceful. Acts as the team’s strategist and voice of reason, balancing Ben’s impulsive nature. Confident in her abilities and empathetic toward allies.',
        powersAndAbilities: 'A powerful magic user and Anodite, able to manipulate mana to create energy constructs, shields, and teleportation. Skilled in martial arts and Plumber technology.',
        history: 'Initially unaware of her alien heritage, Gwen discovered her Anodite powers during adolescence and trained to control them, becoming one of the most skilled magic users in the galaxy.',
        relationships: 'Cousin of Ben Tennyson, granddaughter of Max Tennyson. Romantic partner of Kevin Levin.'
    },
    {
        name: 'Kevin Levin',
        species: 'Human / Osmosian',
        category: ['Anti-Hero',  'Character'],
        image: 'images/kevin_levin.png',
        appearance: 'Tall, muscular build with shoulder-length black hair and dark eyes. Typically wears dark, casual clothing.',
        personality: 'Sarcastic, street-smart, and occasionally hot-headed. Initially self-serving but later fiercely loyal to his friends. Values loyalty and honor in his own way.',
        powersAndAbilities: 'Osmosian Transformation – absorbs matter and energy of anything he touches to form weapons, armor, or enhance physical strength. Skilled mechanic and pilot.',
        history: 'Once a criminal adversary to Ben, Kevin reformed after joining forces against mutual enemies. Despite occasional moral slips, he remained a vital member of the team.',
        relationships: 'Close friend and rival of Ben Tennyson. Romantic partner of Gwen Tennyson.'
    },
    {
        name: 'Max Tennyson',
        species: 'Human',
        category: ['Character'],
        image: 'images/max_tennyson.png',
        appearance: 'Older, stocky man with a receding hairline and a signature red Hawaiian shirt.',
        personality: 'Wise, calm, and resourceful. A fatherly figure to his grandchildren, balancing humor with discipline. Always ready for a fight when needed.',
        powersAndAbilities: 'Expert tactician, former elite Plumber agent, proficient with alien technology and weapons.',
        history: 'A decorated Plumber who once battled Vilgax and other galactic threats. Retired to live quietly until Ben found the Omnitrix, drawing him back into the hero life.',
        relationships: 'Grandfather of Ben and Gwen. Former partner of Verdona (Gwen’s grandmother) and longtime foe of Vilgax.'
    },
    {
        name: 'Rook Blonko',
        species: 'Revonnahgander',
        category: [ 'Character'],
        image: 'images/rook_blonko.png',
        appearance: 'Tall, lean alien with blue skin, cat-like facial features, and armor-like combat suit. Carries a Proto-Tool weapon.',
        personality: 'Polite, disciplined, and highly professional. Loyal to Ben, though often perplexed by his unconventional methods. Strong moral compass.',
        powersAndAbilities: 'Highly trained in combat, stealth, and strategy. Uses a Proto-Tool – a multifunctional weapon capable of transforming into various devices. Excellent marksman.',
        history: 'Rook graduated top of his class at the Plumber Academy and was assigned as Ben’s partner. Together, they faced numerous galactic threats during the Omniverse era.',
        relationships: 'Partner and close friend of Ben Tennyson. Respected member of the Plumbers.'
    },

    {
    name: 'Julie Yamamoto',
    species: 'Human',
    category: ['Character'],
    image: 'images/julie.png',
    appearance: 'A teenage girl with long black hair and brown eyes. She often wears casual outfits such as t-shirts and jeans, and is seen with her pet Ship.',
    personality: 'Kind-hearted, patient, and caring. Julie is supportive of Ben despite the dangers of his hero work, though she is not afraid to call him out when he messes up.',
    powersAndAbilities: 'Julie is a skilled tennis player and can pilot Ship, a Galvanic Mechamorph pet capable of shapeshifting into various tools and vehicles.',
    history: 'Julie met Ben in high school and became his girlfriend. She occasionally assists in his missions, especially when Ship is involved.',
    relationships: 'Romantic partner of Ben Tennyson. Close friend to Gwen and Kevin.'
},
{
    name: 'Ship',
    species: 'Galvanic Mechamorph',
    category: ['Character'],
    image: 'images/ship.png',
    appearance: 'A small, metallic, dog-like alien with green eyes and the ability to change shape into machines.',
    personality: 'Playful, loyal, and curious. Ship behaves like a puppy but is highly intelligent.',
    powersAndAbilities: 'Ship can shapeshift into various machines, weapons, and vehicles. It can merge with technology to enhance its capabilities.',
    history: 'Originally rescued from a hostile alien, Ship bonded with Julie and often helps the team.',
    relationships: 'Companion of Julie Yamamoto and ally to Ben’s team.'
},

{
    name: 'Azmuth',
    species: 'Galvan',
    category: ['Character'],
    image: 'images/azmuth.png',
    appearance: 'A small, grey-skinned alien resembling a frog with large black eyes.',
    personality: 'Genius-level intellect, often blunt and condescending, but deeply cares for the universe’s safety.',
    powersAndAbilities: 'Creator of the Omnitrix and master of Galvanic technology.',
    history: 'Azmuth built the Omnitrix to promote peace and understanding between alien races. He often appears to guide or scold Ben.',
    relationships: 'Mentor figure to Ben. Has complex relationships with other Galvans and intergalactic leaders.'
},
{
    name: 'Vilgax',
    species: 'Chimera Sui Generis',
    category: ['Villain'],
    image: 'images/vilgax.png',
    appearance: 'A massive, muscular alien with green skin, red eyes, and tentacles on his chin.',
    personality: 'Ruthless, ambitious, and power-hungry. Vilgax seeks ultimate power and domination.',
    powersAndAbilities: 'Superhuman strength, durability, combat skills, and mastery of alien technology.',
    history: 'One of Ben’s most dangerous enemies, Vilgax has attempted to steal the Omnitrix multiple times across the series.',
    relationships: 'Arch-nemesis of Ben Tennyson. Has alliances and rivalries with multiple Villains.'
},
{
    name: 'Dr. Animo',
    species: 'Human (Mutated)',
    category: ['Villain'],
    image: 'images/dr_animo.png',
    appearance: 'A disheveled scientist with wild hair, goggles, and a green lab coat.',
    personality: 'Obsessive, egotistical, and insane. Obsessed with genetic mutation and revenge.',
    powersAndAbilities: 'Genius in genetics, able to mutate animals and himself using his Transmodulator device.',
    history: 'Once a respected scientist, Animo turned to crime after losing credibility. He frequently mutates creatures to battle Ben.',
    relationships: 'Recurring enemy of Ben, sometimes working with other Villains.'
},
{
    name: 'Zombozo',
    species: 'Human',
    category: ['Villain'],
    image: 'images/zombozo.png',
    appearance: 'A sinister clown with pale skin, red hair, and a purple suit.',
    personality: 'Sadistic and manipulative. Thrives on instilling fear in others.',
    powersAndAbilities: 'Expert in psychological manipulation and fear tactics. In some iterations, can drain life force from victims.',
    history: 'A feared criminal who uses fear to control his victims. Has clashed with Ben multiple times.',
    relationships: 'Leader of the Circus Freak Trio. Enemy of Ben and Gwen.'
},


{
    name: 'Professor Paradox',
    species: 'Human (Mutated)',
    category: ['Character'],
    image: 'images/professor_paradox.png',
    appearance: 'A tall man with neatly combed white hair, a white mustache, and a Victorian-style suit with a bow tie.',
    personality: 'Eccentric, mysterious, and cryptic in his guidance. Maintains a lighthearted demeanor despite his immense power.',
    powersAndAbilities: 'Complete mastery over time and space, including time travel and teleportation. Possesses vast knowledge of timelines.',
    history: 'Originally a scientist who was lost in the Null Void, gaining control over time after centuries of isolation.',
    relationships: 'Occasional mentor and guide to Ben Tennyson.'
},
{
    name: 'Eunice',
    species: 'Synthetic Being (Unitrix)',
    category: ['Character'],
    image: 'images/eunice.png',
    appearance: 'A teenage girl with green eyes, brown hair in a ponytail, and casual Earth clothing.',
    personality: 'Curious, cheerful, and empathetic, but occasionally uncertain about her identity.',
    powersAndAbilities: 'Similar abilities to Ben’s Omnitrix transformations, as she is a living prototype of the device.',
    history: 'Created by Azmuth as a living form of the Unitrix prototype. Developed her own personality and life on Earth.',
    relationships: 'Has a friendly relationship with Ben and Gwen.'
},
{
    name: 'Kai Green',
    species: 'Human',
    category: ['Character'],
    image: 'images/kaigreen.png',
    appearance: 'A young woman with tan skin, brown hair, and green eyes. Usually seen in casual or outdoor explorer attire.',
    personality: 'Adventurous, confident, and a bit stubborn. Shares Ben’s sense of daring but can be skeptical.',
    powersAndAbilities: 'No superpowers, but skilled in tracking, survival skills, and animal handling.',
    history: 'Met Ben during his childhood adventures and later rekindled their connection in Omniverse, becoming a close ally.',
    relationships: 'Friend and later romantic partner to Ben Tennyson in some timelines.'
},


{
    name: 'Charmcaster',
    species: 'Human (Magical)',
    category: ['Villain', 'Character'],
    image: 'images/charmcaster.png',
    appearance: 'A pale-skinned young woman with long lavender hair, often wearing a dark purple cloak and gloves.',
    personality: 'Cunning, ambitious, and manipulative. Balances between being a Villain and occasionally showing redeeming traits.',
    powersAndAbilities: 'Expert sorceress capable of spellcasting, dimensional travel, and using enchanted objects.',
    history: 'Niece and apprentice of the sorcerer Hex, frequently clashing with Ben, Gwen, and Kevin.',
    relationships: 'Primary magical rival to Gwen Tennyson.'
},

{
    name: 'Aggregor',
    species: 'Osmosian',
    category: ['Villain', 'Character'],
    image: 'images/aggregor.png',
    appearance: 'A towering armored alien with pale skin, black markings, and red eyes.',
    personality: 'Calculating, ruthless, and power-hungry with no regard for others.',
    powersAndAbilities: 'Osmosian abilities to absorb energy and matter, enhanced strength, durability, and combat skills.',
    history: 'A dangerous Osmosian criminal who hunted rare aliens to absorb their powers in pursuit of ultimate power.',
    relationships: 'Primary antagonist during the “Ultimate Alien” season arc.'
},
{
    name: 'Eon',
    species: 'Human/Chronian Hybrid',
    category: ['Villain', 'Character'],
    image: 'images/eon.png',
    appearance: 'A dark-armored figure with glowing green eyes and a flowing cape.',
    personality: 'Cold, calculating, and obsessed with controlling time.',
    powersAndAbilities: 'Time manipulation, teleportation, energy projection, and advanced combat skills.',
    history: 'A future evil version of Ben from an alternate timeline who seeks to rule all of time and space.',
    relationships: 'Enemy of Ben Tennyson, representing what he could become if corrupted.'
},
{
    name: 'Albedo',
    species: 'Galvan',
    category: ['Villain', 'Character'],
    image: 'images/albedo.png',
    appearance: 'A white-skinned Galvan with red markings, often seen in a black suit.',
    personality: 'Arrogant, cunning, and obsessed with proving himself superior to Ben.',
    powersAndAbilities: 'Ability to transform into any alien species in the Omnitrix, enhanced intelligence.',
    history: 'A failed experiment of Azmuth, seeking revenge on Ben for his perceived injustices.',
    relationships: 'Rival to Ben Tennyson, often clashing with him and his allies.'
},
{
    
    name: 'Professor Hex',
    species: 'Human (Sorcerer)',
    category: ['Character', 'Villain'],
    image: 'images/professor_hex.png',
    appearance: 'A tall, thin man with pale skin, dark robes, and a skeletal mask with glowing red eyes.',
    personality: 'Cold, calculating, and power-hungry. Hex seeks to increase his magical abilities through ancient artifacts.',
    powersAndAbilities: 'Powerful magic user capable of casting spells, summoning creatures, and using magical artifacts to boost his powers.',
    history: 'A dark sorcerer who has clashed with Ben and Gwen multiple times, often in pursuit of artifacts that enhance his magical prowess.',
    relationships: 'Uncle of Charmcaster. Enemy of Ben Tennyson and Gwen Tennyson.'

},
{
    name: 'Khyber',
    species: 'Unknown (Alien Hunter)',
    category: ['Villain', 'Character'],
    image: 'images/khyber.png',
    appearance: 'A tall, muscular alien with purple skin, white hair, and wearing advanced hunting armor.',
    personality: 'Prideful, skilled, and relentless. Hunts rare creatures, including Ben’s alien forms.',
    powersAndAbilities: 'Expert hunter with advanced tracking skills and a transforming alien pet weapon.'
},

{
    name: 'Psyphon',
    species: 'Unknown (Cyborg)',
    category: ['Villain', 'Character'],
    image: 'images/psyphon.png',
    appearance: 'A tall, cybernetic alien with a mechanical arm and a single glowing eye.',
    personality: 'Loyal and cunning second-in-command to Vilgax, carrying out his master’s plans with precision.',
    powersAndAbilities: 'Enhanced strength, durability, and various built-in weapon systems in his cybernetic body.'
},


{
    name: 'Labrid',
    species: 'Tetramand',
    category: ['Character'],
    image: 'images/labrid.png',
    appearance: 'A muscular, four-armed alien with red skin, wearing black combat gear.',
    personality: 'Brave, disciplined, and dedicated to his duty as a Plumber.',
    powersAndAbilities: 'Enhanced strength, durability, and combat skills typical of a Tetramand.',
    history: 'A respected Plumber who worked with Ben Tennyson and Rook in various missions against intergalactic threats.',
    relationships: 'Ally of Ben Tennyson.'
},
{
    name: 'Gahlii',
    species: 'Robot/Android',
    category: ['Character'],
    image: 'images/gahlii.png',
    appearance: 'A humanoid robot with white armor plating, red markings, and a single optical sensor.',
    personality: 'Loyal, logical, and precise in operations.',
    powersAndAbilities: 'Advanced robotics capabilities, enhanced strength, and integrated weaponry.',
    history: 'Served alongside the Plumbers in defending against alien threats.',
    relationships: 'Works with Ben Tennyson and other Plumbers.'
},
{
    name: 'Girlfriend',
    species: 'Human',
    category: ['Character'],
    image: 'images/girlfriend.png',
    appearance: 'A young woman with straight black hair and a confident expression.',
    personality: 'Supportive and caring.',
    powersAndAbilities: 'No known supernatural abilities.',
    history: 'Appears in the series as part of a civilian storyline connected to Ben or his allies.',
    relationships: 'Romantic interest of a recurring character.'
},
{
    name: 'Serena',
    species: 'Celestialsapien',
    category: ['Character'],
    image: 'images/serena.png',
    appearance: 'A green-skinned humanoid with celestial markings and white hair.',
    personality: 'Calm, wise, and deliberate in decision-making.',
    powersAndAbilities: 'Reality manipulation, omnipotent-level powers as a Celestialsapien.',
    history: 'One of the personalities inside the mind of Alien X, representing love and compassion.',
    relationships: 'Coexists with Bellicus inside Alien X’s consciousness.'
},
{
    name: 'Bellicus',
    species: 'Celestialsapien',
    category: ['Character'],
    image: 'images/bellicus.png',
    appearance: 'A large green-skinned alien with an imposing face and stern expression.',
    personality: 'Aggressive, authoritative, and rigid.',
    powersAndAbilities: 'Reality manipulation and cosmic-level abilities.',
    history: 'One of the personalities inside Alien X, representing aggression and judgment.',
    relationships: 'Coexists with Serena inside Alien X’s consciousness.'
},
{
    name: 'Yeti',
    species: 'Unknown (Furry Humanoid)',
    category: ['Character'],
    image: 'images/yeti.png',
    appearance: 'A large, fur-covered creature resembling a mythical yeti.',
    personality: 'Mysterious and territorial.',
    powersAndAbilities: 'Great strength, resistance to cold, and survival in harsh climates.',
    history: 'Encountered by Ben during an off-world mission.',
    relationships: 'None significant.'
},
{
    name: 'Chet Rigby',
    species: 'Human',
    category: ['Character'],
    image: 'images/chet_rigby.png',
    appearance: 'A middle-aged man with short brown hair, wearing a suit and tie.',
    personality: 'Straightforward, assertive, and skeptical of aliens.',
    powersAndAbilities: 'No supernatural powers; possesses investigative skills.',
    history: 'A government official occasionally interacting with the Plumbers.',
    relationships: 'Professional acquaintance of Ben Tennyson.'
},
{
    name: 'Foreverduke838',
    species: 'Forever Knight',
    category: ['Character', 'Villain'],
    image: 'images/foreverduke838.png',
    appearance: 'A knight in futuristic silver armor with a visor-covered helmet.',
    personality: 'Arrogant, loyal to the Forever Knights’ cause.',
    powersAndAbilities: 'Expert in sword combat, advanced technology, and tactical planning.',
    history: 'Part of the Forever Knights faction opposing alien integration on Earth.',
    relationships: 'Enemy of Ben Tennyson.'
},
{
    name: 'Jennifer',
    species: 'Human',
    category: ['Character'],
    image: 'images/jennifer.png',
    appearance: 'A young woman with short black hair and a friendly demeanor.',
    personality: 'Kind, empathetic, and supportive.',
    powersAndAbilities: 'No supernatural abilities.',
    history: 'Appears as a civilian character involved in Ben’s social life.',
    relationships: 'Friend of Ben Tennyson.'
},
{
    name: 'Blowfish',
    species: 'Fish-like Alien',
    category: ['Character', 'Villain'],
    image: 'images/blowfish.png',
    appearance: 'A blue aquatic alien with fins, a round body, and sharp teeth.',
    personality: 'Cunning and unpredictable.',
    powersAndAbilities: 'Underwater combat skills, water breathing, and spiny body inflation.',
    history: 'Encountered by Ben during underwater missions.',
    relationships: 'Enemy of Ben Tennyson.'
},
{
    name: 'Sentinel',
    species: 'Unknown (Armored Alien)',
    category: ['Character'],
    image: 'images/sentinel.png',
    appearance: 'A tall, armored figure with green skin and mechanical implants.',
    personality: 'Serious, protective, and duty-bound.',
    powersAndAbilities: 'Enhanced strength, energy weaponry, and advanced combat skills.',
    history: 'Acts as a guardian of ancient alien artifacts.',
    relationships: 'Occasional ally of Ben Tennyson.'
},
{
    name: 'Mother',
    species: 'Unknown',
    category: ['Character'],
    image: 'images/mother.png',
    appearance: 'A dark silhouette of a female humanoid figure surrounded by cosmic energy.',
    personality: 'Mysterious and authoritative.',
    powersAndAbilities: 'Unknown, but implied to have cosmic-level powers.',
    history: 'Appears in a symbolic or mystical capacity.',
    relationships: 'Mother figure to Star Child.'
},
{
    name: 'Star Child',
    species: 'Energy Being',
    category: ['Character'],
    image: 'images/star_child.png',
    appearance: 'A glowing, ethereal child-like figure made of pure energy.',
    personality: 'Innocent and curious.',
    powersAndAbilities: 'Energy projection, flight, and possible reality manipulation.',
    history: 'A cosmic entity with ties to powerful beings.',
    relationships: 'Child of Mother.'
},
{
    name: 'Barry',
    species: 'Human',
    category: ['Character'],
    image: 'images/barry.png',
    appearance: 'A man with light skin, wearing a white headwrap and desert clothing.',
    personality: 'Resourceful and determined.',
    powersAndAbilities: 'Survival skills and knowledge of desert terrain.',
    history: 'Assists Ben and friends during a desert-based mission.',
    relationships: 'Ally of Ben Tennyson.'
},
{
    name: 'Kwarrel',
    species: 'Revonnahgander',
    category: ['Character'],
    image: 'images/kwarrel.png',
    appearance: 'A large alien resembling Rook but older, with gray fur.',
    personality: 'Wise, patient, and experienced.',
    powersAndAbilities: 'Revonnahgander combat training, hunting skills, and agility.',
    history: 'Mentor to Rook Blonko and ally to Ben.',
    relationships: 'Mentor to Rook Blonko.'
},
{
    name: 'Baz-L',
    species: 'Unknown',
    category: ['Character', 'Villain'],
    image: 'images/baz_l.png',
    appearance: 'A tall alien with black and neon-green body patterns.',
    personality: 'Cold and calculating.',
    powersAndAbilities: 'Advanced technology use, combat proficiency.',
    history: 'Engaged in criminal activities opposed by the Plumbers.',
    relationships: 'Enemy of Ben Tennyson.'
},
{
    name: 'Fritz',
    species: 'Human',
    category: ['Character'],
    image: 'images/fritz.png',
    appearance: 'A woman in a hooded cloak with a stern expression.',
    personality: 'Determined and mysterious.',
    powersAndAbilities: 'Unknown.',
    history: 'Appears in a minor storyline related to magical or criminal events.',
    relationships: 'None notable.'
},
{
    name: 'Janitor',
    species: 'Human',
    category: ['Character'],
    image: 'images/janitor.png',
    appearance: 'A middle-aged man in janitorial clothing.',
    personality: 'Hardworking and observant.',
    powersAndAbilities: 'No supernatural powers.',
    history: 'Civilian who crosses paths with Ben and team during an incident.',
    relationships: 'None notable.'
},
{
    name: 'Teacher',
    species: 'Human',
    category: ['Character'],
    image: 'images/teacher.png',
    appearance: 'An older alien-like humanoid with large yellow eyes and grayish skin.',
    personality: 'Wise and stern.',
    powersAndAbilities: 'Unknown but potentially connected to alien knowledge.',
    history: 'Appears in educational or mentorship capacity.',
    relationships: 'None notable.'
},
{
    name: 'Harangue',
    species: 'Human (Plumber)',
    category: ['Character'],
    image: 'images/harangue.png',
    appearance: 'A stern-looking man with short hair and glasses, dressed in formal Plumber attire.',
    personality: 'Stern, disciplined, and highly principled. Upholds Plumber code and protocol.',
    powersAndAbilities: 'Expert in Plumber tactics, alien law enforcement, and advanced strategic planning.',
    history: 'Served as a senior Plumber official overseeing field operations and training agents like Ben and Rook.',
    relationships: 'Professional relationship with Ben Tennyson and other Plumbers.'
},
{
    name: 'Vulkanus',
    species: 'Pyronite',
    category: ['Character', 'Villain'],
    image: 'images/vulkanus.png',
    appearance: 'A heavily armored alien with molten armor plating and glowing red cracks.',
    personality: 'Aggressive, hot-headed, and seeks strength through fury.',
    powersAndAbilities: 'Can manipulate magma and heat, super strength, and heat resistance.',
    history: 'Appears as a powerful adversary in Atrosian arenas, testing combatants like Ben.',
    relationships: 'Occasional opponent of Ben Tennyson.'
},
{
    name: 'Charmcaster',
    species: 'Human (Magical)',
    category: ['Character', 'Villain'],
    image: 'images/charmcaster.png',
    appearance: 'A silver-haired woman in a gothic outfit with mystical accessories and glowing eyes.',
    personality: 'Manipulative, cunning, and driven by personal vendettas.',
    powersAndAbilities: 'Skilled in dark magic, teleportation, spell casting, and summoning creatures.',
    history: 'Niece and apprentice of Hex, Charmcaster has clashed with Ben, Gwen, and Kevin throughout the series.',
    relationships: 'Villainous rival of Gwen Tennyson.'
},
{
    name: 'Captain Nemesis',
    species: 'Human (Plumber Elite)',
    category: ['Character'],
    image: 'images/captain_nemesis.png',
    appearance: 'A tall, confident Plumber in dark tactical armor and a helmet with a visor.',
    personality: 'Quiet, authoritative, and highly competent.',
    powersAndAbilities: 'Mastery of tactical combat, leadership, and high-level Plumber technology.',
    history: 'Commands high-security missions and occasionally leads elite Plumber squads that interface with Ben’s team.',
    relationships: 'Respected associate within the Plumber ranks.'
},
{
    name: 'Addwaitya',
    species: 'Chromastone (mirror) form / Energy Being',
    category: ['Character'],
    image: 'images/addwaitya.png',
    appearance: 'A silhouette-like figure with reflective energy contours and glowing eyes.',
    personality: 'Mysterious, reserved, and contemplative.',
    powersAndAbilities: 'Reflects energy attacks, intangible, and can manipulate mirrored energy.',
    history: 'Emerges as an alternate energy form of Chromastone when exposed to extreme energy flux.',
    relationships: 'Linked cosmically to Chromastone (Ben’s ally alien form).'
},
{
    name: 'Octagon',
    species: 'Unknown (Alien Creature)',
    category: ['Character'],
    image: 'images/octagon.png',
    appearance: 'An eight-limbed creature with sharp, hardened exoskeleton.',
    personality: 'Instinct-driven and defensive.',
    powersAndAbilities: 'Enhanced strength, agility, and multi-limb coordination.',
    history: 'Encountered by Ben on a mysterious alien world as a territorial guardian.',
    relationships: 'Neutral; neither friend nor foe to Ben.'
},
{
    name: 'Rhomboid',
    species: 'Geometric Alien Creature',
    category: ['Character'],
    image: 'images/rhomboid.png',
    appearance: 'A crystalline being composed of interlocking rhomboid shapes.',
    personality: 'Unyielding, emotionless, and logical.',
    powersAndAbilities: 'Can manipulate crystalline structures, refract light, and alter physical geometry.',
    history: 'Discovered deep within crystal caverns on a distant planet.',
    relationships: 'Neutral entity interacting with Ben during exploration.'
},
{
    name: 'Darkstar',
    species: 'Unknown (Cosmic Entity)',
    category: ['Character'],
    image: 'images/darkstar.png',
    appearance: 'Tall humanoid with dark skin and glowing cosmic tattoos.',
    personality: 'Calculating, manipulative, and driven by cosmic ambition.',
    powersAndAbilities: 'Gravity manipulation, dark energy control, and spatial distortion.',
    history: 'A rogue cosmic force encountered by Ben when cosmic balance was threatened.',
    relationships: 'Antagonist in a cosmic-level mission during Ben’s adventures.'
},
{
    name: 'Elena',
    species: 'Human',
    category: ['Character'],
    image: 'images/elena.png',
    appearance: 'A young woman with dark hair and expressive eyes, wearing casual attire.',
    personality: 'Kind, determined, and supportive of those around her.',
    powersAndAbilities: 'No known superpowers.',
    history: 'Part of a civilian storyline intersecting with Ben’s heroics.',
    relationships: 'Friend or acquaintance of Ben Tennyson.'
},
{
    name: 'Lucubra',
    species: 'Arachnichimp-Construct Hybrid',
    category: ['Character'],
    image: 'images/lucubra.png',
    appearance: 'A spider-like creature with a semi-mechanical body and glowing red eyes.',
    personality: 'Feral, cunning, and protective of its domain.',
    powersAndAbilities: 'Web generation, enhanced senses, and partial mechanical augmentation.',
    history: 'Encountered in Ben’s adventures within dark, abandoned alien structures.',
    relationships: 'Neutral; reacts defensively toward intruders.'
},
{
    name: 'Edwards',
    species: 'Human',
    category: ['Character'],
    image: 'images/edwards.png',
    appearance: 'A mature man with rugged features and a serious expression.',
    personality: 'Pensive, world-weary, and wise.',
    powersAndAbilities: 'No powers; knowledgeable in alien lore or field strategy.',
    history: 'Met Ben as an experienced contact with deep understanding of alien histories.',
    relationships: 'Informant or mentor-type figure to Ben in specific missions.'
},


  {
    name: "Victor",
    species: "Mutant Cyborg",
    category: ["Villain"],
    image: "images/victor.png",
    appearance: "A towering Frankenstein-like figure with mechanical enhancements, bolts, and a menacing glare.",
    personality: "Brutish, loyal to stronger Villains, and power-hungry.",
    powersAndAbilities: "Superhuman strength, durability, and electrical energy attacks.",
    history: "Works as an enforcer for Vilgax and other major Villains, using his sheer force to overpower enemies.",
    relationships: "Allied with Vilgax and other antagonists in joint schemes."
  },
  {
    name: "Simian",
    species: "Luna Lobo",
    category: ["Villain"],
    image: "images/simian.png",
    appearance: "An anthropomorphic monkey-like alien with dark fur, sharp claws, and agile limbs.",
    personality: "Cunning, opportunistic, and agile.",
    powersAndAbilities: "Enhanced agility, strength, stealth, and wall-climbing abilities.",
    history: "A mercenary often hired for theft or sabotage, switching allegiances based on profit.",
    relationships: "Has worked with Ben and his enemies depending on the situation."
  },
  {
    name: "SevenSeven",
    species: "Unknown",
    category: ["Villain"],
    image: "images/sevenseven.png",
    appearance: "A tall armored figure with a concealed face, armed with various weapons.",
    personality: "Cold, calculating, and professional.",
    powersAndAbilities  : "Expert in weapons, combat strategy, and bounty hunting tactics.",
    history: "Feared across galaxies as one of the deadliest bounty hunters.",
    relationships: "Takes contracts from the highest bidder, sometimes clashing with Ben."
  },
  {
    name: "Sir Connor",
    species: "Human",
    category: ["Villain"],
    image: "images/sir_connor.png",
    appearance: "A knight in advanced medieval armor wielding a sword and shield.",
    personality: "Chivalrous but misguided, driven by honor twisted by false ideals.",
    powersAndAbilities: "Expert swordsman, enhanced armor with energy resistance.",
    history: "Hails from an alternate reality where medieval technology evolved differently.",
    relationships: "Occasionally allies with other Villains for personal quests."
  },
  {
    name: "Patrick",
    species: "Human",
    category: ["Villain"],
    image: "images/patrick.png",
    appearance: "A well-dressed man with a confident, smug expression.",
    personality: "Manipulative, calculating, and persuasive.",
    powersAndAbilities: "No superpowers; relies on wealth, influence, and manipulation.",
    history: "A political figure who secretly works against Ben’s allies for personal gain.",
    relationships : "Employs mercenaries and criminals to carry out his plans."
  },
  {
    name: "DNAliens",
    species: "Mutated Human",
    category: ["Villain"],
    image: "images/dnaliens.png",
    appearance: "Humanoids with grotesque, mutated features and alien-like armor-like skin.",
    personality: "Mindless, obedient, and aggressive.",
    powersAndAbilities: "Enhanced strength, durability, and resistance to pain.",
    history : "Created by infecting humans with Xenocite parasites to serve the Highbreed.",
    relationships: "Controlled by the Highbreed as part of their invasion force."
  },
  {
    name: "Xenocite",
    species: "Parasitic Alien",
    category: ["Villain"],
    image: "images/xenocite.png",
    appearance: "A small, insect-like parasite with sharp appendages.",
    personality: "Predatory and single-minded in its goal to infect hosts.",
    powersAndAbilities: "Can latch onto a host’s head to take control and mutate them into DNAliens.",
    history: "Engineered by the Highbreed as a tool for domination.",
    relationships: "Symbiotic control over DNAliens; serves the Highbreed."
  },
  {
    name: "Hammer",
    species: "Unknown Alien",
    category: ["Villain"],
    image: "images/hammer.png",
    appearance: "A large, muscular alien with a thick exoskeleton and blunt-force weaponry.",
    personality: "Aggressive, simple-minded, and destructive.",
    powersAndAbilities: "Immense physical strength and durability.",
    history: "Works as heavy muscle for various galactic criminals.",
    relationships: "Often paired with other strong enforcers."
  },
  {
    name: "Surgeon",
    species: "Human",
    category: ["Villain"],
    image: "images/surgeon.png",
    appearance: "A menacing figure in medical gear with sharp surgical instruments.",
    personality: "Sadistic, precise, and methodical.",
    powersAndAbilities: "Expert in anatomy, torture, and surgical weaponry.",
    history: "Performs experiments on captured victims for unknown goals.",
    relationships: "Has supplied modified creatures and weapons to other Villains."
  },


  
    {
        name: "Sunder",
        species: "Cyborg Alien",
        category: ["Villain"],
        image: "images/sunder.png",
        appearance: "Large muscular alien with cybernetic implants, armor plating, and a menacing posture.",
        personality: "Brutal, relentless, and self-serving.",
        powersAndAbilities: "Enhanced strength, durability, and advanced weaponry.",
        history: "A ruthless intergalactic bounty hunter who often crosses paths with Ben.",
        relationships: "Primarily works alone, but occasionally hired by larger Villain organizations."
    },
    {
        name: "Ssserpent",
        species: "Snake-like Alien",
        category: ["Villain"],
        image: "images/ssserpent.png",
        appearance: "Green-scaled serpent humanoid with fangs and yellow eyes.",
        personality: "Cunning, sly, and deceitful.",
        powersAndAbilities: "Venomous bite, constricting strength, and agility.",
        history: "Criminal who uses his snake physiology to his advantage in battles.",
        relationships: "Allied with other Villains for personal gain."
    },
    {
        name: "Sir Urien",
        species: "Human",
        category: ["Villain"],
        image: "images/sir_urien.png",
        appearance: "Armored medieval knight with stern facial features.",
        personality: "Honorable in combat but loyal to corrupt orders.",
        powersAndAbilities: "Expert swordsman and tactician.",
        history: "Serves a Villainous royal cause against Ben and his allies.",
        relationships: "Ally to other Villain knights."
    },
    {
        name: "Pickaxe Aliens",
        species: "Alien Miners",
        category: ["Character"],
        image: "images/pickaxe_aliens.png",
        appearance: "Humanoid aliens equipped with mining gear and pickaxes.",
        personality: "Industrious but aggressive when ordered.",
        powersAndAbilities: "Skilled at mining and tunneling.",
        history: "Often employed as laborers or soldiers for Villain forces.",
        relationships: "Work in groups, loyal to whoever hires them."
    },
    {
        name: "Oliver",
        species: "Human",
        category: ["Character"],
        image: "images/oliver.png",
        appearance: "Bald man in a formal suit, appearing worried or tense.",
        personality: "Cautious and intelligent.",
        powersAndAbilities: "No special powers; skilled in diplomacy or intelligence work.",
        history: "Civilian who becomes involved in alien affairs through circumstance.",
        relationships: "Occasionally assists Ben with information."
    },
    {
        name: "Red Robot",
        species: "Robot",
        category: ["Villain"],
        image: "images/red_robot.png",
        appearance: "Large red robotic figure with heavy armor.",
        personality: "Cold and programmed for efficiency.",
        powersAndAbilities: "Enhanced strength, energy blasts, and armor durability.",
        history: "Built as a combat unit for destructive purposes.",
        relationships: "Follows its creator’s commands."
    },
    {
        name: "Aggrebot",
        species: "Robot",
        category: ["Character"],
        image: "images/aggrebot.png",
        appearance: "Cluster of smaller robots forming a single large combat unit.",
        personality: "Obedient to programming.",
        powersAndAbilities: "Modular form allowing combination and separation.",
        history: "Mass-produced for combat and defense purposes.",
        relationships: "Works in unison with other Aggrebots."
    },
    {
        name: "Buzz",
        species: "Cyborg",
        category: ["Villain"],
        image: "images/buzz.png",
        appearance: "Muscular cyborg with visor and advanced weapon systems.",
        personality: "Aggressive and power-hungry.",
        powersAndAbilities: "Cybernetic enhancements and ranged weaponry.",
        history: "Mercenary enhanced with cybernetics to improve combat efficiency.",
        relationships: "Occasionally works with other mercenaries."
    },
    {
        name: "Cerberus",
        species: "Alien Creature",
        category: ["Villain"],
        image: "images/cerberus.png",
        appearance: "Three-headed beast resembling the mythological Cerberus.",
        personality: "Feral and aggressive.",
        powersAndAbilities: "Immense strength, multiple biting attacks.",
        history: "Guard creature used by Villains to protect their lairs.",
        relationships: "Loyal to its master."
    },
    {
        name: "Computron",
        species: "Robot",
        category: ["Villain"],
        image: "images/computron.png",
        appearance: "Tall, sleek robot with advanced sensors.",
        personality: "Logical and analytical.",
        powersAndAbilities: "Advanced computing, hacking, and combat abilities.",
        history: "Designed to take over technological systems for its creator.",
        relationships: "Loyal to its builder."
    },
    {
        name: "Minions",
        species: "Various Alien Species",
        category: ["Villain"],
        image: "images/minions.png",
        appearance: "Small, shadowy alien creatures.",
        personality: "Loyal to orders, mindless drones.",
        powersAndAbilities: "Swarm tactics, agility.",
        history: "Used by Villains in large numbers to overwhelm enemies.",
        relationships: "Obey their commander."
    },
    {
        name: "Sir Mel",
        species: "Human",
        category: ["Villain"],
        image: "images/sir_mel.png",
        appearance: "Armored medieval knight with a stern look.",
        personality: "Strict, disciplined, and loyal to his cause.",
        powersAndAbilities: "Master swordsman and battlefield tactician.",
        history: "Serves the same order as Sir Urien in opposition to Ben.",
        relationships: "Works alongside other Villain knights."
    },
    {
        name: "Antonio",
        species: "Alien",
        category: ["Villain"],
        image: "images/antonio.png",
        appearance: "Anthropomorphic bat-like alien with sharp claws.",
        personality: "Clever and predatory.",
        powersAndAbilities: "Flight, enhanced hearing, and sharp claws.",
        history: "Criminal alien operating on Earth and beyond.",
        relationships: "Allied with Villain groups when beneficial."
    },
    {
        name: "Sunny",
        species: "Human/Anodite Hybrid",
        category: ["Character"],
        image: "images/sunny.png",
        appearance: "Young woman with dark hair and confident demeanor.",
        personality: "Flirty, cunning, and manipulative.",
        powersAndAbilities: "Anodite energy manipulation, telekinesis, and flight.",
        history: "A relative of Gwen with powerful Anodite abilities.",
        relationships: "Has a complicated relationship with Gwen."
    },
    {
        name: "Xarion",
        species: "Human",
        category: ["Character"],
        image: "images/xarion.png",
        appearance: "Elderly man with long white hair and beard, wearing regal robes.",
        personality: "Wise but sometimes arrogant.",
        powersAndAbilities: "No direct powers; commands political influence.",
        history: "Ruler who interacts with Ben during diplomatic conflicts.",
        relationships: "Allies and enemies depending on political interests."
    },
    {
        name: "King Viktor",
        species: "Transylian",
        category: ["Villain"],
        image: "images/king_viktor.png",
        appearance: "Tall, monstrous figure resembling Frankenstein’s monster.",
        personality: "Prideful, commanding, and ruthless.",
        powersAndAbilities: "Super strength, durability, and electrical manipulation.",
        history: "Ruler of the Transylians who opposes Ben.",
        relationships: "Leader of his people; enemies with Ben."
    },



    {
        name: "Pallorfang",
        species: "Alien",
        category: ["Villain"],
        image: "images/pallorfang.png",
        appearance: "Large alien with a long jaw and sharp teeth, reptilian features.",
        personality: "Aggressive and predatory.",
        powersAndAbilities: "Enhanced bite strength, agility, and sharp reflexes.",
        history: "Encountered Ben and his team as part of a hostile alien group.",
        relationships: "Allied with other alien criminals."
    },
    {
        name: "Scrutin",
        species: "Alien",
        category: ["Villain"],
        image: "images/scrutin.png",
        appearance: "Flying alien with insect-like wings and a segmented body.",
        personality: "Sly and observant.",
        powersAndAbilities: "Flight, enhanced vision, and precision attacks.",
        history: "Worked with other aliens in coordinated attacks against Ben.",
        relationships: "Often partners with aerial or scouting Villains."
    },
    {
        name: "Rock Monsters",
        species: "Rock-based Alien",
        category: ["Villain"],
        image: "images/rock_monsters.png",
        appearance: "Massive creatures made entirely of stone.",
        personality: "Brutish and destructive.",
        powersAndAbilities: "Immense strength and durability.",
        history: "Summoned or controlled by Villains for large-scale destruction.",
        relationships: "Used as enforcers by other antagonists."
    },
    {
        name: "Strabismus",
        species: "Alien",
        category: ["Villain"],
        image: "images/strabismus.png",
        appearance: "Tall alien with one large mechanical eye device.",
        personality: "Cold and calculating.",
        powersAndAbilities: "Advanced targeting systems, precision laser attacks.",
        history: "Appeared in conflicts where high-tech weaponry was used.",
        relationships: "Associates with technologically advanced Villains."
    },
    {
        name: "Gyula",
        species: "Alien",
        category: ["Villain"],
        image: "images/gyula.png",
        appearance: "Humanoid alien with a muscular build and icy demeanor.",
        personality: "Disciplined and militant.",
        powersAndAbilities: "Expert combat skills, alien weapon proficiency.",
        history: "Led alien troops against Ben in tactical missions.",
        relationships: "Commands underlings in military operations."
    },
    {
        name: "Plant Alien",
        species: "Plant-based Alien",
        category: [ "Villain"],
        image: "images/plant_alien.png",
        appearance: "Green humanoid with plant-like limbs and leafy textures.",
        personality: "Silent but hostile.",
        powersAndAbilities: "Regeneration, ensnaring vines, and poison.",
        history: "Part of a group of plant-based threats faced by Ben.",
        relationships: "Connected to plant clones and similar lifeforms."
    },
    {
        name: "Plant Clones",
        species: "Plant-based Alien",
        category: [ "Villain"],
        image: "images/plant_clones.png",
        appearance: "Replicas of Ben and his allies made from plant matter.",
        personality: "Mimics original personalities but with hostile intent.",
        powersAndAbilities: "Replication, camouflage, and enhanced physical traits.",
        history: "Created to infiltrate and sabotage Ben's team.",
        relationships: "Created by plant alien entities."
    },
    {
        name: "Morgg",
        species: "Alien",
        category: ["Villain"],
        image: "images/morgg.png",
        appearance: "Green-skinned alien with a stern face and armored suit.",
        personality: "Harsh and power-driven.",
        powersAndAbilities: "Alien weaponry, tactical expertise.",
        history: "Involved in intergalactic conflicts against Ben.",
        relationships: "Part of a larger alien criminal network."
    },
    {
        name: "Trombipulor",
        species: "Alien",
        category: ["Villain"],
        image: "images/trombipulor.png",
        appearance: "Bulky alien with a shell-like exterior and tusks.",
        personality: "Loud and overconfident.",
        powersAndAbilities: "Heavy armor, physical strength.",
        history: "Often used brute force to achieve goals.",
        relationships: "Hired muscle for larger Villain groups."
    },
    {
        name: "Synthroid",
        species: "Synthetic Lifeform",
        category: ["Villain"],
        image: "images/synthroid.png",
        appearance: "Humanoid robot with black and white plating.",
        personality: "Logical and unemotional.",
        powersAndAbilities: "Enhanced durability, high intelligence, hacking.",
        history: "Engineered to assist in advanced criminal operations.",
        relationships: "Serves technologically focused Villains."
    },
    {
        name: "Prisoner",
        species: "Varies",
        category: ["Character"],
        image: "images/prisoner.png",
        appearance: "Captured individual in a holding cell.",
        personality: "Varies depending on identity.",
        powersAndAbilities: "None while imprisoned.",
        history: "Apprehended during conflict with Ben or law enforcement.",
        relationships: "Linked to various Villain groups."
    },
    {
        name: "Driscoll",
        species: "Human",
        category: ["Villain"],
        image: "images/driscoll.png",
        appearance: "Middle-aged man with sharp facial features and a goatee.",
        personality: "Greedy and manipulative.",
        powersAndAbilities: "Strategic planning, weapon usage.",
        history: "Leader of the Forever Knights splinter faction.",
        relationships   : "Rival to Sir George and other Knight leaders."
    },
    {
        name: "Ma Vreedle",
        species: "Alien",
        category: ["Villain"],
        image: "images/ma_vreedle.png",
        appearance: "Large alien woman with a gruff appearance.",
        personality: "Bossy and domineering.",
        powersAndAbilities: "Leadership over Vreedle brothers, alien weaponry.",
        history: "Mother and leader of the Vreedle family.",
        relationships  : "Mother of Octagon and Rhomboid Vreedle."
    },
    {
        name: "Pa Vreedle",
        species: "Alien",
        category: ["Villain"],
        image: "images/pa_vreedle.png",
        appearance: "Tall alien male in western-style clothing.",
        personality: "Gruff and simple-minded.",
        powersAndAbilities: "Alien weaponry, durability.",
        history: "Father figure in the Vreedle clan.",
        relationships: "Husband to Ma Vreedle."
    },
    {
        name: "Pretty Boy",
        species: "Alien",
        category: ["Villain"],
        image: "images/pretty_boy.png",
        appearance: "Large alien with a somewhat smug expression.",
        personality: "Cocky and self-assured.",
        powersAndAbilities: "Strength and brawling skills.",
        history: "Member of the Vreedle family.",
        relationships: "Sibling to other Vreedle members."
    },
    {
        name: "Inspector 13",
        species: "Robot",
        category: ["Villain"],
        image: "images/inspector_13.png",
        appearance: "Mechanical being with a humanoid frame.",
        personality: "Methodical and thorough.",
        powersAndAbilities: "High precision, scanning technology.",
        history: "Known for systematically inspecting and sabotaging technology.",
        relationships: "Often hired for technical sabotage."
    },
    {
        name: "Grandma Verdona",
        species: "Anodite",
        category: ['Character'],
        image: "images/verdona1.png",
        appearance: "Elderly woman with white hair, often dressed in stylish clothes, and capable of transforming into a radiant, energy-based Anodite form.",
        personality: "Lively, charismatic, and a bit eccentric, with a strong love for her family.",
        powersAndAbilities: "Anodite energy manipulation, flight, teleportation, telekinesis, energy projection, and near-immortality.",
        history: "Ben and Gwen's grandmother, who left Earth long ago to live as a free Anodite in space. She occasionally visits her family, helping them with her vast cosmic powers.",
        relationships: "Grandmother to Ben and Gwen Tennyson, wife of Max Tennyson."
},








];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected. Populating characters...');
        await Character.deleteMany({});
        await Character.insertMany(characterData);
        console.log('Character database seeded successfully!');
    } catch (err) {
        console.error('Error seeding character database:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
    }
};

seedDB();