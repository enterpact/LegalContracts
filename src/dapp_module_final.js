//file for Dapp javascript module

var ipfsAPI = require('ipfs-api');
var Buffer = require('buffer/').Buffer
var ipfs;
var buffer;
var web3;

var TwoPartyLegalContract;
var compiledcontract;






/////////Solidity Code//////////

//insertcompiledcodehere
var bytecode="0x" + "61012060408190526000610100818152608090815260a08290524260c05260e0829052916200003190829081620002ca565b5060208281015160018301805460ff191691151591909117905560408084015160028401556060938401516003909301929092558151928301825260008084524284830190815283519283018085529183529284018290528351600490815592516005559051620000a591600691620002ca565b505050348015620000b557600080fd5b5060405162001085380380620010858339810160409081528151602080840151928401516060850151908501805193959093910191620000fb91600091850190620002ca565b50805162000111906006906020840190620002ca565b5060078054600160a060020a03808716600160a060020a031992831617808455600880548884169416939093179092556040805160a081018252606081019485527f4e616d65204d65000000000000000000000000000000000000000000000000006080820152938452805160208082018352600080835281870192909252600286840152939092168252600983529020825180519192620001b992849290910190620002ca565b506020828101518051620001d49260018501920190620002ca565b50604082015160028201805460ff19166001836003811115620001f357fe5b0217905550506040805160a0810182526007606082019081527f4e616d65204d650000000000000000000000000000000000000000000000000060808301528152815160208082018452600080835281840192909252600283850152600854600160a060020a03168252600981529290208151805192945090926200027e92849290910190620002ca565b506020828101518051620002999260018501920190620002ca565b50604082015160028201805460ff19166001836003811115620002b857fe5b0217905550905050505050506200036f565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200030d57805160ff19168380011785556200033d565b828001600101855582156200033d579182015b828111156200033d57825182559160200191906001019062000320565b506200034b9291506200034f565b5090565b6200036c91905b808211156200034b576000815560010162000356565b90565b610d06806200037f6000396000f3006080604052600436106100775763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166334dc6aa8811461007c5780634f235207146100e9578063509aab9f146101fd5780635fba82b5146102985780636c2e51ae146102cc578063d270e7ab14610376575b600080fd5b34801561008857600080fd5b506040805160206004803580820135601f81018490048402850184019095528484526100d59436949293602493928401919081908401838280828437509497506103dd9650505050505050565b604080519115158252519081900360200190f35b3480156100f557600080fd5b5061010a600160a060020a036004351661052e565b60405180806020018060200184600381111561012257fe5b60ff168152602001838103835286818151815260200191508051906020019080838360005b8381101561015f578181015183820152602001610147565b50505050905090810190601f16801561018c5780820380516001836020036101000a031916815260200191505b50838103825285518152855160209182019187019080838360005b838110156101bf5781810151838201526020016101a7565b50505050905090810190601f1680156101ec5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34801561020957600080fd5b50610212610676565b6040518084815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561025b578181015183820152602001610243565b50505050905090810190601f1680156102885780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b3480156102a457600080fd5b506102b0600435610711565b60408051600160a060020a039092168252519081900360200190f35b3480156102d857600080fd5b5060408051602060046024803582810135601f81018590048502860185019096528585526100d5958335600160a060020a031695369560449491939091019190819084018382808284375050604080516020601f89358b018035918201839004830284018301909452808352979a9998810197919650918201945092508291508401838280828437509497505050923560ff16935061072e92505050565b34801561038257600080fd5b5061038b610a61565b60405180806020018515151515815260200184815260200183815260200182810382528681815181526020019150805190602001908083836000838110156101bf5781810151838201526020016101a7565b3360009081526009602052604081205460026000196101006001841615020190911604151561047c576040805160e560020a62461bcd02815260206004820152602f60248201527f596f7520617265206e6f74206f6e65206f66207468652070617274696573206f60448201527f6e207468697320636f6e74726163740000000000000000000000000000000000606482015290519081900360840190fd5b6104866002610b0b565b1515600114610505576040805160e560020a62461bcd02815260206004820152603e60248201527f446f63756d656e74206973204c6f636b65642e2020426f74682050617274696560448201527f7320737461747573657320617265206e6f74206e65676f74696174696e670000606482015290519081900360840190fd5b600480546001019055426005558151610525906006906020850190610b83565b50600192915050565b60096020908152600091825260409182902080548351601f600260001961010060018616150201909316929092049182018490048402810184019094528084529092918391908301828280156105c55780601f1061059a576101008083540402835291602001916105c5565b820191906000526020600020905b8154815290600101906020018083116105a857829003601f168201915b505050505090806001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106635780601f1061063857610100808354040283529160200191610663565b820191906000526020600020905b81548152906001019060200180831161064657829003601f168201915b5050506002909301549192505060ff1683565b600480546005546006805460408051602060026001851615610100026000190190941693909304601f81018490048402820184019092528181529495939492918301828280156107075780601f106106dc57610100808354040283529160200191610707565b820191906000526020600020905b8154815290600101906020018083116106ea57829003601f168201915b5050505050905083565b6007816002811061071e57fe5b0154600160a060020a0316905081565b336000908152600960205260408120546002600019610100600184161502019091160415156107cd576040805160e560020a62461bcd02815260206004820152602f60248201527f596f7520617265206e6f74206f6e65206f66207468652070617274696573206f60448201527f6e207468697320636f6e74726163740000000000000000000000000000000000606482015290519081900360840190fd5b83511515610825576040805160e560020a62461bcd02815260206004820152601a60248201527f546865206e616d65206d757374206e6f7420626520656d707479000000000000604482015290519081900360640190fd5b60015460ff16156108a6576040805160e560020a62461bcd02815260206004820152603d60248201527f54686520636f6e747261637420686173206265656e207369676e6564206e6f2060448201527f66757274686572206d6f64696669636174696f6e7320616c6c6f776564000000606482015290519081900360840190fd5b600160a060020a0385166000908152600960205260409020546002600019610100600184161502019091160415156109a05733600090815260096020526040808220600160a060020a038816835291208154610918908290849060026000196101006001841615020190911604610c01565b5060018201816001019080546001816001161561010002031660029004610940929190610c01565b50600282810154908201805460ff9092169160ff1916600183600381111561096457fe5b02179055505050336000908152600960205260408120906109858282610c76565b610993600183016000610c76565b50600201805460ff191690555b600160a060020a038516600090815260096020908152604090912085516109c992870190610b83565b50600160a060020a038516600090815260096020908152604090912084516109f992600190920191860190610b83565b50600160a060020a0385166000908152600960205260409020600201805483919060ff19166001836003811115610a2c57fe5b0217905550610a3b6000610b0b565b151560011415610a56576001805460ff191681179055426003555b506001949350505050565b60008054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152918391830182828015610ae95780601f10610abe57610100808354040283529160200191610ae9565b820191906000526020600020905b815481529060010190602001808311610acc57829003601f168201915b5050505060018301546002840154600390940154929360ff9091169290915084565b6000805b6002811015610b7857826003811115610b2457fe5b6009600060078460028110610b3557fe5b0154600160a060020a0316815260208101919091526040016000206002015460ff166003811115610b6257fe5b14610b705760009150610b7d565b600101610b0f565b600191505b50919050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610bc457805160ff1916838001178555610bf1565b82800160010185558215610bf1579182015b82811115610bf1578251825591602001919060010190610bd6565b50610bfd929150610cbd565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610c3a5780548555610bf1565b82800160010185558215610bf157600052602060002091601f016020900482015b82811115610bf1578254825591600101919060010190610c5b565b50805460018160011615610100020316600290046000825580601f10610c9c5750610cba565b601f016020900490600052602060002090810190610cba9190610cbd565b50565b610cd791905b80821115610bfd5760008155600101610cc3565b905600a165627a7a723058209493b9699087821283399fd6bc5f744c3c7636067fdf284923829c5bd34c032a0029"


//insertabihere
var abiinterface=[{"constant":false,"inputs":[{"name":"hash","type":"string"}],"name":"updateDocument","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"parties","outputs":[{"name":"name","type":"string"},{"name":"email","type":"string"},{"name":"status","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"contractFile","outputs":[{"name":"version_number","type":"uint256"},{"name":"last_updated","type":"uint256"},{"name":"filehash","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"partiesAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"adr","type":"address"},{"name":"name","type":"string"},{"name":"email","type":"string"},{"name":"p_status","type":"uint8"}],"name":"updateParty","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mainContract","outputs":[{"name":"name","type":"string"},{"name":"signed","type":"bool"},{"name":"time_created","type":"uint256"},{"name":"time_signed","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"party1","type":"address"},{"name":"party2","type":"address"},{"name":"name","type":"string"},{"name":"filehash","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]


///////////////END/////////////




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
                document.getElementById("update_notifications").innerHTML = "<p>There was an error Connecting to IPFS.</p>";
                console.log("There was an error Connecting to IPFS: " + error);
            }
            else
            {
                document.getElementById("update_notifications").innerHTML = "<p>Connected to IPFS.</p>";
                console.log("Connected to IPFS node: ", result.id, result.agentVersion, result.protocolVersion);
            }
        })
        Dapp.CleanNotifications();
    },

    AddFileIPFS: function(file) {
       return new Promise(resolve => {
       var reader = new FileReader();
       reader.onload = function(e) {
           var buffer = Buffer.from(reader.result)
               ipfs.files.add(buffer, function(error, files){
                   if (error){
                       console.log("There was an error uploading the file which is: " + error);
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
        if (document.getElementById("document_upload_status_p1").innerHTML.includes("Negotiating") == false || document.getElementById("document_upload_status_p2").innerHTML.includes("Negotiating") == false) {
            console.log("both are not negotiating")
            return alert("Both statuses must be Negotiating to upload a contract document.")
        }
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
    ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'});
    Dapp.VerifyIPFS();
    Dapp.CleanNotifications();
    web3 = new Web3(window.web3.currentProvider)
});
