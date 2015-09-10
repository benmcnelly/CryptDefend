/*

To Do:
> Windows Event Logging
> Maximum service restarts
> Have socket.io-client log failed net connections for debuging on site

*/

// import packages
var os = require('os');
var fs = require('fs');
var hashfile = require('hashfile');
var cron = require('cron');
var io = require('socket.io-client')

// Import client specific settings
var config = require('./config');

// Dev Variables
var branding = "Stronghold Data APS"
var devServer = "http://10.223.45.48:3000"

// Hashed values
var txtHash = "cb672bb622cb99a01668f08d35668b2631a68e9b"
var docHash = "8769de2b7de01f599bbb98acb2259f27762ed18f"
var jpgHash = "d9840b9198b3de25efdd1998eea14f84877e62e7"

// File hash flags, set to 1 if matching when checked
var txtHash_match = "0"
var docHash_match = "0"
var jpgHash_match = "0"

// Status Variables, if current status is good carry on, if its bad take action...
var currentStatus = "0" // 1 = good state (no failed hashes), 0 = bad state
var fileStatus    = "0" // Files check out
var cryptoStatus  = "0" // 0 = clean, 1 = Crypto variant Detected

// Set Cron Variable
var cronJob = require('cron').CronJob;

var hashJob = new cronJob('*/20 * * * * *', function(){		

	     // Check Plaintext file hash
	    hashfile(config.honeypot+'sample.txt', function (err, plaintexthash) {
	        if (err) {
	            console.error();('I broke when trying to plaintexthash');
	        }
	        if (plaintexthash == txtHash){
	            txtHash_match = "0" // File hash matches
	        } else {
	        	txtHash_match = "1" // mark this file as changed
	        }
	    });

	    // Check Word Doc file hash
	    hashfile(config.honeypot+'Resume.docx', function (err, docxthash) {
	        if (err) {
	            console.error();('I broke when trying to docxthash');
	        }
	        if (docxthash == docHash){
	            docHash_match = "0"
	        } else {
	        	docHash_match = "1"
	        }
	    });   

	    // Check JPG Image file hash
	    hashfile(config.honeypot+'my-kids.jpg', function (err, jpgfilehash) {
	        if (err) {
	            console.error();('I broke when trying to jpgfilehash');
	        }
	        if (jpgfilehash == jpgHash){
	            jpgHash_match = "0"
	        } else {
	        	jpgHash_match = "1"
	        }
	    });

	    // Check for HELP_DECRYPT.html
		fs.exists('C:\\a1_stronghold\\HELP_DECRYPT.html', function(exists) {
		  if (exists) {
		    // Oh Snap, this is the real deal, tell the master server
		    //warnTextJob("HELP_DECRYPT Files Found!");
		    cryptoStatus = "1"
		  } else {
		    cryptoStatus = "0"
		    // console.log('Sweet, no Crypto Anything so far');
		  }
		});
});

// if statment that checks for any files that flagged, we need to check it here instead of just setting it as flagged so if a file hash
// is changed then fixed, it will start reporting right without restarting the service.
var updateFileStatusCheck = new cronJob('*/5 * * * * *', function(){
	if (txtHash_match == "1" || docHash_match == "1" || jpgHash_match == "1"){
		fileStatus = "1"
	} else {
		fileStatus = "0"
	}
});

// if statement that checks if any file is modified and sets fileStatus
var updateStatusCheck = new cronJob('*/5 * * * * *', function(){
	
	if (fileStatus == "1" || cryptoStatus == "1"){
		currentStatus = "1"
	} else {
		currentStatus = "0"
	}
});

// Send update to server
var updateTextJob = new cronJob('*/15 * * * * *', function(){
	if (currentStatus == "1"){ // IF fileStatus or cryptoStatus are 1
		var socket = io(config.masterserver);
		socket.emit('chat message', os.hostname() +","+ config.clientID +","+ currentStatus +","+ cryptoStatus);
	} else { // Nothing wrong, just check in
		var socket = io(config.masterserver);
		socket.emit('chat message', os.hostname() +","+ config.clientID +","+ currentStatus +","+ cryptoStatus);	
	}
});


// Check All Hashes every X interval
hashJob.start();

// Check in with Master Server every X interval
updateTextJob.start();

// Check for honeypot file status and flag it correctly
updateFileStatusCheck.start();

// Set overall status based on flags
updateStatusCheck.start();

// Not using this yet
function warnTextJob(fileName)  {
	// Send warning Server
    var socket = io(config.masterserver);
    socket.emit('chat message', ">>> WARNING || " + fileName + " - " + os.hostname() + " @ " + config.clientname + " / " + config.clientID );
	
	// Log in Windows
	//var EventLogger = require('node-windows').EventLogger;
	//var log = new EventLogger('Stronghold Crypt Defend');
	//log.warn('Watch out!' + txtHash_match + " | Doc File: " + docHash_match + " | JPG File: " + jpgHash_match);
}