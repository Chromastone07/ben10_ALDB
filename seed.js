require('dotenv').config();
const mongoose = require('mongoose');
const Alien = require('./models/alien');

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
}


];

const seedDB = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected. Deleting existing alien data...');
        
        await Alien.deleteMany({});
        console.log('Existing data deleted. Inserting new data...');

        await Alien.insertMany(alienData);
        console.log('Database seeded successfully!');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        console.log('Closing database connection.');
        mongoose.connection.close();
    }
};

seedDB();






