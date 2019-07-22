pragma  solidity ^0.5.1;

/// @title TwoPartyLegalContract
/// @author Mark Focella


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
        bool worldreadable;
        uint currentdocumentversion;
    }

    struct contractDocument{
        string name;
        string comment;
        uint version_number;
        uint last_updated;
        string filehash;
    }
    
    event updatePartyDetails(address indexed party, string name, Status updatedstatus);

    contractAgreement internal mainContract = contractAgreement("",false,block.timestamp,0,false,0);
    contractDocument[] internal contractVersions;
    address[2] internal partiesAddresses;
    mapping (address => Party) internal parties;
    Status internal status;
    uint public leth_ContractVersion = 2;

    constructor(address party1, address party2, string memory name, string memory filehash, string memory filename, bool worldreadable)  public  {
        /// @notice Initializes a TwoPartyLegalContract Contract
        //initializer function to initialize parties and main contract
        mainContract.name = name;
        mainContract.worldreadable = worldreadable;
        contractVersions.push(contractDocument(filename,"Initial Document Uploaded with Contract Creation",0,block.timestamp,filehash));
        partiesAddresses[0] = party1;
        partiesAddresses[1] = party2;
        parties[partiesAddresses[0]] = Party("X","",Status.negotiating);
        parties[partiesAddresses[1]] = Party("X","",Status.negotiating);
    }

    modifier onlyParties() {
        require(bytes(parties[msg.sender].name).length != 0, "You are not one of the parties on this contract");
        _;
    }

    modifier allreadable() {
        if(mainContract.worldreadable == false){
            require(bytes(parties[msg.sender].name).length != 0, "You are not one of the parties on this contract");
        }
        _;
    }

    function contractVersions_pub(uint i) public view allreadable returns(string memory,string memory,uint,uint,string memory){
        return (contractVersions[i].name,contractVersions[i].comment,contractVersions[i].version_number,contractVersions[i].last_updated,contractVersions[i].filehash);
    }

    function partiesAddresses_pub() public view allreadable returns(address[2] memory) {
        return partiesAddresses;
    }

    function parties_pub(address i) public view allreadable returns(string memory,string memory,Status){
        return (parties[i].name,parties[i].email,parties[i].status);
    }

    function mainContract_pub() public view allreadable returns(string memory,bool,uint,bool,uint,uint) {
        return (mainContract.name,mainContract.signed,mainContract.time_created,mainContract.worldreadable,mainContract.time_signed,mainContract.currentdocumentversion);
    }

    function updateParty(address adr, string memory name, string memory email, Status p_status) onlyParties public returns(bool) {
        /// @notice Updates address, name, email and status of a party
        require (bytes(name).length != 0, "The name must not be empty");
        require (mainContract.signed == false, "The contract has been signed no further modifications allowed");
        if (bytes(parties[adr].name).length == 0){
            parties[adr] = parties[msg.sender];
            if (msg.sender == partiesAddresses[0]) {
                partiesAddresses[0] = adr;
            }
            else {
                partiesAddresses[1] = adr;
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
        emit updatePartyDetails(msg.sender, name, p_status);
        return true;
        //do I need error handling here?
    }

    function updateDocument(string memory hash, string memory filename, string memory comment) onlyParties public returns(bool){
        /// @notice Updates document hash, name and version number
        require (checkStatuses(Status.negotiating) == true, "Document is Locked.  Both Parties statuses are not negotiating");
        mainContract.currentdocumentversion += 1;
        uint versionnumber = mainContract.currentdocumentversion;
        contractVersions.push(contractDocument(filename,comment,versionnumber,block.timestamp,hash));
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
