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
var screen = []
var randomness = 1.15;
for (var y = 0; y < DSU_VERTICAL_RESOLUTION; y++) {
  screen[y] = [];
  for (var x = 0; x < DSU_HORIZONTAL_RESOLUTION; x++) {
    screen[y][x] = Math.floor(Math.random() * randomness);
  }
}

drawScreen(screen, context);

window.setInterval(function () {
  shiftUp(screen, context);
}, 250);

function shiftUp (screen, context) {
  var newRow = [];
  for (var i = 0; i < DSU_HORIZONTAL_RESOLUTION; i++) {
    newRow.push(Math.floor(Math.random() * randomness));
  }
  screen.shift();
  screen.push(newRow);
  drawScreen(screen, context);
}

function drawScreen (screen, ctx) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (var y = 0; y < screen.length; y++) {
    for (var x = 0; x < screen[y].length; x++) {
      var centerX = (ledWidth / 2) + (x * ledWidth);
      var centerY = (ledHeight / 2) + (y * ledHeight);
      drawLED(ctx, centerX, centerY, ledRadius, screen[y][x]);
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
