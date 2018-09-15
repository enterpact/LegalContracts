#Legal Contracts on Ethereum
This application was created for the use to two people or groups to sign a digital contract on the Ethereum blockchain without the need of a 3rd party.
The file that both people sign is uploaded to IPFS and can be downloaded from a link listed when viewing the contract information.

The application runs solely in the browser.  For each pending and current contract that both parties must sign, an Ethereum digital contract must be deployed.  


##Tested Environments
The development for this application has only been tested on OSX and the application has only been tested to run on Google Chrome.


##Development
When developing for this application, you must run 2 commands before it can be deployed to a server.

1.
This command compiles the solidity code and application binary interface and then adds the binary code and abi it to the main javascript file dapp_module_final.js
./migrate_solidity_code.sh  

2.
This command packs up all the required javascript modules into one file which is then used by the webpage
webpack



