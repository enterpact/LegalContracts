pragma solidity ^0.4.24;

/// @title TwoPartyLegalContract
/// @author Mark Focella


//find the newest version of solidity above
contract TwoPartyLegalContract{

    enum Status { signed, reviewing, negotiating, rejected }

    struct Party{
        string name;
        string email;
        Status status;
    }

    struct contractAgreement{
        string name;
        bool signed;
        uint time_created;
        uint time_signed;
    }

    struct contractDocument{
        uint version_number;
        uint last_updated;
        string filehash;
    }

    contractAgreement public mainContract = contractAgreement("",false,block.timestamp,0);
    contractDocument public contractFile = contractDocument(0,block.timestamp,"");
    address[2] public partiesAddresses;
    mapping (address => Party) public parties;
    Status status;

    constructor(address party1, address party2, string name, string filehash) public {
        /// @notice Initializes a TwoPartyLegalContract Contract
        //initializer function to initialize parties and main contract
        mainContract.name = name;
        contractFile.filehash = filehash;
        partiesAddresses[0] = party1;
        partiesAddresses[1] = party2;
        parties[partiesAddresses[0]] = Party("Name Me","",Status.negotiating);
        parties[partiesAddresses[1]] = Party("Name Me","",Status.negotiating);
        //This returns an address for the contract if successful
    }

    modifier onlyParties() {
        require(bytes(parties[msg.sender].name).length != 0, "You are not one of the parties on this contract");
        _;
    }

    function updateParty(address adr, string name, string email, Status p_status) onlyParties public returns(bool) {
        /// @notice Updates address, name, email and status of a party
        require (bytes(name).length != 0, "The name must not be empty");
        require (mainContract.signed == false, "The contract has been signed no further modifications allowed");
        //do error handling in javascript for address that isn't the right length of public address
        if (bytes(parties[adr].name).length == 0){
            parties[adr] = parties[msg.sender];
            if (msg.sender == partiesAddresses[0]) {
                partiesAddresses[0] == adr;
            }
            else {
                partiesAddresses[1] == adr;
            }
            delete parties[msg.sender];  //nullify old public address
        }
        parties[adr].name = name;
        parties[adr].email = email;
        parties[adr].status = p_status;

        if (checkStatuses(Status.signed) == true) {
            mainContract.signed = true;
            mainContract.time_signed = block.timestamp;
        }
        return true;
        //do I need error handling here?
    }

    function updateDocument(string hash) onlyParties public returns(bool){
        /// @notice Updates document hash, name and version number
        require (checkStatuses(Status.negotiating) == true, "Document is Locked.  Both Parties status is not negotiating");
        contractFile.version_number += 1;
        contractFile.last_updated = block.timestamp;
        contractFile.filehash = hash;
        return true;
    }

    function checkStatuses(Status stat) private view returns(bool) {
        for(uint i = 0; i < partiesAddresses.length; i++){
            if (parties[partiesAddresses[i]].status!=stat){
                return false;
            }
        }
        return true;
    }
}
