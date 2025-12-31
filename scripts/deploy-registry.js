import hre from "hardhat";

async function main() {
    //get configured signer for this network
    const [deployer] = await hre.ethers.getSigner();
    console.log("Deploying", deployer.address);

    //Creating contract factory using this signer
    const Factory = await hre.ethers.getContractFactory(
                            "SensorAttestationRegistry",
                            deployer);
                            
    const contract = await Factory.deploy();
    await contract.waitForDeployment();

    console.log("SensorAttestationRegistry deployed", await contract.getAddress());
}

main().catch((err)=>{
    console.log(err);
    process.exitCode = 1;
});