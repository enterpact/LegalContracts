
//var assert = require('assert');
var chai = require("chai");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);
var assert = chai.assert;


beforeEach(function(){
    document.body.innerHTML = __html__['www/index.html'];
});

afterEach(function(){
});

describe('CleanNotifications()', function(){
    it('should remove text from notifications divs', function(){
        document.getElementById("update_notifications").innerHTML = "<p>HI</p>"
        document.getElementById("upload_notifications").innerHTML = "<p>HI</p>"
        Dapp.CleanNotifications();

        setTimeout(function () {
            var notes2 = document.getElementById("upload_notifications").innerHTML
            var notes1 = document.getElementById("update_notifications").innerHTML
            assert.equal(notes1,"","They are not equal")
            assert.equal(notes2,"","They are not equal")
        }, 6000);
    })
});

describe('VerifyIPFS()', function(){
    it('should successfully connect to IPFS', function(){
        Dapp.VerifyIPFS();
        var msg = document.getElementById("update_notifications").innerHTML;
        setTimeout(function(){
            assert.equal(msg,"<p>Connected to IPFS.</p>");
        }, 2000)
    })
});

//describe('#AddFileIPFS(file)', function() {
    //create below so it returns a promise and can use async await
    //it('file should exist on ipfs after getting added', async function(){
        //var originalfile = Math.random().toString(36).substring(10);
        //var filehash = Dapp.AddFileIPFS(originalfile)
        //setTimeout(function(filehash){
            //ipfs.files.add(originalfile, onlyHash, function (err, files) {
                //if (err){
                //} else {
                //var ipfsfilecontents = $.get("https://ipfs.infura.io:5001/api/v0/get?arg=" + filehash, function (data){
                    //response = data
                    //assert.include(response,originalfile,"The file has been uploaded to IPFS.");
                //})
                    //files[0].hash
                //}
            //})
        //})
//    })
//});

describe('#UseDataFromContract(cmds)', function() {
    it('should return contract data when given a correct mainContractAddress', function() {
        document.getElementById("contract_address").value = "0x9be5ad1be7f96e5337193c75f63362d9fd8d0424";
        var contractupdates = function(data) { document.getElementById("main_contract_details").innerHTML = data.time_created }
        var partiesupdates = function(data) { document.getElementById("party1_view_column").innerHTML = data.address }
        var paddressesupdates = function(address) { document.getElementById("party2_view_column").innerHTML = address  }
        var fileupdates = function(data) { document.getElementById("document_view_details").innerHTML = data.filehash}
        var htmlupdates = { main_contract_f: contractupdates, parties_f: partiesupdates, parties_addresses_f: paddressesupdates, fileinfo_f: fileupdates }
        Dapp.UseDataFromContract(htmlupdates);

        setTimeout( function() {
            var contractinfo = document.getElementById("main_contract_details").innerHTML
            var partiesinfo = document.getElementById("party1_view_column").innerHTML
            var addressinfo = document.getElementById("party2_view_column").innerHTML
            var fileinfo = document.getElementById("document_view_details").innerHTML
            assert.equal(contractinfo,"hi","They are not equal")
            assert.equal(partiesinfo,"hi","They are not equal")
            assert.equal(addressinfo,"","They are not equal")
            assert.equal(fileinfo,"","They are not equal")
        }, 6000)
    })

    it('should throw an error with bad contract address', function() {
        //deploy a contract on testnet that can be used to test against
        var contractaddress = "0x9be5ad1be7f96e5337193c75f63362d9fd8d0424";
        Dapp.UseDataFromContract(cmds);
    })
});

describe('#ClickViewTab()', function() {
    it('should update html page with details', function(){
        document.getElementById("contract_address").value = "0x9be5ad1be7f96e5337193c75f63362d9fd8d0424";
        Dapp.ClickViewTab();
        var response_message = document.getElementByClassName("view_response_messages").text();
        assert.include(response_message,"Grabbing contract data for contract address","String contains Substring");
    })
});

describe('#ClickUploadTab()', function() {
    it('should update html page', function(){
        document.getElementById("contract_address").value = "0x9be5ad1be7f96e5337193c75f63362d9fd8d0424";
        Dapp.ClickUploadTab();
        var upload_status = document.getElementById("document_upload_status").text();
        assert.equal(upload_status,"Document Uploading is: unlocked","They are not the same.")
    })
});

describe('#ClickUpdateTab()', function() {
    it('should update html page', function(){
        document.getElementById("contract_address").value = "0x9be5ad1be7f96e5337193c75f63362d9fd8d0424";
        Dapp.ClickUpdateTab();
        var name = document.getElementById("name_update").value
        var email = document.getElementById("email_update").value
        var address = document.getElementById("address_update").value
        var status = document.getElementById("status_update").value
        assert.equal(name,"hi","They are not equal")
        assert.equal(email,"hi","They are not equal")
        assert.equal(address,"hi","They are not equal")
        assert.equal(status,"hi","They are not equal")
    })
});

describe('#UpdatePartyDetails()', function() {
    it('should update the contracts Party Details', function(){
    document.getElementById("name_update").value = Math.random().toString(36).substring(6);
    document.getElementById("email_update").value = Math.random().toString(36).substring(6);
    // set gas price if no other gas price set
    Dapp.UpdatePartyDetails();
    setTimeout(function () {
        Dapp.ClickUpdateTab();
        var name = document.getElementById("name_update").value
        var email = document.getElementById("email_update").value
        assert.equal(name,"","They are not equal")
        assert.equal(email,"","They are not equal")
    }, 6000);
    })
});




