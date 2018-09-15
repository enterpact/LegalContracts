import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/leth_contracts.sol";



contract Test_leth_contract {
    function testInitialDeployedContractData() {
        address memory addr1 = "841544a65141458e84fa290b36c5e6eac144e549";
        address memory addr2 = "741544a65141458e84fa290b36c5e6eac144e548";
        string name = "Test_ct";
        bool signed = false;
        uint t_created = block.timestamp;
        uint t_signed = 0;

        TwoPartyLegalContract ct = TwoPartyLegalContract(addr1, addr2, name);
        Party party1 = Party("","",negotiating);
        contractDocument ct_file = contractDocument(0,0,"","");

        parties_addresses[1] = addr1;
        parties_addresses[2] = addr2;
        parties[parties_addresses[1]] = Party("","",negotiating);
        parties[parties_addresses[2]] = Party("","",negotiating);

        Assert.equal(ct.mainContract.name, name, "Name should be Test_ct");
        Assert.equal(ct.mainContract.signed, signed, "Signed should be false");
        Assert.equal(ct.mainContract.time_created, t_created, "time_created should be now");
        Assert.equal(ct.mainContract.name, t_signed, "time_signed should be 0");
        Assert.equal(ct.parties_addresses[1], addr1, "Address should be 841544a65141458e84fa290b36c5e6eac144e549");
        Assert.equal(ct.parties_addresses[2], addr2, "Address should be 741544a65141458e84fa290b36c5e6eac144e548");
        Assert.equal(ct.parties[addr1], party1, "Party1 should be \"\" \"\" negotiating");
        Assert.equal(ct.parties[addr2], party1, "Party2 should be \"\" \"\" negotiating");
        Assert.equal(ct.contract_file, ct_file, "ct_file should be 0,0,\"\",\"\"" );

    }


    function testupdateParty() {
        address memory addr1 = "841544a65141458e84fa290b36c5e6eac144e549";
        address memory addr2 = "741544a65141458e84fa290b36c5e6eac144e548";
        address memory addr3 = "741544a65141458e84fa290b36c5e6eac144e547";
        string name = "Bitcoin";
        string email = "bitcoin@bitcoin.com";
        bool signed = false;
        uint t_created = block.timestamp;
        uint t_signed = 0;
        Party p1 = Party(addr3, name, email, reviewing);

        TwoPartyLegalContract ct = TwoPartyLegalContract(addr1, addr2, name);
        Party party1 = Party("","",negotiating);
        contractDocument ct_file = contractDocument(0,0,"","");

        Assert.equal(ct.updateParty(addr3, name, email, reviewing), p1, "Party should be 741544a65141458e84fa290b36c5e6eac144e547, Bitcoin, bitcoin@bitcoin.com, reviewing" );
    }


    function testupdatePartywhensigned() {
        //check this works correctly
        address memory addr1 = "841544a65141458e84fa290b36c5e6eac144e549";
        address memory addr2 = "741544a65141458e84fa290b36c5e6eac144e548";
        address memory addr3 = "741544a65141458e84fa290b36c5e6eac144e547";
        string name = "Bitcoin";
        string email = "bitcoin@bitcoin.com";
        bool signed = false;
        uint t_created = block.timestamp;
        uint t_signed = 0;
        Party p1 = Party(addr3, name, email, reviewing);
        string error = "The contract has been signed no further modifications allowed";

        TwoPartyLegalContract ct = TwoPartyLegalContract(addr1, addr2, name);
        Party party1 = Party("","",signed);
        Party party2 = Party("","",signed);
        ct.parties[addr1] = party1;
        ct.parties[addr2] = party2;
        contractDocument ct_file = contractDocument(0,0,"","");

        Assert.equal(ct.updateParty(addr3, name, email, reviewing), error, "Correct error not thrown" );
    }


    function testupdateDocument() {
        address memory addr1 = "841544a65141458e84fa290b36c5e6eac144e549";
        address memory addr2 = "741544a65141458e84fa290b36c5e6eac144e548";
        string name = "Test_ct";
        bool signed = false;
        uint t_created = block.timestamp;
        uint t_signed = 0;

        TwoPartyLegalContract ct = TwoPartyLegalContract(addr1, addr2, name);
        Party party1 = Party("","",negotiating);
        contractDocument ct_file = contractDocument(0,0,"","");
    }


    function testcheckStatuses() {
        address memory addr1 = "841544a65141458e84fa290b36c5e6eac144e549";
        address memory addr2 = "741544a65141458e84fa290b36c5e6eac144e548";
        string name = "Test_ct";
        bool signed = false;
        uint t_created = block.timestamp;
        uint t_signed = 0;

        TwoPartyLegalContract ct = TwoPartyLegalContract(addr1, addr2, name);
        Party party1 = Party("","",negotiating);
        contractDocument ct_file = contractDocument(0,0,"","");
        ct.parties_addresses[1] = addr1;
        ct.parties_addresses[2] = addr2;

        //test the function checkStatuses() here   HOW TO TEST INTERNAL FUNCTION???
        Assert.equal(ct.checkStatuses(negotiating), true, "checkStatuses(negotiating should be true" );
    }

}