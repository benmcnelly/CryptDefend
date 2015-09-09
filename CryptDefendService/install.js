var Service = require('./node-win').Service;

// Create a new service object
var svc = new Service({
  name:'Stronghold Crypt Defender',
  description: 'A honeypot tool that monitors and reports changes to target files',
  script: require('path').join(__dirname,'cryptdfend.js'),
  env:{
    name: "NODE_ENV",
    value: "production"
  }
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

// Just in case this file is run twice.
svc.on('alreadyinstalled',function(){
  console.log('This service is already installed. So ah, no...');
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){
  console.log(svc.name+' started!\nGood job! Have a cookie....');
});

// Install the script as a service.
svc.install();