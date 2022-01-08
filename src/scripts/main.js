/**
 *  --=={{ Vintage BART LED emulator }}==--
 *  Copyright (C) 2021 Lou Huang
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
'use strict'

const DSU_HORIZONTAL_RESOLUTION = 180
const DSU_VERTICAL_RESOLUTION = 50
const DSU_LED_ON_COLOR = 'hsla(0, 100%, 50%, 1)'
const DSU_LED_OFF_COLOR = 'hsla(0, 100%, 10%, 1)'

const BLINK_TIME = 500

// BART API keys are free. See here for more info.
// https://www.bart.gov/schedules/developers/api
const BART_API_KEY = 'QXPS-PGQY-9JIT-DWEI'

const STATIONS = {
  "12th": {
    "id": "12th",
    "label": "12th St. Oakland City Center",
    "platforms": "3"
  },
  "16th": {
    "id": "16th",
    "label": "16th St. Mission (SF)",
    "platforms": "2"
  },
  "19th": {
    "id": "19th",
    "label": "19th St. Oakland",
    "platforms": "3"
  },
  "24th": {
    "id": "24th",
    "label": "24th St. Mission (SF)",
    "platforms": "2"
  },
  "ashb": {
    "id": "ashb",
    "label": "Ashby (Berkeley)",
    "platforms": "2"
  },
  "antc": {
    "id": "antc",
    "label": "Antioch",
    "platforms": "2"
  },
  "balb": {
    "id": "balb",
    "label": "Balboa Park (SF)",
    "platforms": "2"
  },
  "bayf": {
    "id": "bayf",
    "label": "Bay Fair (San Leandro)",
    "platforms": "2"
  },
  "bery": {
    "id": "bery",
    "label": "Berryessa",
    "platforms": "3"
  },
  "cast": {
    "id": "cast",
    "label": "Castro Valley",
    "platforms": "2"
  },
  "civc": {
    "id": "civc",
    "label": "Civic Center (SF)",
    "platforms": "2"
  },
  "cols": {
    "id": "cols",
    "label": "Coliseum",
    "platforms": "3"
  },
  "colm": {
    "id": "colm",
    "label": "Colma",
    "platforms": "2"
  },
  "conc": {
    "id": "conc",
    "label": "Concord",
    "platforms": "2"
  },
  "daly": {
    "id": "daly",
    "label": "Daly City",
    "platforms": "3"
  },
  "dbrk": {
    "id": "dbrk",
    "label": "Downtown Berkeley",
    "platforms": "2"
  },
  "dubl": {
    "id": "dubl",
    "label": "Dublin/Pleasanton",
    "platforms": "2"
  },
  "deln": {
    "id": "deln",
    "label": "El Cerrito del Norte",
    "platforms": "2"
  },
  "plza": {
    "id": "plza",
    "label": "El Cerrito Plaza",
    "platforms": "2"
  },
  "embr": {
    "id": "embr",
    "label": "Embarcadero (SF)",
    "platforms": "2"
  },
  "frmt": {
    "id": "frmt",
    "label": "Fremont",
    "platforms": "2"
  },
  "ftvl": {
    "id": "ftvl",
    "label": "Fruitvale (Oakland)",
    "platforms": "2"
  },
  "glen": {
    "id": "glen",
    "label": "Glen Park (SF)",
    "platforms": "2"
  },
  "hayw": {
    "id": "hayw",
    "label": "Hayward",
    "platforms": "2"
  },
  "lafy": {
    "id": "lafy",
    "label": "Lafayette",
    "platforms": "2"
  },
  "lake": {
    "id": "lake",
    "label": "Lake Merritt (Oakland)",
    "platforms": "2"
  },
  "mcar": {
    "id": "mcar",
    "label": "MacArthur (Oakland)",
    "platforms": "4"
  },
  "mlbr": {
    "id": "mlbr",
    "label": "Millbrae",
    "platforms": "4"
  },
  "mlpt": {
    "id": "mlpt",
    "label": "Milpitas",
    "platforms": "2"
  },
  "mont": {
    "id": "mont",
    "label": "Montgomery St. (SF)",
    "platforms": "2"
  },
  "nbrk": {
    "id": "nbrk",
    "label": "North Berkeley",
    "platforms": "2"
  },
  "ncon": {
    "id": "ncon",
    "label": "North Concord/Martinez",
    "platforms": "2"
  },
  "orin": {
    "id": "orin",
    "label": "Orinda",
    "platforms": "2"
  },
  "pitt": {
    "id": "pitt",
    "label": "Pittsburg/Bay Point",
    "platforms": "2"
  },
  "pctr": {
    "id": "pctr",
    "label": "Pittsburg Center",
    "platforms": "2"
  },
  "phil": {
    "id": "phil",
    "label": "Pleasant Hill",
    "platforms": "2"
  },
  "powl": {
    "id": "powl",
    "label": "Powell St. (SF)",
    "platforms": "2"
  },
  "rich": {
    "id": "rich",
    "label": "Richmond",
    "platforms": "2"
  },
  "rock": {
    "id": "rock",
    "label": "Rockridge (Oakland)",
    "platforms": "2"
  },
  "sbrn": {
    "id": "sbrn",
    "label": "San Bruno",
    "platforms": "2"
  },
  "sfia": {
    "id": "sfia",
    "label": "San Francisco Int'l Airport",
    "platforms": "3"
  },
  "sanl": {
    "id": "sanl",
    "label": "San Leandro",
    "platforms": "2"
  },
  "shay": {
    "id": "shay",
    "label": "South Hayward",
    "platforms": "2"
  },
  "ssan": {
    "id": "ssan",
    "label": "South San Francisco",
    "platforms": "2"
  },
  "ucty": {
    "id": "ucty",
    "label": "Union City",
    "platforms": "2"
  },
  "warm": {
    "id": "warm",
    "label": "Warm Springs/South Fremont",
    "platforms": "2"
  },
  "wcrk": {
    "id": "wcrk",
    "label": "Walnut Creek",
    "platforms": "2"
  },
  "wdub": {
    "id": "wdub",
    "label": "West Dublin",
    "platforms": "2"
  },
  "woak": {
    "id": "woak",
    "label": "West Oakland",
    "platforms": "2"
  }
}

var canvas = document.getElementById('led')
var context = canvas.getContext('2d')

var canvasWidth, canvasHeight, ratio, ledWidth, ledHeight, ledRadius

window.addEventListener('load', function () {
  calculateCanvasVars()
  selectionSwitched(stationState, platformState)
})

function calculateCanvasVars () {
  // Gets the current width and height from browser layout engine
  canvasWidth = Math.floor(canvas.getBoundingClientRect().width)
  canvasHeight = Math.floor(canvas.getBoundingClientRect().height)

  // Fixes rounding issues later
  canvas.style.width = canvasWidth + 'px'
  canvas.style.height = canvasHeight + 'px'

    // Sets canvas to the proper dimensions and at the correct pixel density
  ratio = getDevicePixelRatio(context)
  canvas.width = canvasWidth * ratio
  canvas.height = canvasHeight * ratio
  context.scale(ratio, ratio)

  // Figure out how big to display an LED light at
  // It will never be less than 1 pixel
  ledWidth = canvasWidth / DSU_HORIZONTAL_RESOLUTION
  ledHeight = canvasHeight / DSU_VERTICAL_RESOLUTION
  ledRadius = Math.max(Math.min(0.65 * ledWidth, 0.65 * ledHeight), 1) / 2
}

// draw random dots
// for (var i = 0; i < DSU_HORIZONTAL_RESOLUTION * DSU_VERTICAL_RESOLUTION; i++) {
//   var posX = i % DSU_HORIZONTAL_RESOLUTION
//   var posY = Math.floor(i / DSU_HORIZONTAL_RESOLUTION)
//   var centerX = (ledWidth / 2) + (posX * ledWidth)
//   var centerY = (ledHeight / 2) + (posY * ledHeight)
//   var bit = Math.floor(Math.random() * 1.15)
//   drawLED(context, centerX, centerY, ledRadius, bit)
// }

// Scroll random dots!!
// var screen = createEmptyScreenBuffer()

// var randomness = 1.15
// for (var i = 0; i < DSU_HORIZONTAL_RESOLUTION * DSU_VERTICAL_RESOLUTION; i++) {
//   var posX = i % DSU_HORIZONTAL_RESOLUTION
//   var posY = Math.floor(i / DSU_HORIZONTAL_RESOLUTION)
//   var bit = Math.floor(Math.random() * 1.15)
//   screen[posY][posX] = bit
// }

// drawScreen(screen, context)

// State
// Read from DOM because browsing reloading will remember select choice
let platformState = getSelectedPlatform() || 1
let stationState = document.getElementById('station').value || '19th'

// Words
var screenData
var fantasyData = [
  {
    destination: 'San Jose',
    trainLength: 12,
    arrivesIn: [1, 5]
  },
  {
    destination: 'Lake Tahoe',
    trainLength: 15,
    arrivesIn: [3, 18]
  },
  {
    destination: 'Healdsburg',
    trainLength: 7,
    arrivesIn: [16]
  }
]

let interval
let screenInterval
let screenRefreshTimeout

function setUpScreen () {
  window.clearInterval(interval)
  window.clearInterval(screenInterval)

  // Brief blink
  drawEmptyScreen()

  screenRefreshTimeout = window.setTimeout(function () {
    showArrivalTimes(screenData, context)
  }, BLINK_TIME)

  if (screenData.length > 0) {
    screenRefreshTimeout = window.setTimeout(function () {
      selectionSwitched(stationState, platformState)
    }, Math.max(2 * 9500, screenData.length * 9500))
  }
}

function setUpCurrentScreen (data) {
  window.clearInterval(interval)
  window.clearInterval(screenInterval)

  // Brief blink
  drawEmptyScreen()

  screenRefreshTimeout = window.setTimeout(function () {
    showCurrentTrain(data)
  }, BLINK_TIME)

  screenRefreshTimeout = window.setTimeout(function () {
    selectionSwitched(stationState, platformState)
  }, 6000)
}

function showArrivalTimes (data, context) {
  var screen = createArrivalTimesScreen(data)

  window.clearInterval(interval)
  drawScreen(screen, context)

  // only scroll data if there is more than one thing
  if (data.length > 1) {
    window.setTimeout(function () {
      interval = window.setInterval(function () {
        shiftUp(screen, context)
      }, 350)
    }, 500) // slight delay before scroll
  }
}

/**
 * Creates a screen buffer showing train arrival times.
 * @params {Array} Array of data objects
 * @returns {Array} Screen buffer
 */
function createArrivalTimesScreen (data) {
  // Start with a blank screen buffer.
  var screen = createEmptyScreenBuffer(data.length * 30)

  // These are the margins for this type of screen.
  var xMargin = 1
  var yTopMargin = 3

  // These are the line heights and spacing for this
  // type of screen.
  var yLineHeight = 10
  var yEntryMargin = 7

  // Turn on the LEDs for this screen buffer.
  data.forEach(function (datum, index) {
    // Calculate the Y position for this set of data
    var yPosition = yTopMargin + (((yLineHeight * 2) + yEntryMargin) * index)

    // datum.arrivesIn is an array of numbers.
    // It can be of any length but only display 2 arrival times
    // Single digit numbers are formatted with left-padding
    // of one space. This aligns the comma on the display
    // Examples
    // [1, 2]  --> '1, 2 MIN'
    // [1, 10] --> '1,10 MIN'
    var arrival = datum.arrivesIn.reduce((str, val, i) => {
      var numString = val.toString().padStart(2, ' ')
      // only two items
      if (i > 2) return str
      // add a comma after subsequent times
      if (i > 0) {
        str += ',' + numString
      } else {
        str += numString
      }
      return str
    }, '')

    // Write the dots to the screen buffer.
    // Destination
    screen = drawLineOnScreen(screen, datum.destination, xMargin, yPosition)
    // Arrival times, same line as destination, aligned right
    screen = drawLineOnScreen(screen, arrival + ' min', xMargin, yPosition, { align: 'right' })
    // Length of car train, new line below destination
    screen = drawLineOnScreen(screen, datum.trainLength.toString() + ' car train', xMargin, yPosition + yLineHeight)

    // There is no protection against words that go on too long.
  })

  return screen
}

// -- CURRENTLY BOARDING TRAIN SCREEN --

function showCurrentTrain ({ destination, length, bikes }) {
  var screen = createEmptyScreenBuffer(DSU_VERTICAL_RESOLUTION)
  screen = drawLargeText(screen, destination)
  
  var text = `${length} CAR TRAIN`
  if (bikes === false) {
    text += ' - NO BIKES'
  }
  screen = drawLineOnScreen(screen, text, null, 39, { align: 'center' })

  drawScreen(screen, context)
}

/**
 * Creates a two-dimensional array whose length is the vertical
 * dimension of the screen, containing arrays whose length is the
 * horizontal dimension of the screen. The array is filled with
 * zeroes, indicating LEDs in the off state. Creating the screen
 * buffer in the format of [y][x] makes it easier to do vertical
 * scrolling with Array.push() and Array.pop() on the buffer.
 * @returns {Array} Zero-filled two-dimensional screen buffer
 */
function createEmptyScreenBuffer (vert = DSU_VERTICAL_RESOLUTION) {
  vert = Math.max(vert, DSU_VERTICAL_RESOLUTION)
  var buffer = Array(vert).fill([])
  return buffer.map(function () {
    return Array(DSU_HORIZONTAL_RESOLUTION).fill(0)
  })
}

function drawEmptyScreen () {
  var screen = createEmptyScreenBuffer(DSU_VERTICAL_RESOLUTION)
  drawScreen(screen, context)
}

function drawLargeText (screen, string) {
  // Automatically assume centering
  var array = stringToArrayOfCodePoints(string)
  var dots = getDotsFromCodePoints(array, BIG_FONT)

  for (var i = 0; i < dots.length; i++) {
    var width = dots[i].length
    // Get X position to center the text
    var posX = Math.floor((DSU_HORIZONTAL_RESOLUTION - width) / 2)

    // one line
    if (dots.length === 1) {
      screen = drawDotsOnScreen(screen, dots[i], posX, 4 + 10)
    } else {
      // multiline
      screen = drawDotsOnScreen(screen, dots[i], posX, 4 + (16 * i))
    }
  }
  return screen
}

function drawLineOnScreen (screen, string, x, y, options) {
  var dots = getDots(string)

  options = options || {}

  for (var i = 0; i < dots.length; i++) {
    var line = dots[i]

    if (options.align === 'right') {
      x = DSU_HORIZONTAL_RESOLUTION - x - line.length
    }
    if (options.align === 'center') {
      x = Math.floor((DSU_HORIZONTAL_RESOLUTION - line.length) / 2)
    }

    screen = drawDotsOnScreen(screen, line, x, y)
  }

  return screen
}

function drawDotsOnScreen (screen, dots, x, y) {
  for (var m = 0; m < dots.length; m++) {
    for (var n = 0; n < dots[m].length; n++) {
      screen[y + n][x + m] = dots[m][n]
    }
  }
  return screen
}

function getDots (string) {
  var array = stringToArrayOfCodePoints(string)
  return getDotsFromCodePoints(array, FONT)
}

function stringToArrayOfCodePoints (string) {
  var array = []
  string = string.trim().toUpperCase()

  // add spaces around slashes to help with spacing
  string = string.replace('/', ' / ')

  // Split the string on spaces
  var words = string.split(' ')

  // Convert a string into its code points
  for (var i = 0; i < words.length; i++) {
    var word = []
    for (var j = 0; j < words[i].length; j++) {
      word.push(words[i].charCodeAt(j))
    }
    array.push(word)
  }
  return array
}

function getDotsFromCodePoints (codepoints, font) {
  var lines = []
  var line = []
  var length = 0
  var startOfLine = true

  for (var i = 0; i < codepoints.length; i++) {
    var word = codepoints[i]
    var unit = []
    var test = []

    // If the word is not at the beginning of a line,
    // add a space before the word.
    if (startOfLine !== true) {
      unit = test.concat(font[32], font.kerning)
    }

    // Add the next word
    for (var j = 0; j < word.length; j++) {
      var character = font[word[j]]

      // Fall back if character is not found
      if (character.length === 0) {
        character = font.default
      }

      // If the character is not the last in the word,
      // add kerning after the character.
      if (j !== word.length - 1) {
        character = character.concat(font.kerning)
      }

      // Add to unit of dots
      unit = unit.concat(character)
    }

    // If the current line + this word is not longer
    // than the screen width, then add the word to the
    // line. Otherwise, store the line and start a new
    // one with the current word.
    test = line.length + unit.length
    if (test < DSU_HORIZONTAL_RESOLUTION) {
      startOfLine = false
      line = line.concat(unit)
    } else {
      lines.push(line)
      startOfLine = true
      line = unit
    }
  }

  // Push whatever is remaining of line
  lines.push(line)
  return lines
}

function shiftUp (screen, context) {
  var newRow = Array(DSU_HORIZONTAL_RESOLUTION)
  screen.shift()
  screen.push(newRow)
  drawScreen(screen, context)
}

function shiftDown (screen, context) {
  var newRow = []
  for (var i = 0; i < DSU_HORIZONTAL_RESOLUTION; i++) {
    newRow.push(Math.floor(Math.random() * randomness))
  }
  screen.unshift(newRow)
  screen.pop()
  drawScreen(screen, context)
}

function drawScreen (screen, ctx) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < screen.length; y++) {
    for (var x = 0; x < screen[y].length; x++) {
      var centerX = (ledWidth / 2) + (x * ledWidth)
      var centerY = (ledHeight / 2) + (y * ledHeight)
      drawLED(ctx, centerX, centerY, ledRadius, screen[y][x])
    }
  }
}

function drawLED (ctx, x, y, radius, bit) {
  ctx.fillStyle = bit ? DSU_LED_ON_COLOR : DSU_LED_OFF_COLOR
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fill()
}

function getDevicePixelRatio (ctx) {
  var devicePixelRatio = window.devicePixelRatio || 1
  var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                          ctx.mozBackingStorePixelRatio ||
                          ctx.msBackingStorePixelRatio ||
                          ctx.oBackingStorePixelRatio ||
                          ctx.backingStorePixelRatio || 1
  return devicePixelRatio / backingStoreRatio
}

function switchPlatform (id) {
  var labelEl = document.getElementById('platform-id')
  labelEl.src = `src/images/platform${id}.svg`

  var buttons = document.querySelectorAll('.controls-platform button')
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active')
  }

  var buttonEl = document.getElementById(`platform${id}`)
  buttonEl.classList.add('active')

  platformState = id

  selectionSwitched(stationState, platformState)
}

function getSelectedPlatform () {
  var selectedPlatform = null
  var buttons = document.querySelectorAll('.controls-platform button')
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].classList.contains('active')) {
      selectedPlatform = Number.parseInt(buttons[i].dataset.platformId, 10)
      break
    }
  }
  return selectedPlatform
}

document.getElementById('platform1').addEventListener('click', () => switchPlatform(1))
document.getElementById('platform2').addEventListener('click', () => switchPlatform(2))
document.getElementById('platform3').addEventListener('click', () => switchPlatform(3))
document.getElementById('platform4').addEventListener('click', () => switchPlatform(4))

document.getElementById('station').addEventListener('change', function (event) {
  var station = event.target.value
  stationState = station
  selectionSwitched(stationState, platformState)
})

function getApiUrl (station, platform) {
  return `https://api.bart.gov/api/etd.aspx?cmd=etd&orig=${station}&plat=${platform}&key=${BART_API_KEY}&json=y`
}

function selectionSwitched (stationState, platformState) {
  window.clearTimeout(screenRefreshTimeout)
  var buttons = document.querySelectorAll('.controls-platform button')
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].removeAttribute('disabled')
  }

  if (stationState === '----') {
    screenData = fantasyData
    setUpScreen()
    return
  }

  // Signage
  var signEl = document.querySelector('#sign img')
  var signImgUrl = `src/images/stations/${stationState}.svg`
  signEl.src = signImgUrl

  // disable platforms that are not present
  var stationData = STATIONS[stationState]
  var numPlatforms = Number.parseInt(stationData.platforms, 10)
  for (var i = 0; i < buttons.length; i++) {
    if (Number.parseInt(buttons[i].dataset.platformId) > numPlatforms) {
      buttons[i].setAttribute('disabled', true)
    }
  }

  window.fetch(getApiUrl(stationState, platformState))
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    document.getElementById('error').style.opacity = '0'
    if (data.root.error) {
      console.log('oops')
    }
    if (data.root.message?.warning == 'No data matched your criteria.') {
      console.log('no data')
      document.getElementById('error').style.opacity = '1'
    }

    var newScreenData = []
    var isCurrentTrain = null

    if (data.root.station.length > 0) {
      var etds = data.root.station[0].etd || []
      for (let i = 0; i < etds.length; i++) {
        var etd = etds[i]
        var destination = etd.destination
        var length
        var minutes = []
        var estimates = etd.estimate
        for (let j = 0; j < 2; j++) {
          var estimate = estimates[j]
          if (!estimate) break
          if (estimate.minutes === 'Leaving') {
            isCurrentTrain = {
              destination: etd.destination,
              length: estimate.length,
              bikes: estimate.bikeflag === "1" ? true : false
            }
            break
          }
          else {
            minutes.push(estimate.minutes)
            if (!length) {
              length = estimate.length
            }
          }
        }
        if (isCurrentTrain) break

        // some names are too long so we shorten
        if (destination === 'Dublin/Pleasanton') {
          destination = 'Dubln Plstn'
        }
        // not used anymore?
        if (destination === 'Pittsburg/Bay Point') {
          destination = 'Pts/Bay Pt'
        }

        newScreenData.push({
          destination,
          trainLength: length,
          arrivesIn: minutes
        })
      }
    }

    if (isCurrentTrain) {
      setUpCurrentScreen(isCurrentTrain)
    } else {
      screenData = newScreenData
      setUpScreen()
    }
  })
}
