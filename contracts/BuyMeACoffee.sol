// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

//deployed to Goerli Testnet 0x5822Abb529dF7cf56d00caF8B15b134d7fA46d01

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
    
    //event NewMemo
    event NewMemo(address indexed from, string name, uint256 timestamp);

    //NewMemo
    struct Memo {
        address from;
        string name;
        uint256 timestamp;
    }

    //Memo List
    Memo[] memos;

    //address owner
    address payable owner;

    //constructor
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     */
    function buyCoffee(string memory _name) public payable {
        require(msg.value >= 0, "Not enough ETH");

        //add memo to strg
        memos.push(Memo(msg.sender, _name, block.timestamp));

        //emit event
        emit NewMemo(msg.sender, _name, block.timestamp);
    }

    /**
     * @dev send all ETH to owner
     */
    function withdraw() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev get all memos from contract
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
