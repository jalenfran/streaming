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

// CFB uses network channels instead of teams

const MLB_TEAMS = [
  { name: 'Arizona Diamondbacks', slug: 'arizonadiamondbacks', code: 'ARI' },
  { name: 'Atlanta Braves', slug: 'atlantabraves', code: 'ATL' },
  { name: 'Baltimore Orioles', slug: 'baltimoreorioles', code: 'BAL' },
  { name: 'Boston Red Sox', slug: 'bostonredsox', code: 'BOS' },
  { name: 'Chicago Cubs', slug: 'chicagocubs', code: 'CHC' },
  { name: 'Chicago White Sox', slug: 'chicagowhitesox', code: 'CWS' },
  { name: 'Cincinnati Reds', slug: 'cincinnatireds', code: 'CIN' },
  { name: 'Cleveland Guardians', slug: 'clevelandguardians', code: 'CLE' },
  { name: 'Colorado Rockies', slug: 'coloradorockies', code: 'COL' },
  { name: 'Detroit Tigers', slug: 'detroittigers', code: 'DET' },
  { name: 'Houston Astros', slug: 'houstonastros', code: 'HOU' },
  { name: 'Kansas City Royals', slug: 'kansascityroyals', code: 'KC' },
  { name: 'Los Angeles Angels', slug: 'losangelesangels', code: 'LAA' },
  { name: 'Los Angeles Dodgers', slug: 'losangelesdodgers', code: 'LAD' },
  { name: 'Miami Marlins', slug: 'miamimarlins', code: 'MIA' },
  { name: 'Milwaukee Brewers', slug: 'milwaukeebrewers', code: 'MIL' },
  { name: 'Minnesota Twins', slug: 'minnesotatwins', code: 'MIN' },
  { name: 'New York Mets', slug: 'newyorkmets', code: 'NYM' },
  { name: 'New York Yankees', slug: 'newyorkyankees', code: 'NYY' },
  { name: 'Oakland Athletics', slug: 'oaklandathletics', code: 'OAK' },
  { name: 'Philadelphia Phillies', slug: 'philadelphiaphillies', code: 'PHI' },
  { name: 'Pittsburgh Pirates', slug: 'pittsburghpirates', code: 'PIT' },
  { name: 'San Diego Padres', slug: 'sandiegopadres', code: 'SD' },
  { name: 'San Francisco Giants', slug: 'sanfranciscogiants', code: 'SF' },
  { name: 'Seattle Mariners', slug: 'seattlemariners', code: 'SEA' },
  { name: 'St. Louis Cardinals', slug: 'stlouiscardinals', code: 'STL' },
  { name: 'Tampa Bay Rays', slug: 'tampabayrays', code: 'TB' },
  { name: 'Texas Rangers', slug: 'texasrangers', code: 'TEX' },
  { name: 'Toronto Blue Jays', slug: 'torontobluejays', code: 'TOR' },
  { name: 'Washington Nationals', slug: 'washingtonnationals', code: 'WSH' },
]

const NHL_TEAMS = [
  { name: 'Anaheim Ducks', slug: 'anaheimducks', code: 'ANA' },
  { name: 'Arizona Coyotes', slug: 'arizonacoyotes', code: 'ARI' },
  { name: 'Boston Bruins', slug: 'bostonbruins', code: 'BOS' },
  { name: 'Buffalo Sabres', slug: 'buffalosabres', code: 'BUF' },
  { name: 'Calgary Flames', slug: 'calgaryflames', code: 'CGY' },
  { name: 'Carolina Hurricanes', slug: 'carolinahurricanes', code: 'CAR' },
  { name: 'Chicago Blackhawks', slug: 'chicagoblackhawks', code: 'CHI' },
  { name: 'Colorado Avalanche', slug: 'coloradoavalanche', code: 'COL' },
  { name: 'Columbus Blue Jackets', slug: 'columbusbluejackets', code: 'CBJ' },
  { name: 'Dallas Stars', slug: 'dallasstars', code: 'DAL' },
  { name: 'Detroit Red Wings', slug: 'detroitredwings', code: 'DET' },
  { name: 'Edmonton Oilers', slug: 'edmontonoilers', code: 'EDM' },
  { name: 'Florida Panthers', slug: 'floridapanthers', code: 'FLA' },
  { name: 'Los Angeles Kings', slug: 'losangeleskings', code: 'LA' },
  { name: 'Minnesota Wild', slug: 'minnesotawild', code: 'MIN' },
  { name: 'Montreal Canadiens', slug: 'montrealcanadiens', code: 'MTL' },
  { name: 'Nashville Predators', slug: 'nashvillepredators', code: 'NSH' },
  { name: 'New Jersey Devils', slug: 'newjerseydevils', code: 'NJD' },
  { name: 'New York Islanders', slug: 'newyorkislanders', code: 'NYI' },
  { name: 'New York Rangers', slug: 'newyorkrangers', code: 'NYR' },
  { name: 'Ottawa Senators', slug: 'ottawasenators', code: 'OTT' },
  { name: 'Philadelphia Flyers', slug: 'philadelphiaflyers', code: 'PHI' },
  { name: 'Pittsburgh Penguins', slug: 'pittsburghpenguins', code: 'PIT' },
  { name: 'San Jose Sharks', slug: 'sanjosesharks', code: 'SJ' },
  { name: 'Seattle Kraken', slug: 'seattlekraken', code: 'SEA' },
  { name: 'St. Louis Blues', slug: 'stlouisblues', code: 'STL' },
  { name: 'Tampa Bay Lightning', slug: 'tampabaylightning', code: 'TB' },
  { name: 'Toronto Maple Leafs', slug: 'torontomapleleafs', code: 'TOR' },
  { name: 'Vancouver Canucks', slug: 'vancouvercanucks', code: 'VAN' },
  { name: 'Vegas Golden Knights', slug: 'vegasgoldenknights', code: 'VGK' },
  { name: 'Washington Capitals', slug: 'washingtoncapitals', code: 'WSH' },
  { name: 'Winnipeg Jets', slug: 'winnipegjets', code: 'WPG' },
]

const LEAGUES = {
  nfl: { name: 'NFL', teams: NFL_TEAMS, apiPath: 'football/nfl' },
  nba: { name: 'NBA', teams: NBA_TEAMS, apiPath: 'basketball/nba' },
  cfb: { name: 'CFB', teams: [], apiPath: 'football/college-football', useNetworks: true },
  mlb: { name: 'MLB', teams: MLB_TEAMS, apiPath: 'baseball/mlb' },
  nhl: { name: 'NHL', teams: NHL_TEAMS, apiPath: 'hockey/nhl' },
}

// Network channels for CFB (College Football)
const CFB_NETWORKS = [
  { name: 'ESPN', slug: 'ESPN', color: '#D00000' },
  { name: 'ABC', slug: 'ABC', color: '#000000' },
  { name: 'ESPN2', slug: 'ESPN2', color: '#D00000' },
  { name: 'ESPNU', slug: 'ESPNU', color: '#D00000' },
  { name: 'SEC Network', slug: 'SECN', color: '#004C8C' },
  { name: 'FOX', slug: 'FOX', color: '#003087' },
  { name: 'FS1', slug: 'FS1', color: '#003087' },
  { name: 'CBS', slug: 'CBS', color: '#0033A0' },
  { name: 'NBC', slug: 'NBC', color: '#6F2DA8' },
  { name: 'Big Ten Network', slug: 'BTN', color: '#0033A0' },
  { name: 'ACC Network', slug: 'ACCN', color: '#013CA6' },
  { name: 'PAC-12', slug: 'PAC12', color: '#004C54' },
]


const getLogoUrl = (code, league) => {
  if (!code) return ''
  return `https://a.espncdn.com/i/teamlogos/${league}/500/${code.toLowerCase()}.png`
}

// Map ESPN team data to our team slug
const findTeamByEspnData = (espnTeam, league) => {
  const teams = LEAGUES[league].teams
  if (!espnTeam || !teams.length) return null
  
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

  const getStreamUrl = (slug) => {
    // All streams use the same URL pattern
    return `https://gg.poocloud.in/${slug}/index.m3u8`
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
    // Skip fetching for CFB since we use network buttons instead
    if (league === 'cfb') {
      setLiveGames([])
      setLoadingGames(false)
      return
    }
    
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
          
          // Get status text
          const statusText = competition?.status?.type?.shortDetail || 
                            competition?.status?.type?.detail ||
                            event.status?.type?.shortDetail || ''
          
          // Get game start time
          const gameDate = event.date ? new Date(event.date) : null
          const minutesUntilStart = gameDate ? Math.floor((gameDate - now) / (1000 * 60)) : null
          const startsWithin30Min = minutesUntilStart !== null && minutesUntilStart >= 0 && minutesUntilStart <= 30
          
          // Show if: (not final AND has started) OR (scheduled AND starts within 30 min)
          if (!isFinal && competition?.competitors) {
            const homeTeam = competition.competitors.find(c => c.homeAway === 'home')
            const awayTeam = competition.competitors.find(c => c.homeAway === 'away')
            
            if (homeTeam && awayTeam) {
              // Check if game has actually started
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
              
              if (hasStarted || (isScheduled && startsWithin30Min)) {
                const homeTeamData = findTeamByEspnData(homeTeam.team, league)
                const awayTeamData = findTeamByEspnData(awayTeam.team, league)
                
                if (homeTeamData && awayTeamData) {
                  let displayStatus = statusText || 'LIVE'
                  
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
                    homeTeam: { ...homeTeamData, league },
                    awayTeam: { ...awayTeamData, league },
                    homeScore: homeTeam.score || '0',
                    awayScore: awayTeam.score || '0',
                    status: displayStatus,
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

  const loadStream = async (slug) => {
    cleanup()
    setStatus('Loading stream...')

    try {
      const streamUrl = getStreamUrl(slug)
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

  const handleNetworkSelect = (network) => {
    setSelectedTeam({ slug: network.slug, name: network.name, displayName: network.name })
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

          {selectedLeague !== 'cfb' && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          )}
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

        {/* CFB shows network channels instead of teams */}
        {selectedLeague === 'cfb' ? (
          <div className="networks-section">
            <h2 className="networks-title">College Football Channels</h2>
            <div className="networks-grid">
              {CFB_NETWORKS.map((network) => (
                <div
                  key={network.slug}
                  className="network-card"
                  style={{ '--network-color': network.color }}
                  onClick={() => handleNetworkSelect(network)}
                >
                  <div className="network-logo">{network.slug}</div>
                  <div className="network-name">{network.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="teams-grid">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <div
                  key={team.slug}
                  className="team-card"
                  onClick={() => handleTeamSelect(team)}
                >
                  <img 
                    src={getLogoUrl(team.code, selectedLeague)} 
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
        )}
      </div>
    </div>
  )
}

export default App
