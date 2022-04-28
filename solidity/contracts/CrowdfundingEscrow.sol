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
    string public title;
    string public description;
    uint public endDate;
    uint public goalAmount;
    bool public goalAmountAchieved;
    uint public totalAmountRaised;
    address payable public creator;
    mapping(address => uint) public commitmentAmounts;

    //["TestTitle","Cool",1651273213,10000]
    constructor(string memory _title, string memory _description, uint _endDate, uint _goalAmount){
        title = _title;
        description = _description;
        endDate = _endDate;
        goalAmount = _goalAmount;
        creator = payable(msg.sender);
    }

    // Once endDate is reached, send the funds held in escrow
    // to the owner of the contract
    function closeEscrow() public payable {
        require(block.timestamp >= endDate, "Error: endDate has not been reached");
        require(totalAmountRaised > 0, "Error: No funds were raised");
        creator.transfer(totalAmountRaised);
    }

    function commitFunds() public payable {
        require(block.timestamp < endDate, "Error: Escrow is closed");
        require(msg.sender.balance > 0, "Error: No funds");

        totalAmountRaised += msg.value;
        commitmentAmounts[msg.sender] += msg.value;
        if(totalAmountRaised >= goalAmount){
            goalAmountAchieved = true;
        }
    }

    // Allow the funds committer to change their mind
    function cancelCommitment(uint _amount) public payable {
        require(block.timestamp < endDate, "Error: Escrow is closed");
        require(commitmentAmounts[msg.sender] > 0, "Error: No commitment amount found");
        payable(msg.sender).transfer(_amount);
        totalAmountRaised -= _amount;

        // The goalAmount can be true but then change to false if
        // someone cancels their commitment
        if(totalAmountRaised < goalAmount){
            goalAmountAchieved = false;
        }
    }
}