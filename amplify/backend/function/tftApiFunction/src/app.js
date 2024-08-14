const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const DATA_FILE_PATH = path.join(__dirname, 'CDragonSet12TFT.json');


console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


const excludeSubstrings = [
  'Artifact',
  'Debug',
  'Grant',
  'Consumable',
  'Assist',
  'TFT_Item_ForceOfNature',
  'TFT_Item_Zephyr',
  'TFT_Item_KnightsVow',
  'TFT_Item_UnstableTreasureChest',
  "TFT_Item_Sentinelswar",
  "TFT_Item_EternalFlame",
  'TFT_Item_UnusableSlot',
  'TFT_Item_NegatronCloak',
  'TFT_Item_Tear',
  'TFT_Item_Recurve',
  'TFT_Item_FreeBFSword',
  'TFT_Item_Moonstone',
  'TFT_Item_ZekesHerald',
  'TFT_Item_SparringGloves',
  'Aegis',
  'TFT_Item_Seraphsembrace',
  "TFT_Item_Freedeathblade",
  'TFT_Item_CrestOfCinders',
  'TFT_Item_RadiantVirtue',
  'TFT_Item_BansheesVeil',
  'TFT_Item_LocketOfTheIronSolari',
  'Shroud',
  'TFT_Item_TitanicHydra',
  'Needlessly',
  'TFT_Item_YoumuusGhostblade',
  'TFT_Item_ChainVest',
  'TFT_Item_BFSword',
  'TFT_Item_SupportKnightsVow',
  'TFT_Item_Spite',
  'TFT_Item_ThiefsGloves',
  'TFT_Item_Unknown',
  'Accomplice',
  'Ornn',
  'Obsidian',
  'Mortal',
  'Omen',
  'TFT_Item_JammedSlot',
  'TFT_Item_GiantsBelt',
];

const excludeChampSubStrings = [
  "TFT11_",
  'TFT5',
  'TFT_',
  'Armory',
  'Voidspawn',
  'Dummy',
  "tft12_yuumi",
  'TFT_BlueGolem',
  "TFT12_neekocrab",
  "TFT12_Swaindemonform",
  "TFT12_witchfrog",
  'TFT6_',
  'TFT12_EldritchDaisy',
  'TFT12_EldritchMalphite',
  'TFT12_EldritchVolibear',
  'TFT12_zaptower',
  'TFT12_EldritchBigVolibear',
  "TFT12_witchfrog",
  'TFT12_EldritchVolibea',
  'DragonlordFlames',
  'TFT9_',
  "tft12_winterstatue",
  "tft12_shyvanadragon",
  'ZyraThornPlant',
  'AzirSoldier',
];

const traitThresholds = {
  Arcana: [2, 3, 4, 5],
  Chrono: [2, 4, 6],
  Dragon: [2, 3],
  Druid: [1],
  Eldritch: [3, 5, 7, 10],
  Faerie: [2, 4, 6, 9],
  Frost: [3, 5, 7, 9],
  Honeymancy: [3, 5, 7],
  Portal: [3, 6, 8, 10],
  Pyro: [2, 3, 4, 5],
  Ravenous: [1],
  Sugarcraft: [2, 4, 6,],
  Witchcraft: [2, 4, 6, 8],
  Ascendant: [1],
  Bastion: [2, 4, 6, 8],
  "Bat Queen": [1],
  "Best Friends": [1],
  Blaster: [2, 4, 6],
  Hunter: [2, 4, 6],
  Incantor: [2, 4],
  Mage: [3, 5, 7, 9],
  Multistriker: [3, 5, 7, 9],
  Preserver: [2, 4, 6, 8],
  Scholar: [2, 4, 6],
  Shapeshifter: [2, 4, 6, 8],
  Vanguard: [2, 4, 6],
  Warrior: [2, 4, 6],
};

function selectRandom(arr, num) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function containsExcludedChampSubstring(championId) {
  return championId && excludeChampSubStrings.some(substring => championId.toLowerCase().includes(substring.toLowerCase()));
}

function containsExcludedSubstring(itemId) {
  return itemId && excludeSubstrings.some(substring => itemId.toLowerCase().includes(substring.toLowerCase()));
}

function countTraits(comp) {
  const traitCounts = {};
  const activeTraits = {};

  comp.forEach(champion => {
    champion.traits.forEach(trait => {
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });
  });

  Object.keys(traitCounts).forEach(trait => {
    const count = traitCounts[trait];
    const thresholds = traitThresholds[trait] || [];
    let activeLevel = 0;

    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (count >= thresholds[i]) {
        activeLevel = i + 1;
        break;
      }
    }

    if (activeLevel > 0) {
      activeTraits[trait] = {
        count: count,
        activeLevel: activeLevel,
        maxLevel: thresholds.length
      };
    }
  });

  return activeTraits;
}

function generateCompName(champions) {
  const adjectives = [
    "Inting", "Trolling", "Silly", "Goofy", "Chaotic", "Whimsical", "Moisty",
    "Ridiculous", "Promiscuous", "Bonkers", 
    "Peculiar", "Eccentric", "Unconventional", "Quirky"
  ];

  const traits = champions.flatMap(champion => champion.traits);
  const mostCommonTrait = traits.sort((a, b) =>
    traits.filter(v => v === a).length - traits.filter(v => v === b).length
  ).pop();

  const specialChampion = champions.find(champion => champion.special);
  const cleanedChampionName = specialChampion.characterName.replace(/^TFT12_/, '');

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];

  const numbers = ["Double", "Triple", "Quadruple", "Quintuple"];
  const times = ["Dawn", "Midday", "Dusk", "Midnight", "Donger"];
  const locations = ["Back Alley", "High Roller", "Underdog", "Top Deck"];

  const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
  const randomTime = times[Math.floor(Math.random() * times.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];

  return `${randomAdjective} ${randomNumber} ${randomTime} ${randomLocation} ${mostCommonTrait} ${cleanedChampionName}`;
}

exports.handler = async (event) => {
  console.log('Received request for /api/units_items');
  
  const generateNew = Math.random() < 0.5;

  if (generateNew) {
    try {
      const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error parsing JSON data' })
        };
      }
      if (!parsedData || !parsedData.items || !parsedData.sets || !parsedData.sets["12"] || !parsedData.sets["12"].champions) {
        console.error('Invalid JSON structure or missing required data');
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Invalid JSON structure' })
        };
      }

      const items = parsedData.items;
      const champions = parsedData.sets["12"].champions;
      const filteredItems = items.filter(item => 
        item.apiName && item.apiName.startsWith('TFT_Item_') && 
        item.name && !item.name.toLowerCase().startsWith('tft_item_') &&
        !item.name.toLowerCase().startsWith('game_item') &&
        !containsExcludedSubstring(item.apiName) &&
        item.from === null 
      );

      const filteredChampions = champions.filter(champion => 
        champion.apiName && 
        !containsExcludedChampSubstring(champion.apiName) 
      );
      if (filteredChampions.length === 0) {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'No champions found matching the criteria' })
        };
      }

      const minChampions = Math.min(5, filteredChampions.length);
      const maxChampions = Math.min(10, filteredChampions.length);
      const randomCount = Math.floor(Math.random() * (maxChampions - minChampions + 1)) + minChampions;
      const randomChampions = selectRandom(filteredChampions, randomCount);

      if (randomChampions.length > 0) {
        const specialIndex = Math.floor(Math.random() * randomChampions.length);
        randomChampions[specialIndex].special = true;
        if (filteredItems.length > 0) {
          randomChampions[specialIndex].items = selectRandom(filteredItems, Math.min(3, filteredItems.length)).map(item => ({
            id: item.apiName,
            name: item.name
          }));
        }
      }

      const formattedChampions = randomChampions.map(champion => ({
        apiName: champion.apiName,
        characterName: champion.characterName,
        traits: champion.traits,
        special: champion.special || false,
        items: champion.items || []
      }));

      const seed = crypto.randomBytes(16).toString('hex');
      const compName = generateCompName(formattedChampions);

      const { data: insertedData, error: insertedError } = await supabase
        .from('comps')
        .insert({ seed, name: compName, comp: formattedChampions });

      if (insertedError) {
        console.error('Error storing comp in Supabase:', insertedError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error storing comp' })
        };
      }

      const activeTraits = countTraits(formattedChampions);

      return {
        statusCode: 200,
        body: JSON.stringify({ seed, name: compName, comp: formattedChampions, activeTraits, traitThresholds })
      };

    } catch (error) {
      console.error('Error generating new comp:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error generating new comp' })
      };
    }
  } else {
    try {
      const { data: retrievedData, error: retrievedError } = await supabase
        .from('comps')
        .select('*')
        .order('seed', { ascending: false })
        .limit(100);

      if (retrievedError) {
        console.error('Error retrieving comps from Supabase:', retrievedError);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Error retrieving comps' })
        };
      }

      if (retrievedData.length === 0) {
        console.log('No comps found in Supabase');
        return {
          statusCode: 404,
          body: JSON.stringify({ error: 'No comps found' })
        };
      }

      const randomComp = retrievedData[Math.floor(Math.random() * retrievedData.length)];
      const activeTraits = countTraits(randomComp.comp);

      return {
        statusCode: 200,
        body: JSON.stringify({
          seed: randomComp.seed,
          name: randomComp.name,
          comp: randomComp.comp,
          activeTraits: activeTraits,  
          traitThresholds: traitThresholds 
        })
      };
    } catch (error) {
      console.error('Error retrieving comp from Supabase:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error retrieving comp' })
      };
    }
  }
};
