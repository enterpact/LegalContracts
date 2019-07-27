//file for Dapp javascript module

var ipfsAPI = require('ipfs-api');
var Buffer = require('buffer/').Buffer;
var ipfs;
var buffer;
var web3;

var TwoPartyLegalContract;
var compiledcontract;






/////////Solidity Code//////////


//insertcompiledcodehere


//insertabihere


///////////////END/////////////





window.Dapp = {

    CleanNotifications: function(delaytime=5000) {
        setTimeout(function () {
            document.getElementById("update_notifications").innerHTML = "";
            document.getElementById("upload_notifications").innerHTML = "";
            document.getElementById("mainContractDeploymentText").innerHTML = "";
        }, delaytime);
    },

    CleanViews: function() {
        items = document.getElementsByClassName("viewcleanup");
        for (var i=0; i < items.length; i++) {
            items[i].innerHTML = "";
        }
    },

    VerifyIPFS: function() {
        ipfs.id(function(error, result) {
            if (error) {
                document.getElementById("update_notifications").innerHTML = "<p>There was an error Connecting to IPFS.</p>";
                console.log("There was an error Connecting to IPFS: " + error);
            }
            else
            {
                console.log("Connected to IPFS node: ", result.id, result.agentVersion, result.protocolVersion);
            }
        })
        Dapp.CleanNotifications();
    },

    AddFileIPFS: function(file) {
       return new Promise(resolve => {
       var reader = new FileReader();
       reader.onload = function(e) {
           var buffer = Buffer.from(reader.result);
               ipfs.files.add(buffer, function(error, files){
                   if (error){
                       console.log("There was an error uploading the file which is: " + error);
                       document.getElementById("upload_notifications").innerHTML = "<p>There was an error when uploading the document to IPFS.</p>";
                   }
                   else {
                       console.log("Added file to IPFS.  Resulting with hash: " + files[0].hash + " and size: " + files[0].size.toString() + " and path: " + files[0].path);
                       resolve(files[0].hash);
                   }
               })
           }
       reader.readAsArrayBuffer(file);
       })
    },

    DeployMainContract: async function() {
        var address1 = document.getElementById("initialize_party1_address").value;
        var address2 = document.getElementById("initialize_party2_address").value;
        var name = document.getElementById("initialize_contract_name").value;
        var private_setting = document.getElementById("private_switch").checked;
        var files = document.getElementById("initialize_document").files;
        var filename = document.getElementById("initialize_document").files[0].name;
        var filehash = await Dapp.AddFileIPFS(files[0]);
        var TwoPartyLegalContract = new web3.eth.Contract(abiinterface);
        console.log("IPFS filehash is " + filehash);
        TwoPartyLegalContract.new( address1, address2, name, filehash, filename, private_setting,
            { data: bytecode, from: web3.eth.accounts[0] }, function(e, contract){
                if(e) { console.log("There was an error deploying the contract: " + e);
                } else {
                    console.log("Deploying TwoPartyLegalContract");
                    if(!contract.address) {
                        console.log("Check Metamask for transaction details and status");
                    } else {
                        alert("The contract has been created.  Please save/use contract Address: " + contract.address);
                        console.log("The Contract has been created.  Address: " + contract.address);
                    }
                }
        })
        Dapp.CleanNotifications(15000);
    },

    ConvertStatus: function(status) {
        statuses = ["Signed", "Review", "Negotiating", "Rejected"];
        return statuses[status];
    },

    GetMainContractData: function(myLegalContract) {
        return new Promise(resolve => {
            myLegalContract.mainContract_pub.call( function(error,response) {
                if (error) {
                    console.log("There was an error getting the main contract details.  Error is: \n " + error);
                }
                else {
                    console.log("The main contract details response is " + response);
                    var responsearray = response.toString().split(",");
                    var main_contract_details = {name: responsearray[0], signed: responsearray[1], time_created: "", time_signed: "", world_readable: responsearray[3], current_doc_version: responsearray[5]};
                    main_contract_details.time_created = new Date(responsearray[2] * 1000);
                    if (responsearray[4] == "0") {
                        main_contract_details.time_signed = "";
                    } else {
                        main_contract_details.time_signed = new Date(responsearray[4] * 1000);
                    }
                    resolve(main_contract_details);
                }
            })
        })
    },

    GetPartiesAddresses: function(myLegalContract) {
        return new Promise(resolve=> {
            var addresses = [];
            myLegalContract.partiesAddresses_pub.call( function(error,response){
                if (error) {
                    console.log("There was an error getting parties addresses.  Error is: \n" + error);
                }
                else {
                    console.log("The parties addresses are " + response);
                    responsearray = response.toString().split(",");
                    resolve(responsearray);
                }
            })
        })
    },

    GetPartyDetails: function(myLegalContract,address) {
        return new Promise(resolve=> {
            myLegalContract.parties_pub.call([address], function(error,response) {
                if (error) {
                    console.log("There was an error getting party details.  Error is: \n" + error);
                }
                else {
                    console.log("The party details response is " + response);
                    responsearray = response.toString().split(",");
                    party_details = {name: responsearray[0], email: responsearray[1], status: responsearray[2], address: address};
                    resolve(party_details);
                }
            })
        })
    },

    GetBothPartyDetails: async function(myLegalContract,addresses){
        var bothpartydetails = [];
        for(i=0;i<2;i++){
            var partydetails = await Dapp.GetPartyDetails(myLegalContract,addresses[i]);
            bothpartydetails[i] = partydetails;
        }
        return bothpartydetails;
    },

    GetDocumentVersion: function(myLegalContract,currentversion) {
        return new Promise(resolve=>{
        myLegalContract.contractVersions_pub.call( [currentversion], function(error,response){
            if (error) {
                    console.log("There was an error getting the contract file details.  Error is \n" + error);
                }
                else {
                    console.log("The contract file details response is " + response);
                    var responsearray = response.toString().split(",");
                    var file_details = {version_number: responsearray[2], last_updated: "", filehash: responsearray[4], name: responsearray[0], comment: responsearray[1]};
                    file_details.last_updated = new Date(responsearray[3] * 1000);
                    resolve(file_details);
                }
            })

        })
    },

    CreateContractInstance: function() {
        var LegalContract = new web3.eth.Contract(abiinterface);
        var mainContractAddress = document.getElementById("contract_address").value;
        var myLegalContract = LegalContract.at(mainContractAddress);
        return myLegalContract;
    },

    ClickViewTab: async function() {
        Dapp.CleanViews();
        LegalContract = Dapp.CreateContractInstance();
        var maincontractdetails = await Dapp.GetMainContractData(LegalContract);
        var partiesaddresses = await Dapp.GetPartiesAddresses(LegalContract);
        var partydets = await Dapp.GetPartyDetails(LegalContract,partiesaddresses[0]);
        var partiesdetails = await Dapp.GetBothPartyDetails(LegalContract,partiesaddresses);
        document.getElementById("main_contract_details").innerHTML = "<p>Time Contract Created: " + maincontractdetails.time_created + "</p><p>Time Contract Signed: " + maincontractdetails.time_signed + "</p><p>Signed: <span id=\"signed_status\">" + maincontractdetails.signed + "</span></p><p>Outsiders Can View: " + maincontractdetails.world_readable + "</p><p>Associated Document Version: " + maincontractdetails.current_doc_version + "</p>"; document.getElementById("contract_name").innerHTML="<p>" + maincontractdetails.name + "</p>"; $( "#signed_status:contains('false')" ).css('color', 'red'); $( "#signed_status:contains('true')" ).css('color', 'green');
        for(i=0;i<2;i++){
            partiesdetails[i].status = Dapp.ConvertStatus(partiesdetails[i].status);
            if(partiesdetails[i].address == web3.eth.accounts[0]) {
                document.getElementById("party1_view_column").innerHTML = "<p>My Address: " + partiesdetails[i].address + "</p><p>Name: " + partiesdetails[i].name + "</p><p>Email: " + partiesdetails[i].email + "</p><p>Status: " + partiesdetails[i].status + "</p>";
            } else {
                document.getElementById("party2_view_column").innerHTML = "<p>Their Address: " + partiesdetails[i].address + "</p><p>Name: " + partiesdetails[i].name + "</p><p>Email: " + partiesdetails[i].email + "</p><p>Status: " + partiesdetails[i].status + "</p>";
            }
        }
        var current_version = maincontractdetails.current_doc_version;
        for(i=current_version;i>=0;i--){
            var versiondetails = await Dapp.GetDocumentVersion(LegalContract,i);
            if(i == current_version) {
                document.getElementById("document_view_details").innerHTML = "<p>Document Name: " + versiondetails.name + "</p><p>Comment: " + versiondetails.comment + "</p><p>Document Hash: " + versiondetails.filehash + "</p><p>Document Last Updated: " + versiondetails.last_updated + "</p><p>Document Version: " + versiondetails.version_number + "</p><p></p> <a href=\"https://ipfs.infura.io:5001/api/v0/cat?arg=" + versiondetails.filehash + "\" download><button title=\"To Download file, right click save link as and use the complete Document Name including file extension\">Download File</button></a><span id=download_hint>  Hover over button for instructions</span>";
            } else {
                $("#previous_contracts").append("<p>Document Name: " + versiondetails.name + "</p><p>Comment: " + versiondetails.comment + "</p><p>Document Hash: " + versiondetails.filehash + "</p><p>Document Last Updated: " + versiondetails.last_updated + "</p><p>Document Version: " + versiondetails.version_number + "</p><p></p> <a href=\"https://ipfs.infura.io:5001/api/v0/cat?arg=" + versiondetails.filehash + "\" download><button>Download File</button></a><p></p><p></p>");
            }
        }
        Dapp.CleanNotifications();
    },

    ClickUploadTab: async function() {
        Dapp.CleanViews();
        var LegalContract = Dapp.CreateContractInstance();
        var partiesaddresses = await Dapp.GetPartiesAddresses(LegalContract);
        var partiesdetails = await Dapp.GetBothPartyDetails(LegalContract,partiesaddresses);
         for(i=0;i<2;i++){
            partiesdetails[i].status = Dapp.ConvertStatus(partiesdetails[i].status);
            if(partiesdetails[i].address == web3.eth.accounts[0]) {
                document.getElementById("document_upload_status_p1").innerHTML = "<p>Our Status: " + partiesdetails[i].status + " </p>";
            } else {
                document.getElementById("document_upload_status_p2").innerHTML = "<p>Their Status: " + partiesdetails[i].status + " </p>";
            }
        }
        if (document.getElementById("document_upload_status_p1").innerHTML.includes("Negotiating") == false || document.getElementById("document_upload_status_p2").innerHTML.includes("Negotiating") == false) {
            document.getElementById("document_upload_status").innerHTML = "<p>Document Uploading is not allowed because both Parties must be Negotiating.</p>";
        }
        Dapp.CleanNotifications();
    },

    UploadContractFile: async function() {
        if (document.getElementById("document_upload_status_p1").innerHTML.includes("Negotiating") == false || document.getElementById("document_upload_status_p2").innerHTML.includes("Negotiating") == false) {
            console.log("Cannot upload file because both statuses are not negotiating.");
            return alert("Both statuses must be Negotiating to upload a contract document.");
        }
        var LegalContract = Dapp.CreateContractInstance();
        var files = document.getElementById("updated_document_upload").files;
        var filehash = await Dapp.AddFileIPFS(files[0]);
        var filename = files[0].name;
        var comment = document.getElementById("file_comment").value;
        LegalContract.updateDocument(filehash, filename, comment, { from: web3.eth.accounts[0] }, function(error, response) {
            console.log("Uploading file hash: " + filehash);
            if (error) {
                document.getElementById("upload_notifications").innerHTML = "<p>There was an error when uploading the document.</p>";
                console.log("There was an error uploading the file hash to Ethereum.  The error is: " + error);
            }
            else {
                if(!response.address) {
                    console.log("Ethereum Transaction Created.  View details on Metamask.");
                } else {
                    console.log("The file hash has been successfully added to your contract.");
                }
            }
        })
        Dapp.CleanNotifications();
    },

    ClickUpdateTab: async function() {
        Dapp.CleanViews();
        var LegalContract = Dapp.CreateContractInstance();
        var partiesaddresses = await Dapp.GetPartiesAddresses(LegalContract);
        var partiesdetails = await Dapp.GetBothPartyDetails(LegalContract,partiesaddresses);
        for(i=0;i<2;i++){
            if(partiesdetails[i].address == web3.eth.accounts[0]) {
                console.log("Grabbed current party details."); document.getElementById("name_update").value = partiesdetails[i].name; document.getElementById("email_update").value = partiesdetails[i].email; document.getElementById("address_update").value = partiesdetails[i].address; document.getElementById("status_update").value = partiesdetails[i].status;
            }
        }
    Dapp.CleanNotifications();
    },


    UpdatePartyDetails: function() {
        var LegalContract = Dapp.CreateContractInstance();
        var name = document.getElementById("name_update").value;
        var email = document.getElementById("email_update").value;
        var address = document.getElementById("address_update").value;
        var status = document.getElementById("status_update").value;

        LegalContract.updateParty(address, name, email, status, { from: web3.eth.accounts[0] },  function(error, response) {
            console.log("Updating party with address: " + address + " name: " + name + " email: " + email + " status: " + status );
            if (error) {
                document.getElementById("upload_notifications").innerHTML = "<p>There was an error when updating Party Details.</p>";
                console.log("There was an error updating the party details in the contract.  The error is: " + error);
            }
            else {
                if(!response.address) {
                    console.log("View the status of your transaction in Metamask.");
                } else {
                    console.log("The party details have been updated in the contract.");
                }
            }
        })
        Dapp.CleanNotifications();
    }
}

window.addEventListener("load", function() {
    ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
    Dapp.VerifyIPFS();
    Dapp.CleanNotifications();
    web3 = new Web3(window.web3.currentProvider);
});

// 0x9477c6902ed7016cbb8cc4076fbd7800c0914430
