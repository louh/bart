'use strict'

var DSU_HORIZONTAL_RESOLUTION = 180
var DSU_VERTICAL_RESOLUTION = 50
var DSU_LED_ON_COLOR = 'hsla(0, 100%, 50%, 1)'
var DSU_LED_OFF_COLOR = 'hsla(0, 100%, 10%, 1)'

var canvas = document.getElementById('led')
var context = canvas.getContext('2d')

// Gets the current width and height from browser layout engine
var canvasWidth = Math.floor(canvas.getBoundingClientRect().width)
var canvasHeight = Math.floor(canvas.getBoundingClientRect().height)

// Fixes rounding issues later
canvas.style.width = canvasWidth + 'px'
canvas.style.height = canvasHeight + 'px'

// Sets canvas to the proper dimensions and at the correct pixel density
var ratio = getDevicePixelRatio(context)
canvas.width = canvasWidth * ratio
canvas.height = canvasHeight * ratio
context.scale(ratio, ratio)

// Figure out how big to display an LED light at
// It will never be less than 1 pixel
var ledWidth = canvasWidth / DSU_HORIZONTAL_RESOLUTION
var ledHeight = canvasHeight / DSU_VERTICAL_RESOLUTION
var ledRadius = Math.max(Math.min(0.65 * ledWidth, 0.65 * ledHeight), 1) / 2

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

// Words
var screenData = [
  {
    destination: 'San Jose',
    trainLength: 12,
    arrivesIn: [1, 5]
  },
  {
    destination: 'Lake Tahoe',
    trainLength: 15,
    arrivesIn: [3, 9]
  },
  // {
  //   destination: 'Whatever',
  //   trainLength: 7,
  //   arrivesIn: 8
  // }
]

var interval

showArrivalTimes(screenData, context)

window.setInterval(function () {
  showArrivalTimes(screenData, context)
}, 20000)

function showArrivalTimes (data, context) {
  var screen = createArrivalTimesScreen(data)
  var duration = screen.length + DSU_VERTICAL_RESOLUTION
  var count = 0

  window.clearInterval(interval)
  drawScreen(screen, context)

  interval = window.setInterval(function () {
    shiftUp(screen, context)
  }, 350)
}

/**
 * Creates a screen buffer showing train arrival times.
 * @params {Array} Array of data objects
 * @returns {Array} Screen buffer
 */
function createArrivalTimesScreen (data) {
  // Start with a blank screen buffer.
  var screen = createEmptyScreenBuffer()

  // These are the margins for this type of screen.
  var xMargin = 1
  var yTopMargin = 3

  // These are the line heights and spacing for this
  // type of screen.
  var yLineHeight = 10
  var yEntryMargin = 7

  // Turn on the LEDs for this screen buffer.
  // NOTE: This
  data.forEach(function (datum, index) {
    // Calculate the Y position for this set of data
    var yPosition = yTopMargin + (((yLineHeight * 2) + yEntryMargin) * index)

    // datum.arrivesIn could be a number, a string, or an array of numbers.
    // Times should be in this format: 'A, B'
    //  1         --> '1'
    // '1'        --> '1'
    // [1, 2]     --> '1, 2'
    // ['1', '2'] --> '1, 2'
    // '1, 2'     --> '1, 2'
    // '1,2'      --> '1, 2'
    var arrival = datum.arrivesIn.toString().replace(/,(?=\S)/, ', ')

    // Write the dots to the screen buffer.
    // Destination
    screen = drawLineOnScreen(screen, datum.destination, xMargin, yPosition)
    // Arrival times, same line as destination, aligned right
    screen = drawLineOnScreen(screen, arrival + ' min', xMargin, yPosition, { align: 'right' })
    // Length of car train, new line below destination
    screen = drawLineOnScreen(screen, datum.trainLength.toString() + ' car train', xMargin, yPosition + yLineHeight)

    // There is no protection against words that go on too long.
    //
  })

  return screen
}

// -- ANOTHER SCREEN --

// function makeAnotherScreen () {
//   screen = drawLargeText(screen, 'San Francisco / Millbrae')
//   drawScreen(screen, context)
// }

// makeAnotherScreen()

/**
 * Creates a two-dimensional array whose length is the vertical
 * dimension of the screen, containing arrays whose length is the
 * horizontal dimension of the screen. The array is filled with
 * zeroes, indicating LEDs in the off state. Creating the screen
 * buffer in the format of [y][x] makes it easier to do vertical
 * scrolling with Array.push() and Array.pop() on the buffer.
 * @returns {Array} Zero-filled two-dimensional screen buffer
 */
function createEmptyScreenBuffer () {
  var buffer = Array(DSU_VERTICAL_RESOLUTION).fill([])
  return buffer.map(function () {
    return Array(DSU_HORIZONTAL_RESOLUTION).fill(0)
  })
}

function drawLargeText (screen, string) {
  // Automatically assume centering
  var array = stringToArrayOfCodePoints(string)
  var dots = getDotsFromCodePoints(array, BIG_FONT)
  console.log(dots)
  for (var i = 0; i < dots.length; i++) {
    var width = dots[i].length
    // Get X position to center the text
    var posX = Math.floor((DSU_HORIZONTAL_RESOLUTION - width) / 2)
    screen = drawDotsOnScreen(screen, dots[i], posX, 4 + (16 * i))
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
