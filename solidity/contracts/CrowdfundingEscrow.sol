//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

/*
    1. Jill creates escrow SC, passing the project name, description, end date, and goal
    2. Jill pays gas fee to deploy
    3. Bob commits 1 ETH to project, locked in Jill's SC
    4. Bob can cancel his commitment before end date
    5. Once end date is reached, funds locked in Jill's SC are sent to Jill's personal wallet
*/

contract CrowdfundingEscrow {
    string name;
    string description;v
    uint endDate;
    uint goalAmount;
    uint totalAmountRaised;
    address payable creator;
    mapping(address => uint) public commitmentAmounts;

    constructor(string _name, string _description, uint _endDate, uint _goalAmount){
        name = _name;
        description = _description;
        endDate = _endDate;
        goalAmount = _goalAmount;
        creator = payable(msg.sender);
    }

    function commitFunds() public payable {
        // require current date is less than endDate
        totalAmountRaised += msg.value;
        commitmentAmounts[msg.sender] += msg.value;
    }

    function cancelCommitment(address payable _address, uint _amount) public payable {
        // require current date is less than endDate
        require(commitmentAmounts[_address] > 0, "Error: No commitment amount found")
        _address.transfer(_amount)
    }

    function viewTotalAmountRaised() public view returns(uint){
        return totalAmountRaised;
    }
}
