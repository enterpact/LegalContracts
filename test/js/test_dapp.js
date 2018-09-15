var legal_contract = artifacts.require("leth_contract");

//build a script which starts ganashe from npm
//list 3 ganashe accounts and login to them with web3

var assert = require('assert');
var sinon = require('sinon');

//how to test promises below do this for all the methods and all their return values
//check how tests are done for other projects
//or wait to test the js functions and only test the solidity functions
it('resolves as promised', function() {
    return Promise.resolve("woof")
        .then(function(m) { expect(m).to.equal('woof'); })
        .catch(function(m) { throw new Error('was not supposed to fail'); })
            ;
});

it('rejects as promised', function() {
    return Promise.reject("caw")
        .then(function(m) { throw new Error('was not supposed to succeed'); })
        .catch(function(m) { expect(m).to.equal('caw'); })
            ;
});



describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
        assert.equal([1,2,3].indexOf(4), -1);
    })
});

describe('CleanNotifications()', function(){
    it('should remove text from notifications divs', function(){
        document.getElementById("update_notifications").innerHTML = "<p>HI</p>"
        document.getElementById("upload_notifications").innerHTML = "<p>HI</p>"
        CleanNotifications();
        var notes1 = document.getElementById("update_notifications").value
        var notes2 = document.getElementById("upload_notifications").value
        assert.equal(notes1,"")
        assert.equal(notes2,"")
    })
});

describe('VerifyIPFS()', function(){
    it('should log correct string to the console'),function(){
        var consolespy = sinon.spy(console, 'log');
        VerifyIPFS();
        assert.includes(consolespy,"There was an error Connecting to IPFS","String contains Substring");
        consolespy.restore();
    })
});

describe('#AddFileIPFS(file)', function() {
    it('file should exist on ipfs', function(){
        var originalfile = Math.random().toString(36).substring(10);
        var filehash = AddFileIPFS(file)
        var response
        var ipfsfilecontents = $.get("https://ipfs.infura.io:5001/api/v0/get?arg=" + filehash, function (data){
            response = data
        })
        assert.includes(response,originalfile,"The file has been uploaded to IPFS.");
    })
});

describe('#compileMainContract()', function() {
    var compiledcontract = compileMainContract();
    it('should return a variable with bytecode', function(){
        assert.isOK(compiledcontract.contracts['leth_contract.sol:TwoPartyLegalContract'].bytecode);
    })

    it('should return a variable with interface', function(){
        assert.isOK(compiledcontract.contracts['leth_contract.sol:TwoPartyLegalContract'].interface);
    })
});

describe('#DeployMainContract()', function() {
    //must set compiledcontract here
    var compiledcontract;
    it('should write to the console if no file is selected', function() {
        var consolespy = sinon.spy(console, 'log');
        document.getElementById("initialize_document").name = ""
        SubmitAndDeployMainContract();
        assert.includes(consolespy,"No file Selected to be Uploaded","Message logged to console");
        consolespy.restore();
    })

    it('should deploy the contract if given the correct compiledcontract', function() {
        var compiledcontract = { interface:"", bytecode:""}
        SubmitAndDeployMainContract();
        text_update = document.getElementById("mainContractDeploymentText").value
        assert.includes(text_update,"The contract has been deployed.", "The deployed contract outputs the correct text")
    })

    it('should expose an error if given a broken compiledcontract', function() {
        SubmitAndDeployMainContract();
        text_update = document.getElementById("mainContractDeploymentText").value
        assert.includes(text_update,"There was an error when deploying the contract.", "The deployed contract outputs the correct text")
    })
});

describe('#GetContractData(mainContractAddress)', function() {
    it('should throw an error if given a fake mainContractAddress', function() {
        var consolespy = sinon.spy(console, 'log');
        var fakeaddress = "notreal"
        GetContractData(fakeaddress);
        assert.includes(consolespy,"There was an error with GetContractData:","String contains Substring");
        consolespy.restore();
    })

    it('should return contract data when called', function() {
        //deploy a contract on testnet that can be used to test against
        var contractaddress = "FILL ME IN after deploying contract to rinkeby network!!!";
        var contractdata = GetContractData(contractaddress);
        assert.isOk(contractdata.main_contract_name);
        assert.isOk(contractdata.main_contract_signed);
        assert.isOk(contractdata.main_contract_time_signed);
        assert.isOk(contractdata.main_contract_time_created);
        assert.isOk(contractdata.party2_address);
        assert.isOk(contractdata.party1_address);
        assert.isOk(contractdata.party2_status);
        assert.isOk(contractdata.party1_status);
        assert.isOk(contractdata.party2_email);
        assert.isOk(contractdata.party1_email);
        assert.isOk(contractdata.party2_name);
        assert.isOk(contractdata.party1_name);
        assert.isOk(contractdata.document_version);
        assert.isOk(contractdata.document_last_updated);
        assert.isOk(contractdata.document_hash);
        assert.isOk(contractdata.document_status);
    })
});

describe('#ClickViewTab()', function() {
    it('should update html page with details', function(){
        ClickViewTab();
        var response_message = document.getElementByClassName("view_response_messages").text();
        assert.includes(response_message,"Grabbing contract data for contract address","String contains Substring");
    })
});

describe('#ClickUploadTab()', function() {
    it('should update html page', function(){
        ClickUploadTab();
        var upload_status = document.getElementById("document_upload_status").text();
        assert.equal(upload_status,"Document Uploading is: unlocked")
    })
});

describe('#UploadContractFile()', function() {
    it('should log to console if file is empty', function(){
        document.getElementById("updated_document_upload").name = ""
        var docname = document.getElementById("updated_document_upload").name
        var consolespy = sinon.spy(console, 'log');
        UploadContractFile();
        assert.includes(consolespy,"No file Selected to Upload as the Contract File.","String contains Substring");
        consolespy.restore();
    })
    it('should update the contract hash and add a new ipfs hash', function(){
    //might have to set document.getElementById("contract_address").value; to a test contract address

    })
});

describe('#ClickUpdateTab()', function() {
    it('should update html page with message', function(){
        ClickUpdateTab();
        var response_text = document.getElementByClassName("view_response_messages").text();
        assert.includes(response_text,"Grabbing contract data for updating.","String contains Substring");
    })
});

describe('#UpdatePartyDetails()', function() {
    //remove all tests which update ethereum blockchain or test with GetContractData method
    it('should update html page', function(){
        assert.includes("remove all tests which update ethereum blockchain OR ","test with GetContracdData method","which is better?" )
    })
});







