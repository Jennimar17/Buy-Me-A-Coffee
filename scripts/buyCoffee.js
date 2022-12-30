// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

//return the balance address
async function getBalance(address) {
  const balance = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balance);
}

//print the balance of a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} Balance: `, await getBalance(address));
    idx++;
  }
}

//logs coffee purchases 
async function printMemos(memos) {
  for (const memo of memos) {
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const timestamp = memo.timestamp;
    let date = new Date(timestamp * 1000); //convert time :)
    console.log(`Coffee purchased at ${date} by ${tipper} (${tipperAddress})`);
  }
}


async function main() {

  //example addresses
  const [owner, addr1, addr2, addr3] = await hre.ethers.getSigners();

  //get the contract to deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

  //check balance before coffee purchase
  const addresses = [owner.address, addr1.address, addr2.address, addr3.address];
  console.log("Balances before");
  await printBalances(addresses);

  //buy coffees
  const tip = { value: hre.ethers.utils.parseEther("0.01") };
  await buyMeACoffee.connect(addr1).buyCoffee("Alice", tip);
  await buyMeACoffee.connect(addr2).buyCoffee("Brenda", tip);
  await buyMeACoffee.connect(addr3).buyCoffee("Sara", tip);

  //check balance after coffee purchase
  console.log("Balances after");
  await printBalances(addresses);

  //withdraw funds
  await buyMeACoffee.connect(owner).withdraw();

  //check balance after withdraw
  console.log("Balances after withdraw");
  await printBalances(addresses);

  //get memos 
  console.log("Memos");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
