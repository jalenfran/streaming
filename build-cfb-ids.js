// Script to build CFB team ID mapping from live games
// Run this periodically to build up the mapping
// node build-cfb-ids.js

import https from 'https';
import fs from 'fs';

const fetchScoreboard = () => {
  return new Promise((resolve, reject) => {
    https.get('https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard', {
      rejectUnauthorized: false
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const CFB_TEAMS = [
  { name: 'Alabama Crimson Tide', slug: 'alabamacrimsontide', code: 'ALA' },
  { name: 'Auburn Tigers', slug: 'auburntigers', code: 'AUB' },
  { name: 'Clemson Tigers', slug: 'clemsontigers', code: 'CLEM' },
  { name: 'Florida Gators', slug: 'floridagators', code: 'FLA' },
  { name: 'Florida State Seminoles', slug: 'floridastateseminoles', code: 'FSU' },
  { name: 'Georgia Bulldogs', slug: 'georgiabulldogs', code: 'UGA' },
  { name: 'LSU Tigers', slug: 'lsutigers', code: 'LSU' },
  { name: 'Miami Hurricanes', slug: 'miamihurricanes', code: 'MIA' },
  { name: 'Michigan Wolverines', slug: 'michiganwolverines', code: 'MICH' },
  { name: 'Notre Dame Fighting Irish', slug: 'notredamefightingirish', code: 'ND' },
  { name: 'Ohio State Buckeyes', slug: 'ohiostatebuckeyes', code: 'OSU' },
  { name: 'Oklahoma Sooners', slug: 'oklahomasooners', code: 'OKLA' },
  { name: 'Oregon Ducks', slug: 'oregonducks', code: 'ORE' },
  { name: 'Penn State Nittany Lions', slug: 'pennstatenittanylions', code: 'PSU' },
  { name: 'Texas Longhorns', slug: 'texaslonghorns', code: 'TEX' },
  { name: 'USC Trojans', slug: 'usctrojans', code: 'USC' },
  { name: 'Tennessee Volunteers', slug: 'tennesseevolunteers', code: 'TENN' },
  { name: 'Texas A&M Aggies', slug: 'texasamaggies', code: 'TA&M' },
  { name: 'Wisconsin Badgers', slug: 'wisconsinbadgers', code: 'WIS' },
  { name: 'Washington Huskies', slug: 'washingtonhuskies', code: 'WASH' },
  { name: 'Michigan State Spartans', slug: 'michiganstatespartans', code: 'MSU' },
  { name: 'Iowa Hawkeyes', slug: 'iowahawkeyes', code: 'IOWA' },
  { name: 'Oklahoma State Cowboys', slug: 'oklahomastatecowboys', code: 'OKST' },
  { name: 'TCU Horned Frogs', slug: 'tcuhornedfrogs', code: 'TCU' },
  { name: 'Baylor Bears', slug: 'baylorbears', code: 'BAY' },
  { name: 'Stanford Cardinal', slug: 'stanfordcardinal', code: 'STAN' },
  { name: 'UCLA Bruins', slug: 'uclabruins', code: 'UCLA' },
  { name: 'Utah Utes', slug: 'utahutes', code: 'UTAH' },
  { name: 'Arizona State Sun Devils', slug: 'arizonastatesundevils', code: 'ASU' },
  { name: 'Arizona Wildcats', slug: 'arizonawildcats', code: 'ARIZ' },
  { name: 'Arkansas Razorbacks', slug: 'arkansasrazorbacks', code: 'ARK' },
  { name: 'Colorado Buffaloes', slug: 'coloradobuffaloes', code: 'COLO' },
  { name: 'Illinois Fighting Illini', slug: 'illinoisfightingillini', code: 'ILL' },
  { name: 'Indiana Hoosiers', slug: 'indianahoosiers', code: 'IND' },
  { name: 'Iowa State Cyclones', slug: 'iowastatecyclones', code: 'ISU' },
  { name: 'Kansas State Wildcats', slug: 'kansasstatewildcats', code: 'KSU' },
  { name: 'Kentucky Wildcats', slug: 'kentuckywildcats', code: 'UK' },
  { name: 'Louisville Cardinals', slug: 'louisvillecardinals', code: 'LOU' },
  { name: 'Maryland Terrapins', slug: 'marylandterrapins', code: 'MD' },
  { name: 'Minnesota Golden Gophers', slug: 'minnesotagoldengophers', code: 'MINN' },
  { name: 'Mississippi State Bulldogs', slug: 'mississippistatebulldogs', code: 'MSST' },
  { name: 'Missouri Tigers', slug: 'missouritigers', code: 'MIZ' },
  { name: 'Nebraska Cornhuskers', slug: 'nebraskacornhuskers', code: 'NEB' },
  { name: 'North Carolina Tar Heels', slug: 'northcarolinatarheels', code: 'UNC' },
  { name: 'NC State Wolfpack', slug: 'ncstatewolfpack', code: 'NCST' },
  { name: 'Ole Miss Rebels', slug: 'olemissrebels', code: 'MISS' },
  { name: 'Oregon State Beavers', slug: 'oregonstatebeavers', code: 'ORST' },
  { name: 'Purdue Boilermakers', slug: 'purdueboilermakers', code: 'PUR' },
  { name: 'South Carolina Gamecocks', slug: 'southcarolinagamecocks', code: 'SC' },
  { name: 'Texas Tech Red Raiders', slug: 'texastechredraiders', code: 'TTU' },
  { name: 'Virginia Tech Hokies', slug: 'virginiatechhokies', code: 'VT' },
  { name: 'Washington State Cougars', slug: 'washingtonstatecougars', code: 'WSU' },
  { name: 'West Virginia Mountaineers', slug: 'westvirginiamountaineers', code: 'WVU' },
];

const findTeamMatch = (ourTeam, espnTeam) => {
  const ourName = ourTeam.name.toLowerCase();
  const espnName = (espnTeam.displayName || espnTeam.name || '').toLowerCase();
  
  // Extract university name (remove mascot)
  const getUni = (name) => {
    const parts = name.split(' ');
    // Remove last 1-2 words (usually mascot)
    return parts.slice(0, Math.max(1, parts.length - 2)).join(' ').trim();
  };
  
  const ourUni = getUni(ourName);
  const espnUni = getUni(espnName);
  
  // Exact match
  if (ourName === espnName) return true;
  
  // University name match
  if (ourUni === espnUni && ourUni.length > 3) return true;
  
  // Key word match
  const ourKey = ourUni.split(' ').find(w => w.length > 4) || ourUni;
  const espnKey = espnUni.split(' ').find(w => w.length > 4) || espnUni;
  
  if (ourKey && espnKey && (ourName.includes(espnKey) || espnName.includes(ourKey))) {
    return true;
  }
  
  return false;
};

(async () => {
  try {
    const data = await fetchScoreboard();
    const events = data.events || [];
    
    console.log(`Found ${events.length} games in scoreboard\n`);
    
    const teamIdMap = {};
    
    events.forEach(event => {
      const competition = event.competitions?.[0];
      if (competition?.competitors) {
        competition.competitors.forEach(competitor => {
          const team = competitor.team;
          if (team) {
            // Try to match to our teams
            const match = CFB_TEAMS.find(ourTeam => findTeamMatch(ourTeam, team));
            if (match) {
              teamIdMap[match.slug] = team.id;
              console.log(`✓ ${match.name} -> ID: ${team.id} (${team.displayName})`);
            }
          }
        });
      }
    });
    
    console.log(`\n\nFound ${Object.keys(teamIdMap).length} team IDs\n`);
    console.log('Team ID mapping:');
    console.log(JSON.stringify(teamIdMap, null, 2));
    
    // Generate code
    console.log('\n\nJavaScript object:');
    console.log('const CFB_ESPN_IDS = {');
    Object.entries(teamIdMap).forEach(([slug, id]) => {
      console.log(`  '${slug}': ${id},`);
    });
    console.log('}');
    
  } catch (error) {
    console.error('Error:', error);
  }
})();

