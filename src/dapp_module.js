//file for main javascript

//var Web3 = require('web3');
//import Web3 from 'web3';

//var $ = require('jquery');
var ipfsAPI = require('ipfs-api');
var Buffer = require('buffer/').Buffer
var ipfs;
var buffer;
var web3;

var TwoPartyLegalContract;
var compiledcontract;






/////////Solidity Code//////////

//insertcompiledcodehere


//insertabihere


///////////////END/////////////




//find out how to test the javascript functions and solidity functions by writing tests
window.Dapp = {

    CleanNotifications: function(delaytime=5000) {
        setTimeout(function () {
                document.getElementById("update_notifications").innerHTML = ""
                document.getElementById("upload_notifications").innerHTML = ""
                document.getElementById("mainContractDeploymentText").innerHTML = ""
        }, delaytime);
    },


    VerifyIPFS: function() {
        ipfs.id(function(error, result) {
            if (error) {
                console.log("There was an error Connecting to IPFS: " + error);
            }
            else
            {
                console.log("Connected to IPFS node: ", result.id, result.agentVersion, result.protocolVersion);
            }
        })
    },

    AddFileIPFSP: function(file) {
        return new Promise(resolve => {
            ipfs.files.add(file, function(error, files){
                if (error){
                    console.log("There was an error uploading the file which is: " + error);
                    //alert("There was an error uploading the file to IPFS");
                    document.getElementById("upload_notifications").innerHTML = "<p>There was an error when uploading the document to IPFS.</p>";
                }
                else {
                    console.log("Added file to IPFS.  Resulting with hash: " + files[0].hash + " and size: " + files[0].size.toString() + " and path: " + files[0].path);
                    resolve(files[0].hash)
                }
            })
        })
    },

    AddFileIPFS: function(file) {
       return new Promise(resolve => {
       var reader = new FileReader();
       reader.onload = function(e) {
           var buffer = Buffer.from(reader.result)
               ipfs.files.add(buffer, function(error, files){
                   if (error){
                       console.log("There was an error uploading the file which is: " + error);
                       //alert("There was an error uploading the file to IPFS");
                       document.getElementById("upload_notifications").innerHTML = "<p>There was an error when uploading the document to IPFS.</p>";
                   }
                   else {
                       console.log("Added file to IPFS.  Resulting with hash: " + files[0].hash + " and size: " + files[0].size.toString() + " and path: " + files[0].path);
                       resolve(files[0].hash)
                   }
               })
           }
       reader.readAsArrayBuffer(file);
       })
    },

    DeployMainContract: async function() {
        //add function that both addresses are different
        var address1 = document.getElementById("initialize_party1_address").value;
        var address2 = document.getElementById("initialize_party2_address").value;
        var name = document.getElementById("initialize_contract_name").value;
        var files = document.getElementById("initialize_document").files;
        var filehash = await Dapp.AddFileIPFS(files[0]);
        var TwoPartyLegalContract = web3.eth.contract(abiinterface);
        console.log("filehash is " + filehash)
        TwoPartyLegalContract.new( address1, address2, name, filehash,
            { data: bytecode, from: web3.eth.accounts[0] }, function(e, contract){
                if(e) { console.log("There was an error deploying the contract: " + e)
                } else {
                    console.log("Deploying TwoPartyLegalContract")
                    if(!contract.address) {
                        document.getElementById("mainContractDeploymentText").innerHTML = "<p>Contract transaction created.  EtherScan: https://etherscan.io/tx/" + contract.transactionHash + " </p>"
                        console.log("EtherScan url for pending transaction: https://etherscan.io/tx/" + contract.transactionHash)
                    } else {
                        alert("The contract has been created.  Please save/use contract Address: " + contract.address)
                        console.log("The Contract has been created.  Address: " + contract.address);
                    }
                }
            }
        )
        Dapp.CleanNotifications(15000);
    },

    ConvertStatus: function(status) {
        statuses = ["Signed", "Review", "Negotiating", "Rejected"]
        return statuses[status]
    },

    UseDataFromContract: function(cmds) {
        var LegalContract = web3.eth.contract(abiinterface);
        var mainContractAddress = document.getElementById("contract_address").value
        var myLegalContract = LegalContract.at(mainContractAddress)
        var commands = cmds
        if (commands.parties_addresses_f == null) { commands.parties_addresses_f = function(data){ console.log("")} }
        //convert below to use async await instead of callbacks
        if (commands.main_contract_f != null) {
            myLegalContract.mainContract.call( function(error,response) {
                if (error) {
                    console.log("There was an error getting the main contract details.  Error is: \n " + error)
                }
                else {
                    console.log("The main contract details response is " + response);
                    var responsearray = response.toString().split(",")
                    var main_contract_details = {name: "", signed: "", time_created: "", time_signed: ""}
                    main_contract_details.name = responsearray[0]
                    main_contract_details.signed = responsearray[1]
                    main_contract_details.time_created = new Date(responsearray[2] * 1000)
                    if (responsearray[3] == "0") {
                        main_contract_details.time_signed = ""
                    } else {
                        main_contract_details.time_signed = new Date(responsearray[3] * 1000)
                    }
                    commands.main_contract_f(main_contract_details)
                }
            })
        }
        var parties_call = function(address,commands) { myLegalContract.parties.call([address], function(error,response) {
            if (error) {
                console.log("There was an error getting party details.  Error is: \n" + error)
            }
            else {
                console.log("The party details response is " + response);
                var responsearray = response.toString().split(",")
                var party_details = {name: "", email: "", status: "", address: ""}
                party_details.name = responsearray[0]
                party_details.email = responsearray[1]
                party_details.status = responsearray[2]
                party_details.address = address
                commands.parties_f(party_details)
            }
        })}

        if (commands.parties_addresses_f != null || commands.parties_f != null) {
            for (i=0; i < 2; i++) {
                myLegalContract.partiesAddresses.call([i], function(error,response){
                    if (error) {
                        console.log("There was an error getting parties addresses.  Error is: \n" + error)
                    }
                    else {
                        console.log("The parties addresses response is " + response)
                        var address=response
                        commands.parties_addresses_f(address)
                        parties_call(address,commands)
                    }
                })
            }
        }
        if (commands.fileinfo_f != null) {
            myLegalContract.contractFile.call( function(error,response){
                if (error) {
                    console.log("There was an error getting the contract file details.  Error is \n" + error)
                }
                else {
                    console.log("The contract file details response is " + response);
                    var responsearray = response.toString().split(",")
                    var file_details = {version_number: "", last_updated: "", filehash: ""}
                    file_details.version_number = responsearray[0]
                    file_details.last_updated = new Date(responsearray[1] * 1000)
                    file_details.filehash = responsearray[2]
                    commands.fileinfo_f(file_details)
                }
            })
        }
        //main_contract_time_created: new Date(m_contract.main_contract_time_created * 1000).format('yyyy/MM/dd HH:mm:ss'),
        // test contract address 0x9be5ad1be7f96e5337193c75f63362d9fd8d0426
    },

    ClickViewTab: function() {
        var contractaddress = document.getElementById("contract_address").value
        var contractupdates = function(data){  document.getElementById("main_contract_details").innerHTML = "<p>Time Contract Created: " + data.time_created + "</p><p>Time Contract Signed: " + data.time_signed + "</p><p>Signed: <span id=\"signed_status\">" + data.signed + "</span></p>"; document.getElementById("contract_name").innerHTML="<p>" + data.name + "</p>"; $( "#signed_status:contains('false')" ).css('color', 'red'); $( "#signed_status:contains('true')" ).css('color', 'green');  }
        var paddressesupdates = function(address){ console.log("")}
        var partiesupdates = function(data){
            console.log("data.address is: " + data.address + " \n web3.eth.account is: " + web3.eth.accounts[0])
            data.status = Dapp.ConvertStatus(data.status)
            if(data.address == web3.eth.accounts[0]) {
                document.getElementById("party1_view_column").innerHTML = "<p>My Address: " + data.address + "</p><p>Name: " + data.name + "</p><p>Email: " + data.email + "</p><p>Status: " + data.status + "</p>";
             } else {
                document.getElementById("party2_view_column").innerHTML = "<p>Their Address: " + data.address + "</p><p>Name: " + data.name + "</p><p>Email: " + data.email + "</p><p>Status: " + data.status + "</p>"
             }
        }
        var fileupdates = function(data){ document.getElementById("document_view_details").innerHTML = "<p>Document Hash: " + data.filehash + "</p><p>Document Last Updated: " + data.last_updated + "</p><p>Document Version: " + data.version_number + "</p><p>To download the contract file, right click the link below, choose \"Save Link As\" and make sure to save the file name with the correct file format.</p><p></p><a href=\"https://ipfs.infura.io:5001/api/v0/cat?arg=" + data.filehash + "\">Document Link</a>" }
        var htmlupdates = { main_contract_f: contractupdates, parties_f: partiesupdates, parties_addresses_f: paddressesupdates, fileinfo_f: fileupdates }
        Dapp.UseDataFromContract(htmlupdates)
        Dapp.CleanNotifications();
    },


    ClickUploadTab: function() {
        document.getElementById("document_upload_status").innerHTML = "<p>Checking Document Upload Status</p>"
        var contractaddress = document.getElementById("contract_address")
        //make parties a .then to get the parties details after the partiesaddresses have been grabbed
        var partiesupdates = function(data){
            data.status = Dapp.ConvertStatus(data.status)
            if(data.address == web3.eth.accounts[0]) {
                document.getElementById("document_upload_status_p1").innerHTML = "<p>Our Status: " + data.status + " </p>"
             } else {
                document.getElementById("document_upload_status_p2").innerHTML = "<p>Their Status: " + data.status + " </p>"
             }
        }
        document.getElementById("document_upload_status").innerHTML = "<p>Document Uploading is only allowed if both parties are <span id=\"nego\">Negotiating</span>. </p>";
        htmlupdates = { parties_f: partiesupdates }
        Dapp.UseDataFromContract(htmlupdates)
        Dapp.CleanNotifications();
    },

    UploadContractFile: async function() {
        var contractaddress = document.getElementById("contract_address").value;
        var TwoPartyLegalContract = web3.eth.contract(abiinterface);
        var TwoPartyLegalContract = TwoPartyLegalContract.at(contractaddress)
        var files = document.getElementById("updated_document_upload").files;
        var filehash = await Dapp.AddFileIPFS(files[0]);
        TwoPartyLegalContract.updateDocument(filehash, { from: web3.eth.accounts[0] }, function(error, response) {
            console.log("Uploading file hash: " + filehash)
            if (error) {
                document.getElementById("upload_notifications").innerHTML = "<p>There was an error when uploading the document.</p>";
                console.log("There was an error uploading the document to Ethereum.  The error is: " + error)
            }
            else {
                if(!response.address) {
                    document.getElementById("upload_notifications").innerHTML = "<p>Contract transaction created.</p>"
                } else {
                    document.getElementById("upload_nofications").innerHTML = "<p>The file hash has been uploaded in IPFS and the hash stored in the contract</p>"
                    console.log("The file hash has been uploaded successfully to your contract.")
                }
            }
        })
        Dapp.CleanNotifications();
    },

    ClickUpdateTab: function() {
        var partiesupdates = function(data){
            if(data.address == web3.eth.accounts[0]) {
                console.log("Grabbed current parties details."); document.getElementById("name_update").value = data.name; document.getElementById("email_update").value = data.email; document.getElementById("address_update").value = data.address; document.getElementById("status_update").value = data.status;
            }
        }
        // pass in only the fields which have functions needed the UseDataFromContract method will set default parameters and check if method is empty
        htmlupdates = { parties_f: partiesupdates }
        Dapp.UseDataFromContract(htmlupdates)
        Dapp.CleanNotifications();
    },


    UpdatePartyDetails: function() {
        var contractaddress = document.getElementById("contract_address").value;
        var TwoPartyLegalContract = web3.eth.contract(abiinterface);
        var TwoPartyLegalContract = TwoPartyLegalContract.at(contractaddress)
        var name = document.getElementById("name_update").value;
        var email = document.getElementById("email_update").value;
        var address = document.getElementById("address_update").value;
        var status = document.getElementById("status_update").value;

        TwoPartyLegalContract.updateParty(address, name, email, status, { from: web3.eth.accounts[0] },  function(error, response) {
            console.log("Updating party with address: " + address + " name: " + name + " email: " + email + " status: " + status )
            if (error) {
                document.getElementById("upload_notifications").innerHTML = "<p>There was an error when updating Party Details.</p>"
                console.log("There was an error updating the party details in the contract.  The error is: " + error)
            }
            else {
                if(!response.address) {
                    console.log("response is" + response)
                } else {
                    document.getElementById("update_notifications").innerHTML = "<p>The party details have been updated.</p>"
                    console.log("The party details been updated in the contract.")
                }
            }
        })
        Dapp.CleanNotifications();
    }
}

window.addEventListener("load", function() {
    //window.jquery = $;
    //window.$ = $;
    ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
    console.log("gas estimate for deploying contract are 666800 for deployment")
    Dapp.VerifyIPFS();
    Dapp.CleanNotifications();
    web3 = new Web3(window.web3.currentProvider)
    //$('#update_notifications').innerHTML = "<p>Dapp Initialized</p>";
});
