"use strict";

// init stuff
var gui = require('nw.gui');
var CustomTrayMenu = require('./custom_tray_menu');
var customTray;

// When stub index is loaded, go ahead and create the tray menu
document.addEventListener('DOMContentLoaded', function() {
    if (!customTray) {
      customTray = new CustomTrayMenu('custom-tray-menu.html', 'tray.png', {
        width: 190,
        height: 143
      });
    }
});

// print error messagez
process.on("uncaughtException", function(exception) {
  var stack = exception.stack.split("\n");
  stack.forEach(function (line) {
    writeLog(line, 'error');
    process.stdout.write(String(line) + "\n");
  });
});
