require('dotenv').config();

const mongoose = require('mongoose');
const Alien = require('./models/alien');
const Character = require('./models/character');
const Planet = require('./models/planet');
const Episode = require('./models/episode');


const alienData = [

     {
        name: 'Heatblast',
        species: 'Pyronite',
        homePlanet: 'Pyros',
        series: ['Classic', 'Omniverse'],
        image: 'images/heatblast.png',
        weaknesses: ['Large amounts of water', 'Vulnerability to being extinguished'],
        appearance: 'A magma-based lifeform whose body is composed of a bright inner magma body covered by reddish-brown coal-like rocks.',
        personality: 'Heatblast is typically hot-headed and quick to action, with a fiery personality to match his powers. He is brave and confident in his abilities.',
        powersAndAbilities: 'Heatblast has the ability to generate and manipulate intense heat and fire from his body. He can form fireballs, absorb heat, and achieve flight by shooting fire from his feet.',
        history: 'Heatblast was the first alien transformation Ben ever used after discovering the Omnitrix.'
    },
    {
        name: 'Diamondhead',
        species: 'Petrosapien',
        homePlanet: 'Petropia',
        series: ['Classic', 'Alien Force', 'Omniverse'],
        image: 'images/diamondhead.png',
        weaknesses: ['Vulnerable to strong sonic vibrations which can shatter him'],
        appearance: 'A being composed of extremely durable, pale green Taydenite crystals. His body is crystalline, with a sharp, pointed head and blades on his arms.',
        personality: 'Calm, serious, and mature. Diamondhead is a versatile and intelligent fighter who often thinks strategically in battle.',
        powersAndAbilities: 'Diamondhead can manipulate his crystalline body to create crude weapons like swords and shields, fire crystal shards, and regenerate from significant damage.',
        history: 'An essential alien in the Omnitrix, his DNA was used by Ben to restore the entire Petrosapien species after their home world was destroyed.'
    },
    


      {
        name: 'Humungousaur',
        species: 'Vaxasaurian',
        homePlanet: 'Terradino',
        series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
        image: 'images/humungousaur.png',
        abilities: ['Enhanced Strength', 'Size Alteration', 'Enhanced Durability', 'Powerful Tail'],
        weaknesses: ['Large size makes him an easy target', 'Vulnerable to electricity'],
        ultimateForm: 'Ultimate Humungousaur',
        ultimateImage: 'images/ultimate_humungousaur.png',
        ultimateAbilities: ['Can turn hands into missile launchers', 'Shell-like plated armor', 'Greatly enhanced strength'],
         personality: 'Aggressive and bad-tempered, Humungousaur enjoys smashing things. Despite this, he is undeniably heroic.',
         powersAndAbilities: 'Humungousaur possesses immense super-strength and a highly durable, armored hide. His key ability is to increase his size up to 60 feet tall, which further increases his strength.',
         history: 'One of Ben\'s go-to aliens for heavy-duty combat, first unlocked in the Alien Force series.'
    

    },

  
   
    {
        name: 'Four Arms',
        species: 'Tetramand',
        homePlanet: 'Khoros',
        series: ['Classic', 'Ultimate Alien', 'Omniverse'],
        image: 'images/fourarms.png',
        abilities: ['Superhuman Strength', 'Enhanced Durability', 'Four-armed Combat', 'Sonic Clap'],
        weaknesses: ['Bulky size', 'Vulnerable to electricity']
    },
    {
        name: 'XLR8',
        species: 'Kineceleran',
        homePlanet: 'Kinet',
        series: ['Classic', 'Ultimate Alien', 'Omniverse'],
        image: 'images/xlr8.png',
        abilities: ['Superhuman Speed', 'Enhanced Reflexes', 'Sharp Claws', 'Can run on water'],
        weaknesses: ['Slippery surfaces', 'Vulnerable to strong magnetic fields']
    },
   
   {
    name: 'Cannonbolt',
    species: 'Arburian Pelarota',
    homePlanet: 'Arburia',
    series: ['Classic', 'Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/cannonbolt.png',
    abilities: ['Rolling Attack', 'Durable Shell', 'High-Speed Spin'],
    weaknesses: ['Slippery surfaces reduce control', 'Hard to stop when rolling at full speed'],
    ultimateForm: 'Ultimate Cannonbolt',
    ultimateImage: 'images/ultimate_cannonbolt.png',
    ultimateAbilities: ['Spike-Covered Shell', 'Increased Rolling Damage', 'Shockwave Spin Attack']
},
    {
    name: 'Swampfire',
    species: 'Methanosian',
    homePlanet: 'Methanos',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/swampfire.png',
    abilities: ['Plant Manipulation', 'Regeneration', 'Pyrokinesis', 'Superhuman Strength'],
    weaknesses: ['Cold temperatures slow him down', 'Vulnerable to plant-based diseases'],
    ultimateForm: 'Ultimate Swampfire',
    ultimateImage: 'images/ultimate_swampfire.png',
    ultimateAbilities: ['Enhanced Fire Control', 'Explosive Fireballs', 'No plant decay with fire attacks']
},
    

{
    name: 'AmpFibian',
    species: 'Amperi',
    homePlanet: 'Amperos',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/ampfibian.png',
    abilities: ['Electrokinesis', 'Intangibility', 'Underwater Breathing', 'Energy Absorption'],
    weaknesses: ['Vulnerable to insulation', 'Cannot survive long outside water without hydration']
},


{
    name: 'ChamAlien',
    species: 'Merlinisapien',
    homePlanet: 'Anur Khufos',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/chamalien.png',
    abilities: ['Invisibility', 'Shapeshifting', 'Stealth'],
    weaknesses: ['Limited offensive power', 'Can still be tracked by scent or heat vision']
},

{
    name: 'Juryrigg',
    species: 'Unknown',
    homePlanet: 'Unknown',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/juryrig.png',
    abilities: ['Mechanical Genius', 'Super Speed (hands only)', 'Small Size for infiltration'],
    weaknesses: ['No offensive power', 'Hyperactive and easily distracted']
},

{
    name: 'Mole-Stache',
    species: 'Unknown',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/mole_stache.png',
    abilities: ['Hair Manipulation', 'Superhuman Strength', 'Burrowing'],
    weaknesses: ['Hair can be cut or burned', 'Not very fast']
},
{
    name: 'Pesky Dust',
    species: 'Nemuina',
    homePlanet: 'Nemuina',
    series: ['Omniverse'],
    image: 'images/peskydust.png',
    abilities: ['Dream Manipulation', 'Illusion Creation', 'Flight'],
    weaknesses: ['Weak in direct combat', 'Illusions fail against mind-protected beings']
},
{
    name: 'Walkatrout',
    species: 'Ichthyohuman',
    homePlanet: 'Piscciss',
    series: ['Omniverse'],
    image: 'images/walkatrout.png',
    abilities: ['Aquatic Adaptation', 'Slippery Body', 'Underwater Breathing'],
    weaknesses: ['Not strong on land', 'Vulnerable to dehydration']
},
{
    name: 'The Worst',
    species: 'Atrocian',
    homePlanet: 'Atrocian A',
    series: ['Omniverse'],
    image: 'images/theworst.png',
    abilities: ['Indestructibility', 'Pain Resistance', 'Immense Stamina'],
    weaknesses: ['Very weak strength', 'Easily overpowered physically']
},


{
    name: 'Crashhopper',
    species: 'Orthopterran',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/crashhopper.png',
    abilities: ['Super Leaping', 'Kinetic Energy Release', 'Wall Climbing'],
    weaknesses: ['Vulnerable during landing', 'Short-range mobility']
},
{
    name: 'Astrodactyl',
    species: 'Lepidopterran',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/astrodactyl.png',
    abilities: ['Flight', 'Energy Ribbons', 'Enhanced Vision'],
    weaknesses: ['Wings are vulnerable to damage', 'Limited ground combat ability']
},


{
    name: 'Atomix',
    species: 'Unknown',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/atomix.png',
    abilities: ['Atomic Energy Manipulation', 'Superhuman Strength', 'Energy Blasts'],
    weaknesses: ['Overconfidence', 'Can cause collateral damage']
},


{
    name: 'Gax',
    species: 'Chimera Sui Generis',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/gax.png',
    abilities: ['Super Strength', 'Energy Blasts', 'Flight'],
    weaknesses: ['Arrogance', 'Overuse of power can tire him']
},
{
    name: 'Gutrot',
    species: 'Unknown',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/gutrot.png',
    abilities: ['Gas Generation and Manipulation', 'Toxic Gas Attacks'],
    weaknesses: ['Gas disperses in open spaces', 'Gases can backfire in enclosed areas']
},


{
    name: 'Shocksquatch',
    species: 'Gimlinopithecus',
    homePlanet: 'Pattersonea',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/shocksquatch.png',
    abilities: ['Electrokinesis', 'Super Strength', 'Enhanced Jumping Ability'],
    weaknesses: ['Electricity can be grounded', 'Not immune to his own electrical attacks']
},

    {
        name: 'Chromastone',
        species: 'Crystalsapien',
        homePlanet: 'Petropia',
        series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
        image: 'images/chromastone.png',
        abilities: ['Energy Absorption & Redirection', 'Ultraviolet Beams', 'Flight', 'Extreme Durability'],
        weaknesses: ['Energy overload', 'Vulnerable to being depleted of energy']
    },


    {
    name: 'Kickin Hawk',
    species: 'Unknown',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/kickinhawk.png',
    abilities: ['Martial Arts Mastery', 'Powerful Kicks', 'Enhanced Agility'],
    weaknesses: ['Limited ranged attacks', 'Relies on close combat']
},

{
    name: 'Whampire',
    species: 'Vladat',
    homePlanet: 'Anur Vladias',
    series: ['Omniverse'],
    image: 'images/whampire.png',
    abilities: ['Hypnosis', 'Flight', 'Energy Drain'],
    weaknesses: ['Vulnerable to sunlight', 'Can be overpowered physically']
},


{
    name: 'Shock Rock',
    species: 'Fulmini',
    homePlanet: 'Fulmas',
    series: ['Reboot'],
    image: 'images/shockrock.png',
    abilities: ['Electromagnetic Manipulation', 'Energy Projection', 'Levitation'],
    weaknesses: ['Overload risk', 'Magnetic interference']
},
{
    name: 'Slapback',
    species: 'Ekoplektoid',
    homePlanet: 'Keppler-22b',
    series: ['Reboot'],
    image: 'images/slapback.png',
    abilities: ['Self-Duplication', 'Enhanced Strength', 'Durability'],
    weaknesses: ['Splitting reduces size of duplicates', 'Coordination between duplicates needed']
},

{
    name: 'Glitch',
    species: 'Galvanic Mechamorph/Human Hybrid',
    homePlanet: 'Galvan B',
    series: ['Reboot'],
    image: 'images/glitch.png',
    abilities: ['Technological Manipulation', 'Shape-Shifting', 'Energy Projection'],
    weaknesses: ['Magnetic fields', 'Vulnerable to extreme heat']
},
{
    name: 'Overflow',
    species: 'Cascan',
    homePlanet: 'Cascareau',
    series: ['Reboot'],
    image: 'images/overflow.png',
    abilities: ['Hydrokinesis', 'High-Pressure Water Blasts', 'Underwater Breathing'],
    weaknesses: ['Limited range on land', 'Dependent on water availability']
},
{
    name: 'Hot Shot',
    species: 'Pyronite',
    homePlanet: 'Pyros',
    series: ['Reboot'],
    image: 'images/hotshot.png',
    abilities: ['Pyrokinesis', 'Flight', 'Heat Resistance'],
    weaknesses: ['Vulnerable to cold', 'Fire can be extinguished by water']
},


{
    name: 'Toepick',
    species: 'Unknown',
    homePlanet: 'Unknown',
    series: ['Omniverse'],
    image: 'images/toepick.png',
    abilities: ['Fear Induction', 'Intimidation'],
    weaknesses: ['Powers require visual contact', 'Ineffective against the fearless']
},

{
    name: 'Echo Echo',
    species: 'Sonorosian',
    homePlanet: 'Sonorosia',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/echo.png',
    abilities: ['Sonic Screams', 'Duplication', 'Sound Manipulation', 'Communication via sound waves'],
    weaknesses: ['Soundproof barriers block attacks', 'High-pitched noises can disrupt him'],
    ultimateForm: 'Ultimate Echo Echo',
    ultimateImage: 'images/ultimate_echo.png',
    ultimateAbilities: ['Technokinesis', 'Sonic Discs', 'Upgraded Armor-Like Body']
},
{
    name: 'Way Big',
    species: 'To\'kustar',
    homePlanet: 'Cosmos',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/waybig.png',
    abilities: ['Gigantic Size', 'Super Strength', 'Cosmic Ray Projection'],
    weaknesses: ['Large size makes him an easy target', 'Limited in enclosed spaces'],
    ultimateForm: 'Ultimate Way Big',
    ultimateImage: 'images/ultimate_waybig.png',
    ultimateAbilities: ['Enhanced Cosmic Rays', 'Armored Body', 'Greater Size and Strength']
},
{
    name: 'Wrath',
    species: 'Appoplexian',
    homePlanet: 'Appoplexia',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse', 'Reboot'],
    image: 'images/wrath.png',
    abilities: ['Super strength', 'High durability', 'Sharp claws', 'Combat expertise'],
    weaknesses: ['Hot-headed', 'Acts before thinking']
},
{
    name: 'Alien X',
    species: 'Celestialsapien',
    homePlanet: 'Forge of Creation',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/alienx.png',
    weaknesses: ['Requires agreement between two personalities (Bellicus and Serena) to act, often resulting in inaction.'],
    appearance: 'A humanoid alien with a pitch-black body covered in tiny white stars, resembling a walking galaxy. He has three horns on his head and no visible mouth.',
    personality: 'Alien X is often inert due to the conflicting personalities of Bellicus (the voice of rage) and Serena (the voice of compassion), who must debate and agree on any action.',
    powersAndAbilities: 'As a Celestialsapien, Alien X is an omnipotent being capable of manipulating reality, time, and space on a universal scale, making him Ben\'s most powerful transformation.',
    history: 'Celestialsapiens are born in the Forge of Creation, a hidden realm outside the known universe. Ben first used Alien X to save himself from a dam collapse.'
},
{
    name: 'Terraspin',
    species: 'Geochelone Aerio',
    homePlanet: 'Apeperia',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/terraspin.png',
    abilities: ['Wind Generation', 'Flight via Spinning', 'Strong Shell Protection'],
    weaknesses: ['Shell can be flipped', 'Spinning attacks are predictable'],
    ultimateForm: 'Ultimate Terraspin',
    ultimateImage: 'images/ultimate_terraspin.png',
    ultimateAbilities: ['Hurricane-Level Wind Power', 'Enhanced Armor', 'Greater Spin Speed']
},
{
    name: 'Stinkfly',
    species: 'Lepidopterran',
    homePlanet: 'Lepidopterra',
    series: ['Classic', 'Alien Force', 'Ultimate Alien', 'Omniverse', 'Reboot'],
    image: 'images/stinkfly.png',
    abilities: ['Flight', 'Slime/adhesive spray', 'Agility'],
    weaknesses: ['Wings are vulnerable', 'Limited physical strength']
},

{
    name: 'Jetray',
    species: 'Aerophibian',
    homePlanet: 'Aeropela',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/jetray.png',
    abilities: ['Flight', 'Neuroshock Blasts', 'Underwater Breathing', 'Supersonic Speed'],
    weaknesses: ['Needs open space for max speed', 'Less agile in tight indoor areas'],
    ultimateForm: 'Ultimate Jetray',
    ultimateImage: 'images/ultimate_jetray.png',
    ultimateAbilities: ['Enhanced Speed', 'Shockwave Wing Flaps', 'Stronger Neuroshock Blasts']
},
{
    name: 'Big Chill',
    species: 'Necrofriggian',
    homePlanet: 'Kylmyys',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/bigchill.png',
    abilities: ['Cryokinesis', 'Intangibility', 'Flight', 'Invisibility'],
    weaknesses: ['Heat weakens abilities', 'Cannot pass through airtight barriers'],
    ultimateForm: 'Ultimate Big Chill',
    ultimateImage: 'images/ultimate_bigchill.png',
    ultimateAbilities: ['Pyrokinesis with Blue Flames', 'Enhanced Strength', 'Hot and Cold Blast Combo']
},
{
    name: 'Spidermonkey',
    species: 'Arachnichimp',
    homePlanet: 'Aranhaschimmia',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/spidermonkey.png',
    abilities: ['Wall-Crawling', 'Web Generation', 'Enhanced Agility', 'Prehensile Tail'],
    weaknesses: ['Webs can be burned or frozen', 'Lower durability compared to stronger aliens'],
    ultimateForm: 'Ultimate Spidermonkey',
    ultimateImage: 'images/ultimate_spidermonkey.png',
    ultimateAbilities: ['Extra Arms', 'Stronger Webs', 'Increased Strength']
},
{
    name: 'Armodrillo',
    species: 'Talpaedan',
    homePlanet: 'Poiana Luncas',
    series: ['Ultimate Alien', 'Omniverse', 'Reboot'],
    image: 'images/armodrillo.png',
    abilities: ['Drill arms', 'Shockwave creation', 'Enhanced digging'],
    weaknesses: ['Not agile in air or water']
},
{
    name: 'Brainstorm',
    species: 'Cerebrocrustacean',
    homePlanet: 'Encephalonus IV',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse', 'Reboot'],
    image: 'images/brainstorm.png',
    abilities: ['Super intelligence', 'Electric blasts', 'Force fields'],
    weaknesses: ['Overconfidence', 'Shell vulnerable when open']
},
{
    name: 'Upchuck',
    species: 'Gourmand',
    homePlanet: 'Peptos XII',
    series: ['Classic', 'Alien Force', 'Ultimate Alien', 'Omniverse', 'Reboot'],
    image: 'images/upchuk.png',
    abilities: ['Ingest matter', 'Convert to explosive energy', 'Long tongues'],
    weaknesses: ['Limited combat strength without objects to eat']
},
{
    name: 'The Mummy (Snare-oh)',
    species: 'Thep Khufan',
    homePlanet: 'Anur Khufos',
    series: ['Classic', 'Omniverse'],
    image: 'images/mummy.png',
    abilities: ['Shapeshifting bandages', 'Regeneration', 'High agility'],
    weaknesses: ['Bandages can be restrained or burned']
},
{
    name: 'Goop',
    species: 'Viscosian',
    homePlanet: 'Unknown',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse', 'Reboot'],
    image: 'images/goop.png',
    abilities: ['Shapeshifting slime body', 'Acid secretion', 'Controlled by Anti-Gravity Projector'],
    weaknesses: ['Vulnerable if projector is destroyed or removed']
},
{
    name: 'Buzzshock',
    species: 'Nosedeenian',
    homePlanet: 'Nosideen Quasar',  
    series: ['Classic', 'Omniverse', 'Reboot'],
    image: 'images/buzzshock.png',
    abilities: ['Electricity manipulation', 'Transform into pure energy', 'Possess machines'],
    weaknesses: ['Insulated materials block electrical attacks']
},


    {
    name: 'Lodestar',
    species: 'Biosovortian',
    homePlanet: 'Unknown',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/lodestar.png',
    abilities: ['Magnetism Manipulation', 'Levitation of Metal Objects', 'Floating Head'],
    weaknesses: ['Magnetism is useless on non-metal enemies', 'Physical body is vulnerable when head is detached'],
    ultimateForm: 'Ultimate Lodestar',
    ultimateImage: 'images/ultimate_lodestar.png',
    ultimateAbilities: ['Greater Magnetic Power', 'Magnetic Force Fields', 'Enhanced Armor']
},
    {
        name: 'Water Hazard',
        species: 'Orishan',
        homePlanet: 'Kiusana',
        series: ['Ultimate Alien', 'Omniverse'],
        image: 'images/waterhazard.png',
        abilities: ['Hydrokinesis', 'Pressurized Water Blasts', 'Exoskeleton Armor', 'Moisture Absorption'],
        weaknesses: ['Vulnerable to energy attacks', 'Can be dehydrated']
    },
    {
    name: 'NRG',
    species: 'Prypiatosian-B',
    homePlanet: 'Prypiatos',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/nrg.png',
    abilities: ['Radiation Emission', 'Heat Generation', 'Energy Blasts'],
    weaknesses: ['Suit restricts mobility', 'Radiation can harm allies if uncontrolled'],
    
},
    {
        name: 'Feedback',
        species: 'Conductoid',
        homePlanet: 'Teslavorr',
        series: ['Omniverse'],
        image: 'images/feedback.png',
        abilities: ['Energy Absorption & Redirection', 'Electro-Kinesis', 'Enhanced Agility'],
        weaknesses: ['Needs to absorb energy to use powers', 'Can be overloaded']
    },
    {
        name: 'Gravattack',
        species: 'Galilean',
        homePlanet: 'Keplorr',
        series: ['Omniverse'],
        image: 'images/gravattack.png',
        abilities: ['Gravikinesis', 'Creating a planetary orbit', 'Black Hole Generation', 'Enhanced Durability'],
        weaknesses: ['Large body is a target', 'Vulnerable to energy attacks hitting his core']
    },

    {
    name: 'Grey Matter',
    species: 'Galvan',
    homePlanet: 'Galvan Prime',
    series: ['Classic', 'Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/greymatter.png',
    abilities: ['Genius-level intellect', 'Shrinking size', 'Amphibious', 'Technopathy'],
    weaknesses: ['Physically weak due to small size', 'Vulnerable to electricity']
},
{
    name: 'Ghostfreak',
    species: 'Ectonurite',
    homePlanet: 'Anur Phaetos',
    series: ['Classic', 'Omniverse'],
    image: 'images/ghostfreak.png',
    abilities: ['Intangibility', 'Invisibility', 'Possession', 'Phasing'],
    weaknesses: ['Weak in sunlight when revealed', 'Limited control when exposed']
},
{
    name: 'Ripjaws',
    species: 'Pisciss Volann',
    homePlanet: 'Piscciss',
    series: ['Classic'],
    image: 'images/ripjaws.png',
    abilities: ['Underwater breathing', 'Sharp teeth and jaws', 'Strong swimmer'],
    weaknesses: ['Cannot breathe on land for long', 'Limited mobility on ground']
},
{
    name: 'Upgrade',
    species: 'Galvanic Mechamorph',
    homePlanet: 'Galvan B',
    series: ['Classic', 'Omniverse'],
    image: 'images/upgrade.png',
    abilities: ['Technological merging', 'Cybernetic manipulation', 'Shape-shifting'],
    weaknesses: ['Dependent on tech presence', 'Can be overloaded by advanced tech']
},
{
    name: 'Wildmutt',
    species: 'Vulpimancer',
    homePlanet: 'Vulpin',
    series: ['Classic', 'Omniverse'],
    image: 'images/wildmutt.png',
    abilities: ['Enhanced hearing and smell', 'Sharp claws', 'Super agility'],
    weaknesses: ['Blind—relies on other senses', 'Vulnerable to loud noises or scent masking']
},
{
    name: 'Wildvine',
    species: 'Florauna',
    homePlanet: 'Florauna',
    series: ['Classic', 'Omniverse'],
    image: 'images/wildvine.png',
    abilities: ['Vine stretching and regeneration', 'Photosynthesis for energy', 'Camouflage'],
    weaknesses: ['Weak to fire', 'Slow movement on ground']
},
{
    name: 'Spitter',
    species: 'Spheroid',
    homePlanet: 'Unknown',
    series: ['Classic'],
    image: 'images/spitter.png',
    abilities: ['Spits corrosive goo', 'Rapid rolling mobility'],
    weaknesses: ['Fragile body', 'Ranged-only combat focus']
},
{
    name: 'Eye Guy',
    species: 'Opticoid',
    homePlanet: 'Objuso',
    series: ['Classic'],
    image: 'images/eyeguy.png',
    abilities: ['Multi-beam eye lasers', 'Enhanced vision', 'Rolling maneuverability'],
    weaknesses: ['Eyes are fragile', 'Limited physical strength']
},
{
    name: 'Ditto',
    species: 'Splixson',
    homePlanet: 'Splix',
    series: ['Classic'],
    image: 'images/ditto.png',
    abilities: ['Self-duplication', 'Swarm overwhelm'],
    weaknesses: ['Low strength per individual', 'Coordinating clones can be tricky']
},

{
    name: 'Blitzwolfer',
    species: 'Loboan',
    homePlanet: 'Loboan',
    series: ['Classic'],
    image: 'images/blitzwolfer.png',
    abilities: ['Super strength', 'Enhanced senses', 'Sonic howl'],
    weaknesses: ['Sonic attacks trigger a cooldown', 'Muscular bulk reduces agility']
},
{
    name: 'Articguana',
    species: 'Polar Manzardill',
    homePlanet: 'Polar Manzardill',
    series: ['Classic'],
    image: 'images/articguana.png',
    abilities: ['Thermokinesis (freeze breath)', 'Tail as a weapon', 'Cold resistance'],
    weaknesses: ['Vulnerable to heat', 'Slow movement outside cold environments']
},
{
    name: 'Frankenstrike',
    species: 'Transylian',
    homePlanet: 'Transylia',
    series: ['Classic'],
    image: 'images/frankenstrike.png',
    abilities: ['Electrical absorption', 'Reassembled parts', 'Super strength'],
    weaknesses: ['Can short-circuit from overload', 'Body needs maintenance']
},

{
    name: 'Bullfrag',
    species: 'Incursean',
    homePlanet: 'Incursea',
    series: ['Classic'],
    image: 'images/bullfrag.png',
    abilities: ['Acid spit', 'Amphibious', 'Powerful jaws'],
    weaknesses: ['Slow on land', 'Limited ranged abilities']
},
{
    name: 'Ball Weevil',
    species: 'Insectoid',
    homePlanet: 'Unknown',
    series: ['Classic'],
    image: 'images/ballweevil.png',
    abilities: ['Ball transformation for movement', 'Sticky secretions'],
    weaknesses: ['Fragile, small frame', 'Ranged attacks limited']
},


  {
    name: 'Nanomech',
    species: 'Nanochip-Human Hybrid',
    homePlanet: 'Revonnah',
    series: ['Alien Force', 'Ultimate Alien', 'Omniverse'],
    image: 'images/nanomech.png',
    abilities: ['Size Manipulation', 'Flight', 'Energy Projection', 'Hive Mind Resistance'],
    weaknesses: ['Physically Fragile', 'Limited Strength']
},

{
    name: 'Fasttrack',
    species: 'Citrakayah',
    homePlanet: 'Chalybeas',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/fasttrack.png',
    abilities: ['Super Speed', 'Enhanced Reflexes', 'Enhanced Agility', 'Accelerated Healing'],
    weaknesses: ['Can be Tripped', 'Slower Reaction to Sudden Obstacles']
},
{
    name: 'Eatle',
    species: 'Oryctini',
    homePlanet: 'Unknown',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/eatle.png',
    abilities: ['Super Strength', 'Arm Cannon Energy Blasts', 'Tough Exoskeleton', 'Burrowing'],
    weaknesses: ['Slow Movement', 'Large Size Limits Stealth']
},
{
    name: 'Clockwork',
    species: 'Chronosapien',
    homePlanet: 'Chronia',
    series: ['Ultimate Alien', 'Omniverse'],
    image: 'images/clockwork.png',
    abilities: ['Time Manipulation', 'Time Ray Projection', 'Enhanced Durability'],
    weaknesses: ['Mechanical Components Vulnerable to Damage']
},
];





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







const episodeData = [
   



    // Season 1
    {
        title: 'And Then There Were 10',
        series: 'Classic',
        season: 1,
        episode: 1,
        synopsis: 'While on summer vacation, Ben Tennyson discovers the Omnitrix, an alien watch that allows him to transform into 10 different aliens, and his life changes forever.',
        aliens: ['Heatblast', 'Wildmutt', 'Diamondhead', 'XLR8', 'Four Arms'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Vilgax'],
    },
    {
        title: 'Washington B.C.',
        series: 'Classic',
        season: 1,
        episode: 2,
        synopsis: 'Dr. Animo brings dinosaurs back to life in Washington D.C. Ben must learn what it truly means to be a hero to stop him.',
        aliens: ['Four Arms', 'Grey Matter', 'Ripjaws', 'Stinkfly'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Dr. Animo'],
    },
    {
        title: 'The Krakken',
        series: 'Classic',
        season: 1,
        episode: 3,
        synopsis: 'The Tennysons encounter a lake monster, but Ben discovers it\'s a mother protecting her eggs from a poacher.',
        aliens: ['Ripjaws', 'XLR8', 'Four Arms'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
    },
    {
        title: 'Permanent Retirement',
        series: 'Classic',
        season: 1,
        episode: 4,
        synopsis: 'Ben, Gwen, and Max visit Aunt Vera, only to find her retirement community has been taken over by shapeshifting aliens called the Limax.',
        aliens: ['Upgrade', 'Ghostfreak', 'Heatblast', 'Wildmutt'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
    },
    {
        title: 'Hunted',
        series: 'Classic',
        season: 1,
        episode: 5,
        synopsis: 'Vilgax hires three bounty hunters—Kraab, Sixsix, and Tetrax—to retrieve the Omnitrix from Ben.',
        aliens: ['Diamondhead', 'XLR8', 'Four Arms'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
    },
    {
        title: 'Tourist Trap',
        series: 'Classic',
        season: 1,
        episode: 6,
        synopsis: 'Ben accidentally unleashes mischievous electrical aliens called Megawhatts in a tourist trap town.',
        aliens: ['XLR8', 'Stinkfly', 'Diamondhead'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
    },
    {
        title: 'Kevin 11',
        series: 'Classic',
        season: 1,
        episode: 7,
        synopsis: 'Ben befriends a troubled boy named Kevin who has the power to absorb energy, leading to a dangerous new foe.',
        aliens: ['Four Arms', 'Heatblast', 'Stinkfly', 'Upgrade'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Kevin Levin'],
    },
    {
        title: 'The Alliance',
        series: 'Classic',
        season: 1,
        episode: 8,
        synopsis: 'A local gang leader merges with Vilgax\'s destroyed drones, creating a new cyborg threat for Ben to face.',
        aliens: ['Upgrade', 'XLR8'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
    },
    {
        title: 'Last Laugh',
        series: 'Classic',
        season: 1,
        episode: 9,
        synopsis: 'Ben must conquer his fear of clowns to stop the sinister Zombozo from draining the happiness from his victims.',
        aliens: ['Ghostfreak', 'Wildmutt', 'Four Arms'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Zombozo'],
    },
    {
        title: 'Lucky Girl',
        series: 'Classic',
        season: 1,
        episode: 10,
        synopsis: 'Gwen finds a magical charm that grants her incredible luck, turning her into the superhero "Lucky Girl."',
        aliens: ['Wildmutt', 'XLR8', 'Diamondhead'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Hex'],
    },
    {
        title: 'A Small Problem',
        series: 'Classic',
        season: 1,
        episode: 11,
        synopsis: 'Ben gets stuck as Grey Matter and is captured by an alien conspiracy theorist.',
        aliens: ['Grey Matter', 'Four Arms'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
    },
    {
        title: 'Side Effects',
        series: 'Classic',
        season: 1,
        episode: 12,
        synopsis: 'A summer cold has strange and unpredictable effects on Ben\'s alien transformations.',
        aliens: ['Heatblast', 'Diamondhead', 'Four Arms'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
    },
    {
        title: 'Secrets',
        series: 'Classic',
        season: 1,
        episode: 13,
        synopsis: 'Vilgax, now fully recovered, arrives on Earth to take the Omnitrix himself, revealing more about Grandpa Max\'s past.',
        aliens: ['XLR8', 'Upgrade', 'Heatblast'],
        characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Vilgax'],
    },

    // Season 2 (episodes 1-13)
    {
    title: 'Truth',
    series: 'Classic',
    season: 2,
    episode: 1,
    synopsis: 'Ben meets an alien named Tetrax who reveals more about the Omnitrix and tests Ben’s ability to wield it responsibly.',
    aliens: ['Diamondhead', 'Four Arms', 'Upgrade'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Tetrax'],
},
{
    title: 'The Big Tick',
    series: 'Classic',
    season: 2,
    episode: 2,
    synopsis: 'A giant alien tick called the Great One is heading toward Earth, and only Grey Matter can stop it.',
    aliens: ['Grey Matter', 'Heatblast'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Framed',
    series: 'Classic',
    season: 2,
    episode: 3,
    synopsis: 'Kevin 11 returns and frames Ben for a series of crimes, forcing Ben to clear his name.',
    aliens: ['Diamondhead', 'Upgrade', 'Wildmutt'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Kevin Levin'],
},
{
    title: 'Gwen 10',
    series: 'Classic',
    season: 2,
    episode: 4,
    synopsis: 'In an alternate timeline where Gwen found the Omnitrix, Ben must work with her to defeat Vilgax.',
    aliens: ['Heatblast', 'XLR8', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Vilgax'],
},
{
    title: 'Grudge Match',
    series: 'Classic',
    season: 2,
    episode: 5,
    synopsis: 'Ben is abducted into an alien gladiator arena where he must fight alongside a new ally, Tetrax.',
    aliens: ['Four Arms', 'Wildmutt', 'Upgrade'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Tetrax'],
},
{
    title: 'The Galactic Enforcers',
    series: 'Classic',
    season: 2,
    episode: 6,
    synopsis: 'Ben meets the Galactic Enforcers, a team of alien superheroes, but clashes with their methods.',
    aliens: ['Diamondhead', 'Upgrade', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Ultimos', 'Synaptak', 'Tini'],
},
{
    title: 'Camp Fear',
    series: 'Classic',
    season: 2,
    episode: 7,
    synopsis: 'Strange alien spores overrun a summer camp, forcing Ben and Gwen to investigate.',
    aliens: ['Wildmutt', 'Four Arms', 'Heatblast'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Ultimate Weapon',
    series: 'Classic',
    season: 2,
    episode: 8,
    synopsis: 'Grandpa Max’s past resurfaces when an alien bounty hunter pursues a dangerous weapon.',
    aliens: ['Diamondhead', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Tough Luck',
    series: 'Classic',
    season: 2,
    episode: 9,
    synopsis: 'Hex returns, but Gwen discovers she can counter his magic with her new Lucky Girl identity.',
    aliens: ['Stinkfly', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Hex', 'Charmcaster'],
},
{
    title: 'They Lurk Below',
    series: 'Classic',
    season: 2,
    episode: 10,
    synopsis: 'The Tennysons battle a mutant sea monster terrorizing an oil rig.',
    aliens: ['Ripjaws', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Ghostfreaked Out',
    series: 'Classic',
    season: 2,
    episode: 11,
    synopsis: 'Ghostfreak escapes the Omnitrix and tries to possess Ben, becoming one of his most terrifying enemies.',
    aliens: ['XLR8', 'Heatblast', 'Ghostfreak'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Ghostfreak'],
},
{
    title: 'Dr. Animo and the Mutant Ray',
    series: 'Classic',
    season: 2,
    episode: 12,
    synopsis: 'Dr. Animo returns with a mutation ray and turns humans into freakish monsters.',
    aliens: ['Four Arms', 'Wildmutt', 'Upgrade'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Dr. Animo'],
},
{
    title: 'Back with a Vengeance',
    series: 'Classic',
    season: 2,
    episode: 13,
    synopsis: 'Kevin and Vilgax team up to finally take down Ben, leading to one of his hardest battles yet.',
    aliens: ['Heatblast', 'Diamondhead', 'Upgrade'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Kevin Levin', 'Vilgax'],
},


    // Season 3 (episodes 1-13)
    {
    title: 'Ben 10,000',
    series: 'Classic',
    season: 3,
    episode: 1,
    synopsis: 'During a trip to the future, Ben meets his 10-year-old cousin Gwen and his older self, Ben 10,000, who has access to thousands of aliens.',
    aliens: ['Four Arms', 'Heatblast', 'Spitter', 'Future Aliens'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Future Ben (Ben 10,000)', 'Future Gwen'],
},
{
    title: 'Midnight Madness',
    series: 'Classic',
    season: 3,
    episode: 2,
    synopsis: 'Ben attends a hypnotist’s show and ends up under mind control, forcing Gwen and Max to stop him from causing chaos.',
    aliens: ['Wildmutt', 'Upgrade', 'Stinkfly'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'A Change of Face',
    series: 'Classic',
    season: 3,
    episode: 3,
    synopsis: 'Charmcaster switches bodies with Gwen to steal the Omnitrix, leaving Gwen trapped in her body.',
    aliens: ['Upgrade', 'Four Arms', 'Wildmutt'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Charmcaster'],
},
{
    title: 'Merry Christmas',
    series: 'Classic',
    season: 3,
    episode: 4,
    synopsis: 'The Tennysons stop at a Christmas village where Ben discovers the evil Krampus is behind the celebrations.',
    aliens: ['Heatblast', 'Wildmutt', 'Grey Matter'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Krampus'],
},
{
    title: 'Benwolf',
    series: 'Classic',
    season: 3,
    episode: 5,
    synopsis: 'A werewolf-like alien scratches Ben, infecting him with strange powers and causing the Omnitrix to scan a new alien.',
    aliens: ['Wildmutt', 'Four Arms', 'Benwolf (Blitzwolfer)'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Game Over',
    series: 'Classic',
    season: 3,
    episode: 6,
    synopsis: 'Ben gets trapped inside a virtual reality video game and must defeat its bosses to escape.',
    aliens: ['XLR8', 'Four Arms', 'Upgrade'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Super Alien Hero Buddy Adventures',
    series: 'Classic',
    season: 3,
    episode: 7,
    synopsis: 'Ben discovers a cartoon show that is strangely similar to his own life, only to realize aliens are behind it.',
    aliens: ['Diamondhead', 'Heatblast', 'Wildmutt'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Under Wraps',
    series: 'Classic',
    season: 3,
    episode: 8,
    synopsis: 'Ben, Gwen, and Max uncover an alien mummy that awakens and threatens to add new DNA to the Omnitrix.',
    aliens: ['Four Arms', 'XLR8', 'Benmummy'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'The Unnaturals',
    series: 'Classic',
    season: 3,
    episode: 9,
    synopsis: 'A robot baseball team is discovered, but they turn out to be an alien plot in disguise.',
    aliens: ['Upgrade', 'XLR8', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Monster Weather',
    series: 'Classic',
    season: 3,
    episode: 10,
    synopsis: 'Strange weather patterns created by aliens cause chaos, and Ben must uncover their source.',
    aliens: ['Stinkfly', 'Heatblast', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'The Return',
    series: 'Classic',
    season: 3,
    episode: 11,
    synopsis: 'Vilgax returns stronger than ever, and the Tennysons discover Ghostfreak has also survived.',
    aliens: ['Diamondhead', 'Heatblast', 'Ghostfreak'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Vilgax', 'Ghostfreak'],
},
{
    title: 'Be Afraid of the Dark',
    series: 'Classic',
    season: 3,
    episode: 12,
    synopsis: 'Ghostfreak unleashes an army of aliens from his home dimension, forcing Ben to confront his fear.',
    aliens: ['Wildmutt', 'XLR8', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Ghostfreak'],
},
{
    title: 'The Visitor',
    series: 'Classic',
    season: 3,
    episode: 13,
    synopsis: 'An alien named Xylene reveals secrets about the Omnitrix and Grandpa Max’s past with the Plumbers.',
    aliens: ['Diamondhead', 'Upgrade', 'Grey Matter'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Xylene'],
},


    // Season 4 (episodes 1-13)
    {
    title: 'Perfect Day',
    series: 'Classic',
    season: 4,
    episode: 1,
    synopsis: 'Ben wakes up to find his life seemingly perfect, but soon realizes he’s trapped in one of Vilgax’s virtual realities.',
    aliens: ['Heatblast', 'Diamondhead', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Vilgax'],
},
{
    title: 'Divided We Stand',
    series: 'Classic',
    season: 4,
    episode: 2,
    synopsis: 'A malfunction causes Ditto to duplicate uncontrollably, creating chaos as Ben struggles to pull himself back together.',
    aliens: ['Ditto', 'XLR8'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Don’t Drink the Water',
    series: 'Classic',
    season: 4,
    episode: 3,
    synopsis: 'Ben is accidentally de-aged into a 4-year-old, forcing Gwen and Max to handle the Omnitrix’s powers.',
    aliens: ['Wildmutt', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Big Fat Alien Wedding',
    series: 'Classic',
    season: 4,
    episode: 4,
    synopsis: 'The Tennysons crash a wedding between two alien families to prevent a full-scale interstellar war.',
    aliens: ['Heatblast', 'Upgrade', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Ben 4 Good Buddy',
    series: 'Classic',
    season: 4,
    episode: 5,
    synopsis: 'Ben and his family face alien biker gangs who hijack trucks across the country.',
    aliens: ['Cannonbolt', 'XLR8', 'Four Arms'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Ready to Rumble',
    series: 'Classic',
    season: 4,
    episode: 6,
    synopsis: 'Ben enters a wrestling ring to stop a mutant wrestler who threatens innocent lives.',
    aliens: ['Four Arms', 'Wildmutt'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Ken 10',
    series: 'Classic',
    season: 4,
    episode: 7,
    synopsis: 'In an alternate future, Ben’s son, Ken, inherits the Omnitrix, but his reckless use of it attracts villains.',
    aliens: ['Heatblast', 'Diamondhead', 'Wildmutt'],
    characters: ['Ken Tennyson', 'Gwen Tennyson', 'Ben 10,000'],
},
{
    title: 'Goodbye and Good Riddance',
    series: 'Classic',
    season: 4,
    episode: 8,
    synopsis: 'On the last day of summer, Ben reveals his secret identity to his classmates before retiring the Omnitrix… or so he thinks.',
    aliens: ['Heatblast', 'Four Arms', 'XLR8'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson'],
},
{
    title: 'Ben 10 vs. the Negative 10: Part 1',
    series: 'Classic',
    season: 4,
    episode: 9,
    synopsis: 'A team of Ben’s greatest enemies unite as the Negative 10, plotting to steal a dangerous device called the Sub-Energy.',
    aliens: ['Diamondhead', 'Four Arms', 'Stinkfly'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Dr. Animo', 'Charmcaster', 'Vilgax'],
},
{
    title: 'Ben 10 vs. the Negative 10: Part 2',
    series: 'Classic',
    season: 4,
    episode: 10,
    synopsis: 'The battle against the Negative 10 reaches its climax as Ben uses all his strength to protect the Sub-Energy from falling into enemy hands.',
    aliens: ['Cannonbolt', 'Upgrade', 'Heatblast'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Dr. Animo', 'Charmcaster', 'Vilgax'],
},
{
    title: 'Secrets of the Omnitrix: Part 1',
    series: 'Classic',
    season: 4,
    episode: 11,
    synopsis: 'Ben accidentally triggers the Omnitrix’s self-destruct mode. He, Gwen, and Tetrax race across space to stop it.',
    aliens: ['Heatblast', 'Wildmutt', 'XLR8'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Tetrax'],
},
{
    title: 'Secrets of the Omnitrix: Part 2',
    series: 'Classic',
    season: 4,
    episode: 12,
    synopsis: 'Ben learns more about Azmuth, the Omnitrix’s creator, while facing off against Vilgax and other enemies in space.',
    aliens: ['Four Arms', 'Upgrade', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Tetrax', 'Vilgax', 'Azmuth'],
},
{
    title: 'Secrets of the Omnitrix: Part 3',
    series: 'Classic',
    season: 4,
    episode: 13,
    synopsis: 'The final showdown with Vilgax decides the fate of the Omnitrix and the galaxy, with Ben proving his true heroism.',
    aliens: ['Cannonbolt', 'Heatblast', 'Upgrade'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Max Tennyson', 'Tetrax', 'Vilgax', 'Azmuth'],
},


{
    title: 'Ben 10 Returns: Part 1',
    series: 'Alien Force',
    season: 1,
    episode: 1,
    synopsis: 'Five years later, a 15-year-old Ben takes up the Omnitrix again when Grandpa Max disappears, and joins forces with Gwen and Kevin.',
    aliens: ['Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Max Tennyson', 'Highbreed'],
},
{
    title: 'Ben 10 Returns: Part 2',
    series: 'Alien Force',
    season: 1,
    episode: 2,
    synopsis: 'Ben learns to use his new aliens and teams up with Gwen and Kevin to stop the Highbreed’s invasion plan.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Highbreed'],
},
{
    title: 'Everybody Talks About the Weather',
    series: 'Alien Force',
    season: 1,
    episode: 3,
    synopsis: 'The team investigates strange weather patterns and encounters Alan, a young Pyronite alien hybrid.',
    aliens: ['Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Alan Albright', 'DNAliens'],
},
{
    title: 'Kevin’s Big Score',
    series: 'Alien Force',
    season: 1,
    episode: 4,
    synopsis: 'Kevin betrays Ben and Gwen by stealing alien tech, but later redeems himself by returning to help against the DNAliens.',
    aliens: ['Humungousaur', 'Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'DNAliens'],
},
{
    title: 'All That Glitters',
    series: 'Alien Force',
    season: 1,
    episode: 5,
    synopsis: 'The team encounters Michael Morningstar, a charming teen hero with a dangerous secret.',
    aliens: ['Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Michael Morningstar'],
},
{
    title: 'Max Out',
    series: 'Alien Force',
    season: 1,
    episode: 6,
    synopsis: 'The team searches for Max and encounters the shocking truth about the DNAliens’ plans.',
    aliens: ['Big Chill', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'DNAliens'],
},
{
    title: 'Pier Pressure',
    series: 'Alien Force',
    season: 1,
    episode: 7,
    synopsis: 'Ben tries to go on a date, but an alien threat interrupts his plans at the local pier.',
    aliens: ['Goop'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'What Are Little Girls Made Of?',
    series: 'Alien Force',
    season: 1,
    episode: 8,
    synopsis: 'Ben and the team discover that Gwen’s magical powers are connected to her alien heritage.',
    aliens: ['Humungousaur', 'Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Verdona'],
},
{
    title: 'The Gauntlet',
    series: 'Alien Force',
    season: 1,
    episode: 9,
    synopsis: 'A Highbreed-controlled soldier gains a powerful alien gauntlet, forcing Ben to intervene.',
    aliens: ['Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Highbreed'],
},
{
    title: 'Paradox',
    series: 'Alien Force',
    season: 1,
    episode: 10,
    synopsis: 'The team meets Professor Paradox, a time-traveling scientist, and learns about the dangers of a mutant alien experiment.',
    aliens: ['Big Chill', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Professor Paradox'],
},
{
    title: 'Be-Knighted',
    series: 'Alien Force',
    season: 1,
    episode: 11,
    synopsis: 'Ben encounters the Forever Knights, who are seeking alien technology for their mysterious leader.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Forever Knights'],
},
{
    title: 'Plumber’s Helpers',
    series: 'Alien Force',
    season: 1,
    episode: 12,
    synopsis: 'Ben teams up with fellow Plumber kids Alan, Manny, and Helen to battle a dangerous alien threat.',
    aliens: ['Big Chill', 'Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Alan Albright', 'Manny Armstrong', 'Helen Wheels'],
},
{
    title: 'X = Ben + 2',
    series: 'Alien Force',
    season: 1,
    episode: 13,
    synopsis: 'Ben faces betrayal when one of the Plumber kids is revealed to be working for the DNAliens.',
    aliens: ['Goop', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Plumber Kids', 'DNAliens'],
},



{
    title: 'Darkstar Rising',
    series: 'Alien Force',
    season: 2,
    episode: 1,
    synopsis: 'Ben and the team discover the Forever Knights working with Darkstar, who returns with a dangerous new plan.',
    aliens: ['Swampfire', 'Goop'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Michael Morningstar (Darkstar)', 'Forever Knights'],
},
{
    title: 'Alone Together',
    series: 'Alien Force',
    season: 2,
    episode: 2,
    synopsis: 'Ben and a Highbreed commander are stranded on a desolate planet, forcing them to work together to survive.',
    aliens: ['Echo Echo'],
    characters: ['Ben Tennyson', 'Highbreed Commander'],
},
{
    title: 'Good Copy, Bad Copy',
    series: 'Alien Force',
    season: 2,
    episode: 3,
    synopsis: 'The Omnitrix malfunctions, causing Ben to switch places with a DNA sample alien named Albedo, who looks exactly like him.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Albedo'],
},
{
    title: 'Save the Last Dance',
    series: 'Alien Force',
    season: 2,
    episode: 4,
    synopsis: 'Gwen prepares for her school dance, but Kevin’s jealousy and an alien threat complicate things.',
    aliens: ['Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Undercover',
    series: 'Alien Force',
    season: 2,
    episode: 5,
    synopsis: 'The team infiltrates a high school to uncover a group of hybrid aliens hiding as students.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'DNAliens'],
},
{
    title: 'Pet Project',
    series: 'Alien Force',
    season: 2,
    episode: 6,
    synopsis: 'The Forever Knights capture a DNA alien pet, and Ben must decide whether to help it escape.',
    aliens: ['Goop', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Forever Knights'],
},
{
    title: 'Grounded',
    series: 'Alien Force',
    season: 2,
    episode: 7,
    synopsis: 'Ben’s parents discover his secret life as a hero and forbid him from using the Omnitrix.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Carl Tennyson', 'Sandra Tennyson'],
},
{
    title: 'Voided',
    series: 'Alien Force',
    season: 2,
    episode: 8,
    synopsis: 'Ben and Kevin are pulled into the Null Void, where they meet old allies and enemies while trying to escape.',
    aliens: ['Big Chill', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Grandpa Max', 'Dr. Animo'],
},
{
    title: 'Paradox',
    series: 'Alien Force',
    season: 2,
    episode: 9,
    synopsis: 'Professor Paradox returns to warn Ben about the dangers of Eon and alternate timelines.',
    aliens: ['Echo Echo', 'Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Professor Paradox'],
},
{
    title: 'Alone Together',
    series: 'Classic',
    season: 2,
    episode: 10,
    synopsis: 'Ben is forced to cooperate with a Highbreed general when they are trapped together on a desolate world.',
    aliens: ['Echo Echo', 'Swampfire'],
    characters: ['Ben Tennyson', 'Highbreed'],
},
{
    title: 'War of the Worlds: Part 1',
    series: 'Alien Force',
    season: 2,
    episode: 12,
    synopsis: 'The Highbreed launch their full-scale invasion of Earth, forcing Ben and his allies to rally together.',
    aliens: ['Swampfire', 'Humungousaur', 'Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Highbreed', 'DNAliens'],
},
{
    title: 'War of the Worlds: Part 2',
    series: 'Alien Force',
    season: 2,
    episode: 13,
    synopsis: 'With Earth’s fate at stake, Ben must convince the Highbreed to call off their invasion once and for all.',
    aliens: ['Swampfire', 'Humungousaur', 'Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Highbreed'],
},


{
    title: 'Vreedle, Vreedle',
    series: 'Alien Force',
    season: 3,
    episode: 1,
    synopsis: 'Ben and the team face the Vreedle Brothers, intergalactic bailiffs hired to collect on a bounty.',
    aliens: ['Humungousaur', 'Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vreedle Brothers'],
},
{
    title: 'Inferno',
    series: 'Alien Force',
    season: 3,
    episode: 2,
    synopsis: 'Magma monsters appear in a small town, and Ben suspects Alan the Pyronite hybrid might be involved.',
    aliens: ['Swampfire', 'Jetray'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Alan Albright'],
},
{
    title: 'Fool’s Gold',
    series: 'Alien Force',
    season: 3,
    episode: 3,
    synopsis: 'The team investigates a town where people are obsessed with consuming addictive alien snack food.',
    aliens: ['Humungousaur', 'Goop'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Simple',
    series: 'Alien Force',
    season: 3,
    episode: 4,
    synopsis: 'Ben tries to settle a dispute between two alien races, but diplomacy is harder than he expected.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Greetings from Techadon',
    series: 'Alien Force',
    season: 3,
    episode: 5,
    synopsis: 'Ben battles powerful Techadon robots programmed to destroy him.',
    aliens: ['Humungousaur', 'Jetray', 'Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Techadon Robots'],
},
{
    title: 'The Enemy of My Frenemy',
    series: 'Alien Force',
    season: 3,
    episode: 6,
    synopsis: 'Charmcaster manipulates Gwen into helping her, while Ben and Kevin try to track them down.',
    aliens: ['Swampfire', 'Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Charmcaster'],
},
{
    title: 'Busy Box',
    series: 'Alien Force',
    season: 3,
    episode: 7,
    synopsis: 'The team finds a mysterious alien box that can create anything, but it quickly gets out of control.',
    aliens: ['Big Chill', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Con of Rath',
    series: 'Alien Force',
    season: 3,
    episode: 8,
    synopsis: 'Ben accidentally unlocks a new alien, Rath, who is aggressive, loud, and nearly uncontrollable.',
    aliens: ['Rath'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Primus',
    series: 'Alien Force',
    season: 3,
    episode: 9,
    synopsis: 'Ben is transported to Primus, the Omnitrix’s home planet, where he battles Vilgax for control.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax'],
},
{
    title: 'Time Heals',
    series: 'Alien Force',
    season: 3,
    episode: 10,
    synopsis: 'Gwen uses a magical spell to time travel, but her interference creates disastrous consequences.',
    aliens: ['Humungousaur', 'Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Charmcaster'],
},
{
    title: 'The Secret of Chromastone',
    series: 'Alien Force',
    season: 3,
    episode: 11,
    synopsis: 'Chromastone is destroyed in battle, revealing a hidden transformation into Diamondhead.',
    aliens: ['Chromastone', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Above and Beyond',
    series: 'Alien Force',
    season: 3,
    episode: 12,
    synopsis: 'The team of Plumber kids are manipulated into testing their abilities against Ben.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Alan Albright', 'Manny Armstrong', 'Helen Wheels'],
},
{
    title: 'Vendetta',
    series: 'Alien Force',
    season: 3,
    episode: 13,
    synopsis: 'Kevin’s past catches up to him when an alien seeks revenge for a deal gone wrong.',
    aliens: ['Goop', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Ghost Town',
    series: 'Alien Force',
    season: 3,
    episode: 14,
    synopsis: 'Vilgax teams up with Ghostfreak, forcing Ben to confront two of his deadliest enemies.',
    aliens: ['Big Chill', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax', 'Ghostfreak'],
},
{
    title: 'Trade-Off',
    series: 'Alien Force',
    season: 3,
    episode: 15,
    synopsis: 'Ben and Kevin accidentally switch bodies, creating chaos as they try to stop an alien threat.',
    aliens: ['Swampfire', 'Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Busy Box Part 2 (Filler)',
    series: 'Alien Force',
    season: 3,
    episode: 16,
    synopsis: 'The alien box returns, causing even more mayhem as it falls into the wrong hands.',
    aliens: ['Goop', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Final Battle: Part 1',
    series: 'Alien Force',
    season: 3,
    episode: 17,
    synopsis: 'The Highbreed invasion comes to a climax as Ben faces Vilgax in one last showdown.',
    aliens: ['Swampfire', 'Humungousaur', 'Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax', 'Highbreed'],
},
{
    title: 'The Final Battle: Part 2',
    series: 'Alien Force',
    season: 3,
    episode: 18,
    synopsis: 'Ben unlocks the true power of the Omnitrix and defeats Vilgax once and for all.',
    aliens: ['Way Big', 'Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax'],
},
{
    title: 'The Transmogrification (Epilogue)',
    series: 'Alien Force',
    season: 3,
    episode: 19,
    synopsis: 'Ben adjusts to his new life after defeating Vilgax, while Gwen and Kevin deal with their own changes.',
    aliens: ['Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Enemy Within',
    series: 'Alien Force',
    season: 3,
    episode: 20,
    synopsis: 'An alien parasite takes control of Ben, leaving Gwen and Kevin to find a way to save him.',
    aliens: ['Swampfire', 'Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},



{
    title: 'The More Things Change: Part 1',
    series: 'Ultimate Alien',
    season: 1,
    episode: 1,
    synopsis: 'Ben reveals his secret identity to the world, becoming a global superhero, but new enemies emerge who know his identity.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Doctor Animo'],
},
{
    title: 'The More Things Change: Part 2',
    series: 'Ultimate Alien',
    season: 1,
    episode: 2,
    synopsis: 'Ben faces new threats while learning to master the powers of his Ultimate aliens and protect Earth.',
    aliens: ['Ultimate Big Chill', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Doctor Animo'],
},
{
    title: 'Tummy Trouble',
    series: 'Ultimate Alien',
    season: 1,
    episode: 3,
    synopsis: 'A mysterious alien creature attacks the city, and Ben must use his Ultimate aliens to stop it.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'This Looks Like a Job for... Ultimate Swampfire',
    series: 'Ultimate Alien',
    season: 1,
    episode: 4,
    synopsis: 'Ben discovers the upgraded powers of Swampfire, giving him new abilities to face powerful enemies.',
    aliens: ['Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'A Jolt from the Past',
    series: 'Ultimate Alien',
    season: 1,
    episode: 5,
    synopsis: 'Ben faces villains from his past while balancing the challenges of his new Ultimate aliens.',
    aliens: ['Ultimate Big Chill', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Truth or Consequences',
    series: 'Ultimate Alien',
    season: 1,
    episode: 6,
    synopsis: 'Ben must retrieve the truth device from a criminal alien, learning valuable lessons about honesty.',
    aliens: ['Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Villain Alien'],
},
{
    title: 'The Universal Rival',
    series: 'Ultimate Alien',
    season: 1,
    episode: 7,
    synopsis: 'Ben faces an alien rival from another planet who challenges him in combat to prove superiority.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Universal Rival'],
},
{
    title: 'The Eggman Cometh',
    series: 'Ultimate Alien',
    season: 1,
    episode: 8,
    synopsis: 'An alien with egg-based powers wreaks havoc, forcing Ben to adapt his strategies with his Ultimate aliens.',
    aliens: ['Ultimate Big Chill', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Eggman'],
},
{
    title: 'Mystery of the Omnitrix',
    series: 'Ultimate Alien',
    season: 1,
    episode: 9,
    synopsis: 'Ben uncovers a hidden feature of the Omnitrix that could give him an edge against increasingly powerful enemies.',
    aliens: ['Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Molecular Momentum',
    series: 'Ultimate Alien',
    season: 1,
    episode: 10,
    synopsis: 'A new alien threat manipulates molecular energy, and Ben must use precise teamwork to stop it.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},

{
    title: 'Video Game Villain',
    series: 'Ultimate Alien',
    season: 1,
    episode: 11,
    synopsis: 'Ben gets pulled into a virtual reality game where he must defeat digital versions of his alien enemies.',
    aliens: ['Ultimate Swampfire', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Trouble Helix',
    series: 'Ultimate Alien',
    season: 1,
    episode: 12,
    synopsis: 'An alien scientist creates clones of Ben’s aliens, forcing him to battle his own duplicates.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Echo Echo'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Helix'],
},
{
    title: 'The Eggman Cometh',
    series: 'Ultimate Alien',
    season: 1,
    episode: 13,
    synopsis: 'An alien villain known as the Eggman threatens Bellwood, and Ben must adapt his Ultimate aliens to stop him.',
    aliens: ['Ultimate Big Chill', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Eggman'],
},
{
    title: 'The Forge of Creation',
    series: 'Ultimate Alien',
    season: 1,
    episode: 14,
    synopsis: 'Ben must stop a villain from using alien technology to create dangerous new creatures.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Perfect Day',
    series: 'Ultimate Alien',
    season: 1,
    episode: 15,
    synopsis: 'Ben faces a day where everything seems perfect—but it is a trap set by an alien mastermind.',
    aliens: ['Ultimate Swampfire', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Villain Alien'],
},
{
    title: 'The Secret of Chromastone',
    series: 'Ultimate Alien',
    season: 1,
    episode: 16,
    synopsis: 'Ben encounters Chromastone, a new alien, whose powers may hold the key to stopping a villain’s plan.',
    aliens: ['Chromastone', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Ultimatrix',
    series: 'Ultimate Alien',
    season: 1,
    episode: 17,
    synopsis: 'Ben discovers the Ultimatrix, an upgraded Omnitrix, allowing his aliens to evolve into more powerful forms.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Albedo'],
},
{
    title: 'Animo and the Mutant',
    series: 'Ultimate Alien',
    season: 1,
    episode: 18,
    synopsis: 'Doctor Animo returns with a new mutant, and Ben must team up with Kevin and Gwen to stop him.',
    aliens: ['Ultimate Big Chill', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Doctor Animo'],
},
{
    title: 'The Final Battle: Part 1',
    series: 'Ultimate Alien',
    season: 1,
    episode: 19,
    synopsis: 'Vilgax and Albedo unite to challenge Ben, forcing him to rely on his Ultimate aliens to defend Earth.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax', 'Albedo'],
},
{
    title: 'The Final Battle: Part 2',
    series: 'Ultimate Alien',
    season: 1,
    episode: 20,
    synopsis: 'The epic showdown concludes as Ben defeats his enemies and secures the safety of the Ultimatrix.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax', 'Albedo'],
},
{
    title: 'Be Afraid of the Dark',
    series: 'Ultimate Alien',
    season: 1,
    episode: 21,
    synopsis: 'Ghostfreak returns, and Ben must confront his fears to stop the sinister alien from causing chaos.',
    aliens: ['Ultimate Big Chill', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Ghostfreak'],
},
{
    title: 'Showdown: Part 1',
    series: 'Ultimate Alien',
    season: 1,
    episode: 22,
    synopsis: 'Ben faces an all-out attack from multiple villains seeking the Ultimatrix for their own gain.',
    aliens: ['Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Multiple Villains'],
},
{
    title: 'Showdown: Part 2',
    series: 'Ultimate Alien',
    season: 1,
    episode: 23,
    synopsis: 'The battle escalates as Ben pushes his Ultimate aliens to their limits to stop the combined forces of evil.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Multiple Villains'],
},
{
    title: 'The Totally Awesome Day',
    series: 'Ultimate Alien',
    season: 1,
    episode: 24,
    synopsis: 'Ben enjoys a seemingly perfect day, but a secret villain plots to turn it into disaster.',
    aliens: ['Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Fused',
    series: 'Ultimate Alien',
    season: 1,
    episode: 25,
    synopsis: 'Two aliens combine to create a powerful hybrid, and Ben must adapt quickly to stop it.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Fused Alien'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Ultimate Sacrifice',
    series: 'Ultimate Alien',
    season: 1,
    episode: 26,
    synopsis: 'Ben faces a final confrontation with a universe-level threat, testing his courage and mastery of the Ultimatrix.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},


{
    title: 'Fame',
    series: 'Ultimate Alien',
    season: 2,
    episode: 1,
    synopsis: 'Ben faces the challenges of being a global superhero while dealing with new alien threats and public scrutiny.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Reporter Aliens'],
},
{
    title: 'Be Afraid of the Dark',
    series: 'Ultimate Alien',
    season: 2,
    episode: 2,
    synopsis: 'Ghostfreak returns, forcing Ben to confront one of his oldest and most terrifying enemies.',
    aliens: ['Ultimate Big Chill', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Ghostfreak'],
},
{
    title: 'Showdown: Part 1',
    series: 'Ultimate Alien',
    season: 2,
    episode: 3,
    synopsis: 'Multiple villains converge to challenge Ben and his Ultimatrix, putting Earth at risk.',
    aliens: ['Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Multiple Villains'],
},
{
    title: 'Showdown: Part 2',
    series: 'Ultimate Alien',
    season: 2,
    episode: 4,
    synopsis: 'The epic battle continues as Ben pushes his Ultimate aliens to their limits to stop the combined villains.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Multiple Villains'],
},
{
    title: 'The Totally Awesome Day',
    series: 'Ultimate Alien',
    season: 2,
    episode: 5,
    synopsis: 'Ben enjoys a perfect day, but a secret alien villain plots to ruin it.',
    aliens: ['Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Fused',
    series: 'Ultimate Alien',
    season: 2,
    episode: 6,
    synopsis: 'Two alien villains fuse together into a powerful hybrid, challenging Ben to adapt quickly.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Fused Alien'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Ultimate Sacrifice',
    series: 'Ultimate Alien',
    season: 2,
    episode: 7,
    synopsis: 'Ben faces a universe-level threat that tests his courage and mastery of the Ultimatrix.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Return of the Forever Knights',
    series: 'Ultimate Alien',
    season: 2,
    episode: 8,
    synopsis: 'The Forever Knights return with new alien technology, and Ben must stop their latest scheme.',
    aliens: ['Ultimate Swampfire', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Forever Knights'],
},
{
    title: 'All That Glitters',
    series: 'Ultimate Alien',
    season: 2,
    episode: 9,
    synopsis: 'An alien threat disguised as a precious gem causes chaos, forcing Ben to act quickly.',
    aliens: ['Ultimate Big Chill', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Eggman Cometh',
    series: 'Ultimate Alien',
    season: 2,
    episode: 10,
    synopsis: 'The Eggman returns with a new plan, and Ben must use his Ultimate aliens to stop him.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Eggman'],
},
{
    title: 'Charmed, I’m Sure',
    series: 'Ultimate Alien',
    season: 2,
    episode: 11,
    synopsis: 'Charmcaster returns, forcing Ben, Gwen, and Kevin to work together to stop her magical schemes.',
    aliens: ['Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Charmcaster'],
},
{
    title: 'The Forge of Creation',
    series: 'Ultimate Alien',
    season: 2,
    episode: 12,
    synopsis: 'Ben faces a villain creating dangerous alien creatures, threatening the city with a new army.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Heroes United: Part 1',
    series: 'Ultimate Alien',
    season: 2,
    episode: 13,
    synopsis: 'Ben teams up with Kevin 11 and Rook Blonko to stop a powerful new threat from another dimension.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Big Chill', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Kevin Levin', 'Rook Blonko'],
},
{
    title: 'Heroes United: Part 2',
    series: 'Ultimate Alien',
    season: 2,
    episode: 14,
    synopsis: 'The battle continues as Ben, Kevin, and Rook face their enemies in an epic showdown.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Big Chill', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Kevin Levin', 'Rook Blonko'],
},
{
    title: 'The Negative One',
    series: 'Ultimate Alien',
    season: 2,
    episode: 15,
    synopsis: 'A new villain emerges with powers from the Negative Zone, forcing Ben to use all his Ultimate aliens.',
    aliens: ['Ultimate Swampfire', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Negative One'],
},
{
    title: 'Mutant X',
    series: 'Ultimate Alien',
    season: 2,
    episode: 16,
    synopsis: 'Kevin confronts a mysterious mutant alien that mirrors his own powers, creating conflict and danger.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Kevin Levin', 'Gwen Tennyson'],
},
{
    title: 'The Secret of Chromastone',
    series: 'Ultimate Alien',
    season: 2,
    episode: 17,
    synopsis: 'Chromastone gains new powers, and Ben must use his Ultimate aliens to stop a villain from exploiting them.',
    aliens: ['Chromastone', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Ultimate Battle',
    series: 'Ultimate Alien',
    season: 2,
    episode: 18,
    synopsis: 'Ben faces an army of alien villains, forcing him to master the full potential of his Ultimatrix.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Universal Rival',
    series: 'Ultimate Alien',
    season: 2,
    episode: 19,
    synopsis: 'A powerful alien rival from another galaxy challenges Ben to a duel for supremacy.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Universal Rival'],
},
{
    title: 'The Ultimatrix: Part 1',
    series: 'Ultimate Alien',
    season: 2,
    episode: 20,
    synopsis: 'Albedo attempts to steal the Ultimatrix, forcing Ben to defend it with all his Ultimate aliens.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Big Chill', 'Ultimate Swampfire'],
    characters: ['Ben Tennyson', 'Albedo', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Ultimatrix: Part 2',
    series: 'Ultimate Alien',
    season: 2,
    episode: 21,
    synopsis: 'Ben battles Albedo in a climactic confrontation to prevent the Ultimatrix from falling into the wrong hands.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Albedo', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'Fame or Shame',
    series: 'Ultimate Alien',
    season: 2,
    episode: 22,
    synopsis: 'Ben faces public scrutiny and media pressure while trying to stop an alien threat.',
    aliens: ['Ultimate Swampfire', 'Ultimate Humungousaur'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},
{
    title: 'The Ultimate Enemy',
    series: 'Ultimate Alien',
    season: 2,
    episode: 23,
    synopsis: 'Ben faces his most dangerous enemy yet, testing both his skill and his control over the Ultimatrix.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Ultimate Enemy'],
},
{
    title: 'Final Showdown: Part 1',
    series: 'Ultimate Alien',
    season: 2,
    episode: 24,
    synopsis: 'The final showdown begins as Ben must confront a coalition of villains threatening Earth.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax', 'Albedo'],
},
{
    title: 'Final Showdown: Part 2',
    series: 'Ultimate Alien',
    season: 2,
    episode: 25,
    synopsis: 'Ben pushes his Ultimate aliens to the limit in the climactic battle to save the planet.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin', 'Vilgax', 'Albedo'],
},
{
    title: 'The Last Stand',
    series: 'Ultimate Alien',
    season: 2,
    episode: 26,
    synopsis: 'The series finale concludes with Ben defeating the ultimate threat and reflecting on his journey as a hero.',
    aliens: ['Ultimate Humungousaur', 'Ultimate Swampfire', 'Ultimate Big Chill'],
    characters: ['Ben Tennyson', 'Gwen Tennyson', 'Kevin Levin'],
},


{
    title: 'The More Things Change: Part 1',
    series: 'Omniverse',
    season: 1,
    episode: 1,
    synopsis: 'Ben meets his new partner, Rook Blonko, as they try to stop alien criminals terrorizing Bellwood.',
    aliens: ['Four Arms', 'XLR8', 'Heatblast'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'The More Things Change: Part 2',
    series: 'Omniverse',
    season: 1,
    episode: 2,
    synopsis: 'Ben and Rook continue to battle alien criminals, testing their teamwork in the process.',
    aliens: ['Diamondhead', 'Wildmutt', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Trouble Helix',
    series: 'Omniverse',
    season: 1,
    episode: 3,
    synopsis: 'The villain Helix clones Ben’s aliens, creating chaos that Ben and Rook must stop.',
    aliens: ['Four Arms', 'Heatblast', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Helix']
},
{
    title: 'Eggman Cometh',
    series: 'Omniverse',
    season: 1,
    episode: 4,
    synopsis: 'The Eggman returns with a new plan, and Ben and Rook must stop him from taking over Bellwood.',
    aliens: ['Four Arms', 'Diamondhead', 'Wildmutt'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Eggman']
},
{
    title: 'A Jolt from the Past',
    series: 'Omniverse',
    season: 1,
    episode: 5,
    synopsis: 'Ben faces villains from his past while Rook proves his skills as a hero.',
    aliens: ['XLR8', 'Four Arms', 'Shocksquatch'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Good Ol’ Fashioned Revenge',
    series: 'Omniverse',
    season: 1,
    episode: 6,
    synopsis: 'A villain from Ben’s past seeks revenge, forcing him and Rook to stop the attack on Bellwood.',
    aliens: ['Four Arms', 'Diamondhead', 'Feedback'],
    characters: ['Ben Tennyson', 'Rook Blonko', "Zs'Skayr"]
},
{
    title: 'Sick Day',
    series: 'Omniverse',
    season: 1,
    episode: 7,
    synopsis: 'Ben falls ill, leaving Rook to handle a villain on his own, showing his growth as a hero.',
    aliens: ['XLR8', 'Four Arms', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One']
},
{
    title: 'It’s a Mad, Mad, Mad Ben',
    series: 'Omniverse',
    season: 1,
    episode: 8,
    synopsis: 'Ben faces multiple alien criminals at once and must coordinate with Rook to stop them.',
    aliens: ['Four Arms', 'Rath', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'The Frogs of War',
    series: 'Omniverse',
    season: 1,
    episode: 9,
    synopsis: 'Genetically enhanced frog aliens attack Bellwood, and Ben and Rook must work together to defeat them.',
    aliens: ['Four Arms', 'Ampfibian', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Frogs of War Leader']
},
{
    title: 'Grudge Match',
    series: 'Omniverse',
    season: 1,
    episode: 10,
    synopsis: 'Ben confronts a nemesis from his past, with Rook providing critical support to win the battle.',
    aliens: ['Diamondhead', 'Four Arms', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},

{
    title: 'The Frogs of War: Part 1',
    series: 'Omniverse',
    season: 2,
    episode: 1,
    synopsis: 'Ben and Rook investigate a series of attacks by enhanced frog aliens terrorizing Bellwood.',
    aliens: ['Four Arms', 'XLR8', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Frog Commander']
},
{
    title: 'The Frogs of War: Part 2',
    series: 'Omniverse',
    season: 2,
    episode: 2,
    synopsis: 'The frog army grows stronger, and Ben must strategize with Rook to prevent a city-wide disaster.',
    aliens: ['Rath', 'Four Arms', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Frog Commander']
},
{
    title: 'The Negative One Strikes',
    series: 'Omniverse',
    season: 2,
    episode: 3,
    synopsis: 'The Negative One resurfaces with a new plan to destroy the Omnitrix and create chaos in Bellwood.',
    aliens: ['Four Arms', 'Shocksquatch', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One']
},
{
    title: 'Good Ol’ Fashioned Revenge',
    series: 'Omniverse',
    season: 2,
    episode: 4,
    synopsis: 'A villain from Ben’s past returns, seeking revenge and putting Bellwood in danger.',
    aliens: ['Diamondhead', 'Four Arms', 'Feedback'],
    characters: ['Ben Tennyson', 'Rook Blonko', "Zs'Skayr"]
},
{
    title: 'Return of the Forever Knights',
    series: 'Omniverse',
    season: 2,
    episode: 5,
    synopsis: 'The Forever Knights attempt a new alien heist, and Ben and Rook must stop them before the city is destroyed.',
    aliens: ['Four Arms', 'Rath', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Forever Knights Leader']
},
{
    title: 'It’s a Mad, Mad, Mad Ben',
    series: 'Omniverse',
    season: 2,
    episode: 6,
    synopsis: 'Multiple alien villains attack simultaneously, forcing Ben and Rook to coordinate all their alien powers.',
    aliens: ['Four Arms', 'Shocksquatch', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Sick Day',
    series: 'Omniverse',
    season: 2,
    episode: 7,
    synopsis: 'Ben catches a mysterious illness, and Rook must handle an alien threat on his own.',
    aliens: ['XLR8', 'Four Arms', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Frog Commander']
},
{
    title: 'Trouble Helix',
    series: 'Omniverse',
    season: 2,
    episode: 8,
    synopsis: 'Helix clones Ben’s aliens again, creating chaos across Bellwood that only Ben and Rook can stop.',
    aliens: ['Four Arms', 'Diamondhead', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Helix']
},
{
    title: 'Grudge Match',
    series: 'Omniverse',
    season: 2,
    episode: 9,
    synopsis: 'Ben faces a nemesis from his past in a head-to-head battle, while Rook provides crucial support.',
    aliens: ['Rath', 'Four Arms', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Omniverse Finale: Part 1',
    series: 'Omniverse',
    season: 2,
    episode: 10,
    synopsis: 'A massive showdown occurs as Ben and Rook confront a coalition of villains threatening Bellwood.',
    aliens: ['Four Arms', 'XLR8', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby', 'The Negative One']
},
{
    title: 'The Frogs of War: Part 3',
    series: 'Omniverse',
    season: 3,
    episode: 1,
    synopsis: 'Ben and Rook face the final wave of the frog alien invasion threatening Bellwood.',
    aliens: ['Four Arms', 'Rath', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Frog Commander']
},
{
    title: 'A Jolt from the Past',
    series: 'Omniverse',
    season: 3,
    episode: 2,
    synopsis: 'Enemies from Ben’s past resurface, forcing him and Rook to adapt quickly to stop them.',
    aliens: ['Four Arms', 'Diamondhead', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Trouble Helix',
    series: 'Omniverse',
    season: 3,
    episode: 3,
    synopsis: 'Helix clones Ben’s aliens again, causing chaos across the city that only Ben and Rook can stop.',
    aliens: ['Four Arms', 'Shocksquatch', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Helix']
},
{
    title: 'Eggman Cometh',
    series: 'Omniverse',
    season: 3,
    episode: 4,
    synopsis: 'The Eggman launches another scheme, threatening Bellwood and challenging Ben and Rook.',
    aliens: ['Four Arms', 'Diamondhead', 'Wildmutt'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Eggman']
},
{
    title: 'Good Ol’ Fashioned Revenge',
    series: 'Omniverse',
    season: 3,
    episode: 5,
    synopsis: 'A villain from Ben’s past returns for revenge, testing his and Rook’s ability to work together.',
    aliens: ['Four Arms', 'Feedback', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Zs\'Skayr']
},
{
    title: 'Return of the Forever Knights',
    series: 'Omniverse',
    season: 3,
    episode: 6,
    synopsis: 'The Forever Knights strike again with advanced alien tech, and Ben and Rook must stop their plans.',
    aliens: ['Four Arms', 'Diamondhead', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Forever Knights Leader']
},
{
    title: 'It’s a Mad, Mad, Mad Ben',
    series: 'Omniverse',
    season: 3,
    episode: 7,
    synopsis: 'Ben faces multiple villains at once, requiring clever teamwork with Rook to save the city.',
    aliens: ['Four Arms', 'Shocksquatch', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Sick Day',
    series: 'Omniverse',
    season: 3,
    episode: 8,
    synopsis: 'Ben falls ill, leaving Rook to handle an alien threat on his own, proving his hero skills.',
    aliens: ['XLR8', 'Four Arms', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Frog Commander']
},
{
    title: 'Grudge Match',
    series: 'Omniverse',
    season: 3,
    episode: 9,
    synopsis: 'Ben confronts a nemesis from his past, with Rook providing crucial support in the battle.',
    aliens: ['Diamondhead', 'Four Arms', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Omniverse Finale: Part 2',
    series: 'Omniverse',
    season: 3,
    episode: 10,
    synopsis: 'Ben and Rook face the ultimate coalition of villains, culminating in a massive showdown in Bellwood.',
    aliens: ['Four Arms', 'XLR8', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One', 'Killerby']
},
{
    title: 'Rook on the Range',
    series: 'Omniverse',
    season: 4,
    episode: 1,
    synopsis: 'Ben and Rook travel to a desert town to stop a series of alien robberies by a new gang.',
    aliens: ['Four Arms', 'Kickin Hawk', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Outlaw Gang Leader']
},
{
    title: 'To Kill a Kapow',
    series: 'Omniverse',
    season: 4,
    episode: 2,
    synopsis: 'A powerful alien named Kapow causes havoc, and Ben and Rook must use strategy to subdue it.',
    aliens: ['Diamondhead', 'Shocksquatch', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kapow']
},
{
    title: 'Kevin 11: Part 1',
    series: 'Omniverse',
    season: 4,
    episode: 3,
    synopsis: 'Kevin Levin returns, creating tension between Ben and his old ally while a new threat emerges.',
    aliens: ['Four Arms', 'XLR8', 'Wildmutt'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kevin Levin']
},
{
    title: 'Kevin 11: Part 2',
    series: 'Omniverse',
    season: 4,
    episode: 4,
    synopsis: 'The conflict with Kevin escalates as he struggles with his powers, and Ben must intervene.',
    aliens: ['Four Arms', 'Kickin Hawk', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kevin Levin']
},
{
    title: 'The Negative One Returns',
    series: 'Omniverse',
    season: 4,
    episode: 5,
    synopsis: 'The Negative One resurfaces with a dangerous plan, threatening Bellwood once again.',
    aliens: ['Four Arms', 'Feedback', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One']
},
{
    title: 'It’s a Mad, Mad, Mad Ben',
    series: 'Omniverse',
    season: 4,
    episode: 6,
    synopsis: 'Ben faces multiple villains attacking simultaneously, requiring careful use of his alien powers.',
    aliens: ['Four Arms', 'XLR8', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Sick Day',
    series: 'Omniverse',
    season: 4,
    episode: 7,
    synopsis: 'Ben catches a mysterious illness, leaving Rook to fend off a threat alone and prove his skills.',
    aliens: ['Four Arms', 'Rath', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Frog Commander']
},
{
    title: 'Grudge Match',
    series: 'Omniverse',
    season: 4,
    episode: 8,
    synopsis: 'An old nemesis challenges Ben in a one-on-one battle, testing his teamwork with Rook.',
    aliens: ['Diamondhead', 'Four Arms', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Trouble Helix',
    series: 'Omniverse',
    season: 4,
    episode: 9,
    synopsis: 'Helix creates chaos with cloned aliens, and Ben and Rook must stop him before Bellwood is destroyed.',
    aliens: ['Four Arms', 'Shocksquatch', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Helix']
},
{
    title: 'Omniverse Finale: Part 3',
    series: 'Omniverse',
    season: 4,
    episode: 10,
    synopsis: 'The season concludes with a climactic battle against a coalition of villains threatening Bellwood.',
    aliens: ['Four Arms', 'Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One', 'Killerby']
},


{
    title: 'Outbreak',
    series: 'Omniverse',
    season: 5,
    episode: 1,
    synopsis: 'A mysterious alien virus spreads in Bellwood, and Ben and Rook must contain it before it escalates.',
    aliens: ['Four Arms', 'Ampfibian', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Viral Alien']
},
{
    title: 'Catch a Falling Star',
    series: 'Omniverse',
    season: 5,
    episode: 2,
    synopsis: 'Ben and Rook investigate a falling alien artifact that causes chaos in Bellwood.',
    aliens: ['XLR8', 'Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Artifact Alien']
},
{
    title: 'The Clockworks',
    series: 'Omniverse',
    season: 5,
    episode: 3,
    synopsis: 'A time-manipulating alien threatens the city, and Ben must adapt quickly with Rook’s help.',
    aliens: ['Four Arms', 'Shocksquatch', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Clockwork Alien']
},
{
    title: 'Darkstar Rising',
    series: 'Omniverse',
    season: 5,
    episode: 4,
    synopsis: 'Ben faces Darkstar, an alien with dark energy powers, in a showdown across Bellwood.',
    aliens: ['Four Arms', 'Diamondhead', 'Feedback'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Darkstar']
},
{
    title: 'Unstable',
    series: 'Omniverse',
    season: 5,
    episode: 5,
    synopsis: 'A volatile alien threatens to destroy the city, and Ben and Rook must find a way to stabilize it.',
    aliens: ['Rath', 'Four Arms', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Unstable Alien']
},
{
    title: 'Mutant Farm',
    series: 'Omniverse',
    season: 5,
    episode: 6,
    synopsis: 'Ben and Rook investigate a farm where alien mutations have run wild.',
    aliens: ['Four Arms', 'Ampfibian', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Mutant Farmer']
},
{
    title: 'Grudge Match II',
    series: 'Omniverse',
    season: 5,
    episode: 7,
    synopsis: 'Ben confronts another old enemy, with Rook aiding him in a rematch to protect Bellwood.',
    aliens: ['Diamondhead', 'Four Arms', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'The Negative One’s Revenge',
    series: 'Omniverse',
    season: 5,
    episode: 8,
    synopsis: 'The Negative One returns with a new plan, threatening the Omnitrix and Bellwood itself.',
    aliens: ['Four Arms', 'XLR8', 'Feedback'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One']
},
{
    title: 'It’s a Mad, Mad, Mad Ben: Part 2',
    series: 'Omniverse',
    season: 5,
    episode: 9,
    synopsis: 'Ben and Rook face multiple villains simultaneously, testing their teamwork and alien powers.',
    aliens: ['Four Arms', 'Shocksquatch', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Omniverse Finale: Part 4',
    series: 'Omniverse',
    season: 5,
    episode: 10,
    synopsis: 'Ben and Rook face the ultimate coalition of villains, culminating in an epic showdown in Bellwood.',
    aliens: ['Four Arms', 'Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One', 'Killerby']
},


{
    title: 'Alien Returns',
    series: 'Omniverse',
    season: 6,
    episode: 1,
    synopsis: 'A classic alien villain returns to wreak havoc in Bellwood, forcing Ben and Rook to stop them.',
    aliens: ['Four Arms', 'Rath', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Darkstar Rising: Part 2',
    series: 'Omniverse',
    season: 6,
    episode: 2,
    synopsis: 'Ben and Rook face Darkstar again, who has grown stronger and more dangerous.',
    aliens: ['Four Arms', 'Feedback', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Darkstar']
},
{
    title: 'Shocksquatch Unleashed',
    series: 'Omniverse',
    season: 6,
    episode: 3,
    synopsis: 'A rogue Shocksquatch alien goes on a rampage, and Ben must capture it before it destroys Bellwood.',
    aliens: ['Shocksquatch', 'Four Arms', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko']
},
{
    title: 'Rook on Patrol',
    series: 'Omniverse',
    season: 6,
    episode: 4,
    synopsis: 'Rook takes the lead on a mission, testing his ability to handle alien threats independently.',
    aliens: ['Four Arms', 'Rath', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko']
},
{
    title: 'The Negative One Returns',
    series: 'Omniverse',
    season: 6,
    episode: 5,
    synopsis: 'The Negative One launches another attack on the Omnitrix, challenging Ben and Rook once more.',
    aliens: ['Four Arms', 'Feedback', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One']
},
{
    title: 'Mutant Madness',
    series: 'Omniverse',
    season: 6,
    episode: 6,
    synopsis: 'Mutant aliens are unleashed in Bellwood, and Ben and Rook must contain the chaos.',
    aliens: ['Four Arms', 'Ampfibian', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Mutant Alien Leader']
},
{
    title: 'Grudge Match III',
    series: 'Omniverse',
    season: 6,
    episode: 7,
    synopsis: 'Ben faces an old enemy in a rematch, testing his skills and teamwork with Rook.',
    aliens: ['Diamondhead', 'Four Arms', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'The Omnitrix Malfunction',
    series: 'Omniverse',
    season: 6,
    episode: 8,
    synopsis: 'Ben’s Omnitrix malfunctions, causing unexpected transformations while fighting a villain.',
    aliens: ['Four Arms', 'XLR8', 'Shocksquatch'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Helix']
},
{
    title: 'It’s a Mad, Mad, Mad Ben: Part 3',
    series: 'Omniverse',
    season: 6,
    episode: 9,
    synopsis: 'Multiple villains attack simultaneously, and Ben must coordinate all his alien forms with Rook’s help.',
    aliens: ['Four Arms', 'Bloxx', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Omniverse Finale: Part 5',
    series: 'Omniverse',
    season: 6,
    episode: 10,
    synopsis: 'The season ends with a final showdown as Ben and Rook face a coalition of villains threatening Bellwood.',
    aliens: ['Four Arms', 'Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One', 'Killerby']
},


{
    title: 'The Frogs of War: Part 4',
    series: 'Omniverse',
    season: 7,
    episode: 1,
    synopsis: 'The final wave of the frog alien invasion emerges, and Ben and Rook must stop it once and for all.',
    aliens: ['Four Arms', 'Rath', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Frog Commander']
},
{
    title: 'Back in Black',
    series: 'Omniverse',
    season: 7,
    episode: 2,
    synopsis: 'A shadowy villain manipulates energy to wreak havoc in Bellwood, testing Ben and Rook’s abilities.',
    aliens: ['Four Arms', 'Feedback', 'Shocksquatch'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Dark Villain']
},
{
    title: 'Kevin Strikes Back',
    series: 'Omniverse',
    season: 7,
    episode: 3,
    synopsis: 'Kevin Levin returns, causing friction and forcing Ben and Rook to stop his destructive plans.',
    aliens: ['Four Arms', 'Rath', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kevin Levin']
},
{
    title: 'The Negative One: Final Plan',
    series: 'Omniverse',
    season: 7,
    episode: 4,
    synopsis: 'The Negative One executes his ultimate scheme, putting Bellwood and the Omnitrix at risk.',
    aliens: ['Four Arms', 'XLR8', 'Kickin Hawk'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One']
},
{
    title: 'Alien Outbreak',
    series: 'Omniverse',
    season: 7,
    episode: 5,
    synopsis: 'An alien virus spreads rapidly, and Ben and Rook race to contain it before disaster strikes.',
    aliens: ['Four Arms', 'Ampfibian', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Viral Alien']
},
{
    title: 'It’s a Mad, Mad, Mad Ben: Part 4',
    series: 'Omniverse',
    season: 7,
    episode: 6,
    synopsis: 'Multiple villains converge on Bellwood, and Ben and Rook must coordinate all their alien forms.',
    aliens: ['Four Arms', 'Shocksquatch', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Mutant Madness: Part 2',
    series: 'Omniverse',
    season: 7,
    episode: 7,
    synopsis: 'Mutant aliens return with increased power, forcing Ben and Rook into a high-stakes battle.',
    aliens: ['Four Arms', 'Kickin Hawk', 'Feedback'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Mutant Alien Leader']
},
{
    title: 'Grudge Match IV',
    series: 'Omniverse',
    season: 7,
    episode: 8,
    synopsis: 'Ben faces yet another nemesis from his past, and Rook helps him confront this dangerous foe.',
    aliens: ['Diamondhead', 'Four Arms', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Trouble Helix: Part 2',
    series: 'Omniverse',
    season: 7,
    episode: 9,
    synopsis: 'Helix continues his cloning chaos, forcing Ben and Rook to neutralize the threat before it escalates.',
    aliens: ['Four Arms', 'Shocksquatch', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Helix']
},
{
    title: 'Omniverse Finale: Part 6',
    series: 'Omniverse',
    season: 7,
    episode: 10,
    synopsis: 'The season concludes with a climactic showdown against a coalition of villains, testing Ben and Rook’s teamwork to the limit.',
    aliens: ['Four Arms', 'Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One', 'Killerby']
},



{
    title: 'Alien Time',
    series: 'Omniverse',
    season: 8,
    episode: 1,
    synopsis: 'Ben and Rook must stop a time-manipulating alien who is wreaking havoc in Bellwood.',
    aliens: ['Four Arms', 'Kickin Hawk', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Chronos Alien']
},
{
    title: 'Darkstar’s Revenge',
    series: 'Omniverse',
    season: 8,
    episode: 2,
    synopsis: 'Darkstar returns with a new scheme, threatening the city and challenging Ben and Rook.',
    aliens: ['Four Arms', 'Rath', 'Feedback'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Darkstar']
},
{
    title: 'Mutant Mayhem',
    series: 'Omniverse',
    season: 8,
    episode: 3,
    synopsis: 'Mutant aliens are unleashed in Bellwood, and Ben and Rook must contain them before disaster strikes.',
    aliens: ['Four Arms', 'Bloxx', 'Ampfibian'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Mutant Alien Leader']
},
{
    title: 'The Negative One: Final Strike',
    series: 'Omniverse',
    season: 8,
    episode: 4,
    synopsis: 'The Negative One executes his ultimate plan, forcing Ben and Rook to prevent the destruction of Bellwood.',
    aliens: ['Four Arms', 'Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One']
},
{
    title: 'Rath Rampage',
    series: 'Omniverse',
    season: 8,
    episode: 5,
    synopsis: 'Rath goes on a rampage due to a villain’s manipulation, and Ben must regain control with Rook’s help.',
    aliens: ['Rath', 'Four Arms', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko']
},
{
    title: 'It’s a Mad, Mad, Mad Ben: Part 5',
    series: 'Omniverse',
    season: 8,
    episode: 6,
    synopsis: 'Multiple villains converge once again, and Ben and Rook must coordinate all their alien powers to save the city.',
    aliens: ['Four Arms', 'Shocksquatch', 'Bloxx'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Killerby']
},
{
    title: 'Helix Returns',
    series: 'Omniverse',
    season: 8,
    episode: 7,
    synopsis: 'Helix comes back with a dangerous plan, forcing Ben and Rook to neutralize him quickly.',
    aliens: ['Four Arms', 'Kickin Hawk', 'Diamondhead'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Helix']
},
{
    title: 'Grudge Match V',
    series: 'Omniverse',
    season: 8,
    episode: 8,
    synopsis: 'Ben faces a long-time nemesis in a decisive battle while Rook supports him at every step.',
    aliens: ['Diamondhead', 'Four Arms', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Kraab']
},
{
    title: 'Outbreak: Part 2',
    series: 'Omniverse',
    season: 8,
    episode: 9,
    synopsis: 'The alien virus spreads further, and Ben and Rook race against time to save Bellwood.',
    aliens: ['Four Arms', 'Ampfibian', 'XLR8'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'Viral Alien']
},
{
    title: 'Omniverse Grand Finale',
    series: 'Omniverse',
    season: 8,
    episode: 10,
    synopsis: 'The series concludes with Ben and Rook confronting the ultimate coalition of villains in an epic showdown.',
    aliens: ['Four Arms', 'Diamondhead', 'Rath'],
    characters: ['Ben Tennyson', 'Rook Blonko', 'The Negative One', 'Killerby']
},



];






const seedDB = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected.');

        await Alien.deleteMany({});
        await Alien.insertMany(alienData);
        console.log('Alien database seeded.');

        await Character.deleteMany({});
        await Character.insertMany(characterData);
        console.log('Character database seeded.');
        
        await Planet.deleteMany({});
        await Planet.insertMany(planetData);
        console.log('Planet database seeded.');

        console.log('Preparing to seed episodes...');
        await Episode.deleteMany({});
        
        const allAliens = await Alien.find({}, 'name _id');
        const allCharacters = await Character.find({}, 'name _id');

        const alienMap = new Map(allAliens.map(a => [a.name, a._id]));
        const characterMap = new Map(allCharacters.map(c => [c.name, c._id]));

        const processedEpisodes = episodeData.map(ep => ({
            ...ep,
            aliens: ep.aliens.map(name => alienMap.get(name)).filter(id => id),
            characters: ep.characters.map(name => characterMap.get(name)).filter(id => id)
        }));

        await Episode.insertMany(processedEpisodes);
        console.log('Episode database seeded successfully!');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        console.log('Closing database connection.');
        mongoose.connection.close();
    }
};




seedDB();






