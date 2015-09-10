# CryptDefend
Windows Service for monitoring honeypot files for CryptoLocker ransomware variants.

> Setup
* Clone or download
* Install node.js if not already installed.
* Run "npm install" in the "CryptDefendDashboard" folder.
* Run "npm install" in the "CryptDefendService" and its "node-win" folder.
* Modify the config.js file in "CryptDefendService".
* Run "node index.js" in the "CryptDefendDashboard" folder to start the Server/Dashboard.
* Run "node  cryptdfend.js" to start, or "node install.js" to install as Windows Service

> Tips
* Run install and uninstall as admin to avoid UAC and file run prompts (right click CMD and "run as administrator")

> To Do
* Add database and models
* Make intervals of cron jobs adjustable from config.js file
* Add node-windows specific features, like killing if more than X autorestarts, and Windows log output
