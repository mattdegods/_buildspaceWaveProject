async function main() {

    const waveContractFactory = await ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({value: ethers.utils.parseEther("0.1")});
    await waveContract.deployed()
    console.log("WavePortal adress: ", waveContract.address);   

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });