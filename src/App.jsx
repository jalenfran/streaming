import { useState, useEffect, useRef } from 'react'
import { PlayCircle, Clock, Radio } from 'lucide-react'
import './App.css'

// Hls is loaded from CDN in index.html
const Hls = window.Hls

const NFL_TEAMS = [
  { name: 'Arizona Cardinals', slug: 'arizonacardinals', code: 'ARI' },
  { name: 'Atlanta Falcons', slug: 'atlantafalcons', code: 'ATL' },
  { name: 'Baltimore Ravens', slug: 'baltimoreravens', code: 'BAL' },
  { name: 'Buffalo Bills', slug: 'buffalobills', code: 'BUF' },
  { name: 'Carolina Panthers', slug: 'carolinapanthers', code: 'CAR' },
  { name: 'Chicago Bears', slug: 'chicagobears', code: 'CHI' },
  { name: 'Cincinnati Bengals', slug: 'cincinnatibengals', code: 'CIN' },
  { name: 'Cleveland Browns', slug: 'clevelandbrowns', code: 'CLE' },
  { name: 'Dallas Cowboys', slug: 'dallascowboys', code: 'DAL' },
  { name: 'Denver Broncos', slug: 'denverbroncos', code: 'DEN' },
  { name: 'Detroit Lions', slug: 'detroitlions', code: 'DET' },
  { name: 'Green Bay Packers', slug: 'greenbaypackers', code: 'GB' },
  { name: 'Houston Texans', slug: 'houstontexans', code: 'HOU' },
  { name: 'Indianapolis Colts', slug: 'indianapoliscolts', code: 'IND' },
  { name: 'Jacksonville Jaguars', slug: 'jacksonvillejaguars', code: 'JAX' },
  { name: 'Kansas City Chiefs', slug: 'kansascitychiefs', code: 'KC' },
  { name: 'Las Vegas Raiders', slug: 'lasvegasraiders', code: 'LV' },
  { name: 'Los Angeles Chargers', slug: 'losangeleschargers', code: 'LAC' },
  { name: 'Los Angeles Rams', slug: 'losangelesrams', code: 'LAR' },
  { name: 'Miami Dolphins', slug: 'miamidolphins', code: 'MIA' },
  { name: 'Minnesota Vikings', slug: 'minnesotavikings', code: 'MIN' },
  { name: 'New England Patriots', slug: 'newenglandpatriots', code: 'NE' },
  { name: 'New Orleans Saints', slug: 'neworleanssaints', code: 'NO' },
  { name: 'New York Giants', slug: 'newyorkgiants', code: 'NYG' },
  { name: 'New York Jets', slug: 'newyorkjets', code: 'NYJ' },
  { name: 'Philadelphia Eagles', slug: 'philadelphiaeagles', code: 'PHI' },
  { name: 'Pittsburgh Steelers', slug: 'pittsburghsteelers', code: 'PIT' },
  { name: 'San Francisco 49ers', slug: 'sanfrancisco49ers', code: 'SF' },
  { name: 'Seattle Seahawks', slug: 'seattleseahawks', code: 'SEA' },
  { name: 'Tampa Bay Buccaneers', slug: 'tampabaybuccaneers', code: 'TB' },
  { name: 'Tennessee Titans', slug: 'tennesseetitans', code: 'TEN' },
  { name: 'Washington Commanders', slug: 'washingtoncommanders', code: 'WAS' },
]

const NBA_TEAMS = [
  { name: 'Atlanta Hawks', slug: 'atlantahawks', code: 'ATL' },
  { name: 'Boston Celtics', slug: 'bostonceltics', code: 'BOS' },
  { name: 'Brooklyn Nets', slug: 'brooklynnets', code: 'BKN' },
  { name: 'Charlotte Hornets', slug: 'charlottehornets', code: 'CHA' },
  { name: 'Chicago Bulls', slug: 'chicagobulls', code: 'CHI' },
  { name: 'Cleveland Cavaliers', slug: 'clevelandcavaliers', code: 'CLE' },
  { name: 'Dallas Mavericks', slug: 'dallasmavericks', code: 'DAL' },
  { name: 'Denver Nuggets', slug: 'denvernuggets', code: 'DEN' },
  { name: 'Detroit Pistons', slug: 'detroitpistons', code: 'DET' },
  { name: 'Golden State Warriors', slug: 'goldenstatewarriors', code: 'GS' },
  { name: 'Houston Rockets', slug: 'houstonrockets', code: 'HOU' },
  { name: 'Indiana Pacers', slug: 'indianapacers', code: 'IND' },
  { name: 'LA Clippers', slug: 'laclippers', code: 'LAC' },
  { name: 'Los Angeles Lakers', slug: 'losangeleslakers', code: 'LAL' },
  { name: 'Memphis Grizzlies', slug: 'memphisgrizzlies', code: 'MEM' },
  { name: 'Miami Heat', slug: 'miamiheat', code: 'MIA' },
  { name: 'Milwaukee Bucks', slug: 'milwaukeebucks', code: 'MIL' },
  { name: 'Minnesota Timberwolves', slug: 'minnesotatimberwolves', code: 'MIN' },
  { name: 'New Orleans Pelicans', slug: 'neworleanspelicans', code: 'NO' },
  { name: 'New York Knicks', slug: 'newyorkknicks', code: 'NY' },
  { name: 'Oklahoma City Thunder', slug: 'oklahomacitythunder', code: 'OKC' },
  { name: 'Orlando Magic', slug: 'orlandomagic', code: 'ORL' },
  { name: 'Philadelphia 76ers', slug: 'philadelphia76ers', code: 'PHI' },
  { name: 'Phoenix Suns', slug: 'phoenixsuns', code: 'PHX' },
  { name: 'Portland Trail Blazers', slug: 'portlandtrailblazers', code: 'POR' },
  { name: 'Sacramento Kings', slug: 'sacramentokings', code: 'SAC' },
  { name: 'San Antonio Spurs', slug: 'sanantoniospurs', code: 'SA' },
  { name: 'Toronto Raptors', slug: 'torontoraptors', code: 'TOR' },
  { name: 'Utah Jazz', slug: 'utahjazz', code: 'UTAH' },
  { name: 'Washington Wizards', slug: 'washingtonwizards', code: 'WAS' },
]

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
]

const LEAGUES = {
  nfl: { name: 'NFL', teams: NFL_TEAMS, apiPath: 'football/nfl' },
  nba: { name: 'NBA', teams: NBA_TEAMS, apiPath: 'basketball/nba' },
  cfb: { name: 'CFB', teams: CFB_TEAMS, apiPath: 'football/college-football' },
}

// Known ESPN team IDs for major CFB teams (from live games and manual mapping)
const CFB_ESPN_IDS = {
  'alabamacrimsontide': 333,
  'auburntigers': 2,
  'clemsontigers': 228,
  'floridagators': 57, // Note: 2229 is FIU, using 57 for UF
  'floridastateseminoles': 52,
  'georgiabulldogs': 61,
  'lsutigers': 99,
  'miamihurricanes': 2390,
  'michiganwolverines': 130,
  'notredamefightingirish': 87,
  'ohiostatebuckeyes': 194,
  'oklahomasooners': 201,
  'oregonducks': 2483,
  'pennstatenittanylions': 213,
  'texaslonghorns': 251,
  'usctrojans': 30,
  'tennesseevolunteers': 2633,
  'texasamaggies': 245,
  'wisconsinbadgers': 275,
  'washingtonhuskies': 264,
  'michiganstatespartans': 127,
  'iowahawkeyes': 2294,
  'oklahomastatecowboys': 197,
  'tcuhornedfrogs': 2628,
  'baylorbears': 239,
  'stanfordcardinal': 24,
  'uclabruins': 26,
  'utahutes': 254,
  'arizonastatesundevils': 9,
  'arizonawildcats': 12,
  'arkansasrazorbacks': 8,
  'coloradobuffaloes': 38,
  'illinoisfightingillini': 356,
  'indianahoosiers': 84,
  'iowastatecyclones': 66,
  'kansasstatewildcats': 2306,
  'kentuckywildcats': 96,
  'louisvillecardinals': 97,
  'marylandterrapins': 120,
  'minnesotagoldengophers': 135,
  'mississippistatebulldogs': 344,
  'missouritigers': 142,
  'nebraskacornhuskers': 158,
  'northcarolinatarheels': 153,
  'ncstatewolfpack': 152,
  'olemissrebels': 145,
  'oregonstatebeavers': 204,
  'purdueboilermakers': 2509,
  'southcarolinagamecocks': 2579,
  'texastechredraiders': 2641,
  'virginiatechhokies': 259,
  'washingtonstatecougars': 265,
  'westvirginiamountaineers': 277,
}

const getLogoUrl = (code, league, espnId = null, team = null) => {
  if (!code) return ''
  if (league === 'cfb') {
    // ESPN uses numeric team IDs for college football logos
    // Try espnId parameter first, then team.espnId, then lookup by slug
    let id = espnId || team?.espnId
    if (!id && team?.slug) {
      id = CFB_ESPN_IDS[team.slug]
    }
    if (id) {
      return `https://a.espncdn.com/i/teamlogos/ncaa/500/${id}.png`
    }
    // Fallback to code if no ID available (won't work but shows fallback)
    return `https://a.espncdn.com/i/teamlogos/ncaa/500/${code.toLowerCase()}.png`
  }
  return `https://a.espncdn.com/i/teamlogos/${league}/500/${code.toLowerCase()}.png`
}

// Map ESPN team data to our team slug
const findTeamByEspnData = (espnTeam, league) => {
  const teams = LEAGUES[league].teams
  if (!espnTeam) return null
  
  // For college football, ESPN uses team names/displayNames, not abbreviations
  if (league === 'cfb') {
    const teamName = espnTeam.displayName || espnTeam.name || espnTeam.shortDisplayName || ''
    // Try to match by team name
    let team = teams.find(t => {
      const ourName = t.name.toLowerCase()
      const espnName = teamName.toLowerCase()
      // Exact match or contains match
      return ourName === espnName || 
             ourName.includes(espnName) || 
             espnName.includes(ourName) ||
             // Match by key words (e.g., "Alabama" matches "Alabama Crimson Tide")
             ourName.split(' ').some(word => espnName.includes(word) && word.length > 3)
    })
    if (team) {
      // Store ESPN team ID for logo URL
      return { ...team, espnId: espnTeam.id }
    }
    
    // Try abbreviation as fallback
    if (espnTeam.abbreviation) {
      team = teams.find(t => t.code === espnTeam.abbreviation)
      if (team) {
        return { ...team, espnId: espnTeam.id }
      }
    }
    return null
  }
  
  // For NFL/NBA, use abbreviation
  const abbrev = espnTeam.abbreviation || espnTeam.id
  if (!abbrev) return null
  
  // Try exact match first
  let team = teams.find(t => t.code === abbrev)
  if (team) return team
  
  // Try case-insensitive
  team = teams.find(t => t.code.toLowerCase() === abbrev.toLowerCase())
  if (team) return team
  
  return null
}

function App() {
  const [selectedLeague, setSelectedLeague] = useState('nfl')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [status, setStatus] = useState('')
  const [liveGames, setLiveGames] = useState([])
  const [loadingGames, setLoadingGames] = useState(false)
  const [redzoneAvailable, setRedzoneAvailable] = useState(false)
  const [checkingRedzone, setCheckingRedzone] = useState(false)
  const hlsRef = useRef(null)
  const blobUrlRef = useRef(null)
  const videoRef = useRef(null)

  // Proxy is built into the app:
  // - Local dev: Vite plugin handles /api/proxy
  // - Vercel: Serverless function handles /api/proxy
  const localProxy = '/api/proxy'

  const getStreamUrl = (teamSlug) => {
    // Special case for RedZone
    if (teamSlug === 'redzone') {
      return `https://gg.poocloud.in/redzone/index.m3u8`
    }
    return `https://gg.poocloud.in/${teamSlug}/index.m3u8`
  }

  const getProxiedUrl = (url) => {
    // Always use /api/proxy (works for both Vite dev and Vercel production)
    return `/api/proxy?url=${encodeURIComponent(url)}`
  }

  const checkRedzoneAvailability = async () => {
    if (selectedLeague !== 'nfl') {
      setRedzoneAvailable(false)
      return
    }

    setCheckingRedzone(true)
    try {
      const redzoneUrl = getStreamUrl('redzone')
      const proxiedUrl = getProxiedUrl(redzoneUrl)
      
      // Try to fetch the manifest with a timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      // Use GET to check if manifest is valid (HEAD doesn't return body)
      const response = await fetch(proxiedUrl, {
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (response && response.ok) {
        const text = await response.text()
        // Check if it's a valid HLS manifest
        const isValid = text.includes('#EXT') && !text.includes('<!DOCTYPE')
        setRedzoneAvailable(isValid)
      } else {
        setRedzoneAvailable(false)
      }
    } catch (error) {
      console.log('RedZone check failed:', error.message)
      setRedzoneAvailable(false)
    } finally {
      setCheckingRedzone(false)
    }
  }

  const fetchLiveGames = async (league) => {
    setLoadingGames(true)
    try {
      const apiPath = LEAGUES[league].apiPath
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${apiPath}/scoreboard`)
      const data = await response.json()
      
      const activeGames = []
      const now = new Date()
      
      if (data.events) {
        data.events.forEach(event => {
          const status = event.status?.type
          const statusName = event.status?.type?.name
          const competition = event.competitions?.[0]
          const competitionStatus = competition?.status?.type?.name
          
          // Exclude scheduled games that haven't started
          const isScheduled = status === 'STATUS_SCHEDULED' || 
                             statusName === 'STATUS_SCHEDULED' ||
                             competitionStatus === 'STATUS_SCHEDULED'
          
          // Show game as live if it's NOT final and NOT scheduled
          const isFinal = status === 'STATUS_FINAL' || 
                         statusName === 'STATUS_FINAL' || 
                         competitionStatus === 'STATUS_FINAL' ||
                         event.status?.type?.completed ||
                         (competition?.status?.type?.completed === true)
          
          // Get status text to check if it's a scheduled time/date
          const statusText = competition?.status?.type?.shortDetail || 
                            competition?.status?.type?.detail ||
                            event.status?.type?.shortDetail || ''
          
          // Get game start time
          const gameDate = event.date ? new Date(event.date) : null
          const minutesUntilStart = gameDate ? Math.floor((gameDate - now) / (1000 * 60)) : null
          const startsWithin30Min = minutesUntilStart !== null && minutesUntilStart >= 0 && minutesUntilStart <= 30
          
          // Check if status text looks like a scheduled time (e.g., "12/21", "7:00 PM", etc.)
          const looksLikeScheduled = /^\d{1,2}\/\d{1,2}/.test(statusText) || // Date format
                                    /^\d{1,2}:\d{2}\s*(AM|PM)/i.test(statusText) || // Time format
                                    statusText.toLowerCase().includes('et') ||
                                    statusText.toLowerCase().includes('pt') ||
                                    statusText.toLowerCase().includes('ct')
          
          // Show if: (not final AND has started) OR (scheduled AND starts within 30 min)
          if (!isFinal && competition?.competitors) {
            const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
            const awayTeam = competition.competitors.find(c => c.homeAway === 'away')
            
            if (homeTeam && awayTeam) {
              // Check if game has actually started (has scores or is in a live state)
              const hasStarted = competitionStatus === 'STATUS_IN_PROGRESS' ||
                                statusName === 'STATUS_IN_PROGRESS' ||
                                status === 'STATUS_IN_PROGRESS' ||
                                competitionStatus === 'STATUS_HALFTIME' ||
                                statusName === 'STATUS_HALFTIME' ||
                                status === 'STATUS_HALFTIME' ||
                                competitionStatus === 'STATUS_DELAYED' ||
                                (homeTeam.score && parseInt(homeTeam.score) > 0) ||
                                (awayTeam.score && parseInt(awayTeam.score) > 0) ||
                                statusText.toLowerCase().includes('q') ||
                                statusText.toLowerCase().includes('quarter') ||
                                statusText.toLowerCase().includes('half') ||
                                statusText.toLowerCase().includes('ot') ||
                                statusText.toLowerCase().includes('overtime')
              
              // Show if game has started OR starts within 30 minutes
              if (hasStarted || (isScheduled && startsWithin30Min)) {
                const homeTeamData = findTeamByEspnData(homeTeam.team, league)
                const awayTeamData = findTeamByEspnData(awayTeam.team, league)
                
                // Only add if both teams are found
                if (homeTeamData && awayTeamData) {
                  // Get status text
                  let displayStatus = statusText || 'LIVE'
                  
                  // If scheduled and starting soon, show countdown
                  if (isScheduled && startsWithin30Min && minutesUntilStart !== null) {
                    if (minutesUntilStart === 0) {
                      displayStatus = 'Starting now'
                    } else {
                      displayStatus = `${minutesUntilStart} min`
                    }
                  } else if (!displayStatus.toLowerCase().includes('final') && 
                            !displayStatus.toLowerCase().includes('end')) {
                    displayStatus = displayStatus || 'LIVE'
                  }
                  
                  activeGames.push({
                    id: event.id,
                    homeTeam: { ...homeTeamData, league }, // Store league with team data
                    awayTeam: { ...awayTeamData, league }, // Store league with team data
                    homeScore: homeTeam.score || '0',
                    awayScore: awayTeam.score || '0',
                    status: displayStatus,
                    // Always use home team slug for streaming
                    streamSlug: homeTeamData.slug
                  })
                }
              }
            }
          }
        })
      }
      
      setLiveGames(activeGames)
    } catch (error) {
      console.error('Error fetching live games:', error)
      setLiveGames([])
    } finally {
      setLoadingGames(false)
    }
  }

  useEffect(() => {
    fetchLiveGames(selectedLeague)
    checkRedzoneAvailability()
    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchLiveGames(selectedLeague)
      checkRedzoneAvailability()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [selectedLeague])

  const cleanup = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
  }

  const loadStream = async (teamSlug) => {
    cleanup()
    setStatus('Loading stream...')

    try {
      const streamUrl = getStreamUrl(teamSlug)
      const manifestUrl = getProxiedUrl(streamUrl)

      const response = await fetch(manifestUrl).catch(() => null)

      if (!response || !response.ok) {
        setStatus('Failed to load stream')
        return
      }

      const manifestText = await response.text()

      if (manifestText.includes('<!DOCTYPE') || manifestText.includes('google')) {
        setStatus('Stream blocked - proxy error')
        return
      }

      if (!manifestText.includes('#EXT')) {
        setStatus('Invalid manifest received')
        return
      }

      setStatus('Processing...')

      // Convert relative URLs to absolute, but keep original (don't proxy in manifest)
      // We'll proxy via xhrSetup instead
      const baseUrl = streamUrl.substring(0, streamUrl.lastIndexOf('/') + 1)
      const lines = manifestText.split('\n')
      const rewritten = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) return line

        // Convert relative URLs to absolute, but keep original (don't proxy yet)
        if (trimmed.startsWith('http')) {
          return trimmed
        }
        return new URL(trimmed, baseUrl).href
      }).join('\n')

      // Create blob URL with original absolute URLs
      const blob = new Blob([rewritten], { type: 'application/vnd.apple.mpegurl' })
      const newBlobUrl = URL.createObjectURL(blob)
      blobUrlRef.current = newBlobUrl

      setStatus('Ready')

      const video = videoRef.current
      if (!video) return

      if (Hls.isSupported()) {
        const hlsInstance = new Hls({
          xhrSetup: function (xhr, url) {
            xhr.withCredentials = false
            // Skip proxying blob URLs (they're local)
            if (url.startsWith('blob:')) {
              return
            }
            // Proxy all HTTP/HTTPS requests through server
            const originalOpen = xhr.open.bind(xhr)
            xhr.open = function(method, requestUrl, ...args) {
              // Proxy the URL
              const proxiedUrl = getProxiedUrl(requestUrl)
              return originalOpen(method, proxiedUrl, ...args)
            }
          },
        })

        hlsInstance.loadSource(newBlobUrl)
        hlsInstance.attachMedia(video)

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
          setStatus('')
          video.play().catch(() => {
            // Autoplay blocked
          })
        })

        hlsInstance.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            console.error('HLS Error:', data)
            setStatus('Error: ' + data.type)
          }
        })

        hlsRef.current = hlsInstance
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = newBlobUrl
        setStatus('')
      } else {
        setStatus('HLS not supported')
      }
    } catch (error) {
      setStatus('Error: ' + error.message)
      console.error(error)
    }
  }

  useEffect(() => {
    if (selectedTeam) {
      loadStream(selectedTeam.slug)
    }
    return () => {
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam])

  const handleTeamSelect = (team) => {
    setSelectedTeam(team)
  }

  const handleLiveGameSelect = (game) => {
    // Use the home team slug for streaming (works for both home and away)
    const team = game.homeTeam
    setSelectedTeam({ ...team, displayName: `${game.awayTeam.name} @ ${game.homeTeam.name}` })
  }

  const handleBack = () => {
    cleanup()
    setSelectedTeam(null)
    setStatus('')
    setSearchQuery('')
  }

  const handleLeagueChange = (league) => {
    setSelectedLeague(league)
    setSearchQuery('')
    setSelectedTeam(null)
    cleanup()
  }

  // Filter teams based on search query
  const filteredTeams = LEAGUES[selectedLeague].teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (selectedTeam) {
    return (
      <div className="app">
        <div className="player-container">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <div className="team-name">{selectedTeam.displayName || selectedTeam.name}</div>
          <div className="video-wrapper">
            <video
              ref={videoRef}
              controls
              className="video-player"
            ></video>
          </div>
          {status && <div className="status">{status}</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="teams-container">
        <h1 className="title">Sports Streams</h1>
        
        <div className="controls-bar">
          <div className="league-selector">
            {Object.entries(LEAGUES).map(([key, league]) => (
              <button
                key={key}
                className={`league-button ${selectedLeague === key ? 'active' : ''}`}
                onClick={() => handleLeagueChange(key)}
              >
                {league.name}
              </button>
            ))}
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {liveGames.length > 0 && (
          <div className="live-games-section">
            <h2 className="live-games-title">
              <PlayCircle size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} />
              Live Now / Starting Soon
            </h2>
            <div className="live-games-grid">
              {liveGames.map((game) => (
                <div
                  key={game.id}
                  className="live-game-card"
                  onClick={() => handleLiveGameSelect(game)}
                >
                  <div className="live-game-teams">
                    {game.awayTeam && (
                      <div className="live-game-team">
                        <img 
                          src={getLogoUrl(game.awayTeam.code, game.awayTeam.league || selectedLeague, game.awayTeam.espnId)} 
                          alt={game.awayTeam.name}
                          className="live-game-logo"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <span className="live-game-team-name">{game.awayTeam.name}</span>
                        <span className="live-game-score">{game.awayScore}</span>
                      </div>
                    )}
                    <div className="live-game-vs">@</div>
                    {game.homeTeam && (
                      <div className="live-game-team">
                        <img 
                          src={getLogoUrl(game.homeTeam.code, game.homeTeam.league || selectedLeague, game.homeTeam.espnId)} 
                          alt={game.homeTeam.name}
                          className="live-game-logo"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <span className="live-game-team-name">{game.homeTeam.name}</span>
                        <span className="live-game-score">{game.homeScore}</span>
                      </div>
                    )}
                  </div>
                  <div className="live-game-status">
                    {game.status.toLowerCase().includes('starts') || game.status.toLowerCase().includes('starting') || game.status.toLowerCase().includes('min') ? (
                      <>
                        <Clock size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                        {game.status}
                      </>
                    ) : (
                      <>
                        <Radio size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '4px' }} />
                        {game.status}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFL RedZone - Special card for NFL - Only show when available */}
        {selectedLeague === 'nfl' && redzoneAvailable && (
          <div className="redzone-section">
            <h2 className="redzone-title">NFL RedZone</h2>
            <div 
              className="redzone-card"
              onClick={() => handleTeamSelect({ slug: 'redzone', name: 'NFL RedZone', displayName: 'NFL RedZone' })}
            >
              <div className="redzone-content">
                <div className="redzone-badge">
                  <div className="redzone-badge-text">RZ</div>
                </div>
                <div className="redzone-info">
                  <h3 className="redzone-name">NFL RedZone</h3>
                  <p className="redzone-description">Watch every touchdown from every game</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="teams-grid">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <div
                key={team.slug}
                className="team-card"
                onClick={() => handleTeamSelect(team)}
              >
                <img 
                  src={getLogoUrl(team.code, selectedLeague, null, team)} 
                  alt={team.name}
                  className="team-logo-img"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
                <div className="team-logo-fallback" style={{ display: 'none' }}>
                  {team.code}
                </div>
                <div className="team-name-small">{team.name}</div>
              </div>
            ))
          ) : (
            <div className="no-results">No teams found</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
