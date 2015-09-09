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

    // Custom Variables
    var branding = "Stronghold Data APS"
    var devServer = "http://10.223.45.48:3000"

    // Hashed values
    var txtHash = "cb672bb622cb99a01668f08d35668b2631a68e9b"
    var docHash = "8769de2b7de01f599bbb98acb2259f27762ed18f"
    var jpgHash = "d9840b9198b3de25efdd1998eea14f84877e62e7"

    // Flags
    var txtHash_match = "Text"
    var docHash_match = "Doc"
    var jpgHash_match = "JPG"

    // Set Cron Variable
	var cronJob = require('cron').CronJob;


	var hashJob = new cronJob('*/2 * * * * *', function(){		

	     // Check Plaintext file hash
	    hashfile(config.honeypot+'sample.txt', function (err, plaintexthash) {
	        if (err) {
	            console.error();('I broke when trying to plaintexthash');
	        }
	        if (plaintexthash == txtHash){
	            txtHash_match = "Check"
	        } else {
	        	txtHash_match = "FAIL"
	        	warnTextJob("sample.txt has been modified");
	        }
	    });

	    // Check Word Doc file hash
	    hashfile(config.honeypot+'Resume.docx', function (err, docxthash) {
	        if (err) {
	            console.error();('I broke when trying to docxthash');
	        }
	        if (docxthash == docHash){
	            docHash_match = "Check"
	        } else {
	        	docHash_match = "FAIL"
	        	warnTextJob("Resume.docx has been modified");
	        }
	    });   

	    // Check JPG Image file hash
	    hashfile(config.honeypot+'my-kids.jpg', function (err, jpgfilehash) {
	        if (err) {
	            console.error();('I broke when trying to jpgfilehash');
	        }
	        if (jpgfilehash == jpgHash){
	            jpgHash_match = "Check"
	        } else {
	        	jpgHash_match = "FAIL"
	        	warnTextJob("my-kids.jpg has been modified");
	        }
	    });

	    // Check for HELP_DECRYPT.html
		fs.exists('C:\\a1_stronghold\\HELP_DECRYPT.html', function(exists) {
		  if (exists) {
		    // Oh Snap, this is the real deal, tell the master server
		    warnTextJob("HELP_DECRYPT Files Found!");
		  } else {
		    // All good breh...
		    // console.log('Sweet, no Crypto Anything so far');
		  }
		});


	});

var updateTextJob = new cronJob('*/30 * * * * *', function(){	
	// Take a look at the output in console
	console.log(os.hostname() + " @ " + config.clientname + " >> | Text File: " + txtHash_match + " | Doc File: " + docHash_match + " | JPG File: " + jpgHash_match);

	// Send Data to Server
    var socket = io(config.masterserver);
    socket.emit('chat message', os.hostname() + " @ " + config.clientname + " >> | Text File: " + txtHash_match + " | Doc File: " + docHash_match + " | JPG File: " + jpgHash_match);

    });

function warnTextJob(fileName)  {
	// Send warning Server
    var socket = io(config.masterserver);
    socket.emit('chat message', ">>> WARNING || " + fileName + " - " + os.hostname() + " @ " + config.clientname );
	
	// Log in Windows
	//var EventLogger = require('node-windows').EventLogger;
	//var log = new EventLogger('Stronghold Crypt Defend');
	//log.warn('Watch out!' + txtHash_match + " | Doc File: " + docHash_match + " | JPG File: " + jpgHash_match);

    };

// Check All Hashes every 2 minutes
hashJob.start();

// Check in with Master Server, once per hour
updateTextJob.start();