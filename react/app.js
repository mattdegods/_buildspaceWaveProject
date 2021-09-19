import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import myABI from './utils/WavePortal.json'

export default function App() {
  // state variables for user wallet
  const [currAccount, setCurrentAccount] = React.useState("")
  const [allWaves, setAllWaves] = React.useState([])
  const [globalWaveCount, setGlobalWaveCount] = React.useState("")
  const [userMessage, setUserMessage] = React.useState("")

   // contract address
  const contractAddress = "0xD01305CbcC4DFb39c92E86C2a20595106C4D83a1"
  const contractABI = myABI.abi

  function changeHandler(e) {
    let usermsg = e.target.value
    setUserMessage(usermsg)
  }

  const checkIfWalletIsConnected = () => {
    // first make sure we have access to window.ethereum
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have the MetaMask extension installed in your web browser!")
      return
    } else {
      console.log("We have the Ethereum object!", ethereum)
    }

    // check if we have access to user's wallet (they give permission in metamask)
    ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        console.log(accounts)
        // we could have multiple accts, check for one
        if (accounts.length !== 0) {
          
          // grab the first (0th) account we have access to
          const account = accounts[0];
          console.log("Found an authorized account: ", account)
          // store the user's public wallet address for later
          setCurrentAccount(account);
          showAllWaves();
        } else {
          console.log("No authorized accounts found.")
        }
      })
  }

  const connectWallet = async () => {
    const { ethereum } = window;
    if (window.ethereum) {
      // NEW - check the metamask network 
      const chainId = await window.ethereum.request({ method: 'eth_chainId'});
      if (chainId != '0x4') {
        alert("Please connect to the Rinkeby network!")
      } else {
        ethereum.request({ method: "eth_requestAccounts" })
        .then(accounts => {
          console.log("Connected", accounts[0])
          setCurrentAccount(accounts[0])
        })
        .catch(err => console.log(err));
      }
    } else {
      alert("Please install the MetaMask browser extension to continue.")
    }
  }

  // asyncronous function that logs and counts total global waves and total user waves
  const wave = async () => {     // function takes no args and uses arrow notation
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    // grab initial wave counts - global and local
    let globalCount = await waveportalContract.totalWaves()
    console.log("Original global waves: ", globalCount);

    const waveTxn = await waveportalContract.wave(`${userMessage}`, { gasLimit: 300000 })
    console.log("Mining...", waveTxn.hash)

    await waveTxn.wait()
    console.log("Mined! Txn ID: ", waveTxn.hash)

    // new counts
    globalCount = await waveportalContract.totalWaves()
    console.log("New global waves: ", globalCount.toString());

    setGlobalWaveCount(globalCount.toString())
  }

  async function showAllWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let waves = await waveportalContract.allWaves()

    let wavesCleaned = []
    waves.forEach(wave => {
      wavesCleaned.push({
        message: wave.message,
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        winner: wave.winner,
        userWaveCount: wave.userWaveCount
      })
    })

    setAllWaves(wavesCleaned)

    waveportalContract.on("NewWave", (message, from, timestamp, winner, userWaveCount) => {
      console.log("NewWave", message, from, timestamp, winner, userWaveCount)
      setAllWaves(oldArray => [...oldArray, {
        message : message,
        address: from,
        timestamp: new Date(timestamp * 1000),
        winner: winner,
        userWaveCount: userWaveCount
      }])
      if (wave.winner){
        let winText = "YES! 🏅"
      } else {
        let winText = "NO 😢"
      }
    })
  }

  async function getTotalWaves() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    // grab initial wave counts - global and local
    let globalCount = await waveportalContract.totalWaves()
    console.log("Original global waves: ", globalCount.toString());
    setGlobalWaveCount(globalCount.toString())
  }

  // this will run our function each time the page loads
  React.useEffect(() => {
    checkIfWalletIsConnected()
    getTotalWaves()
  }, [])

  return (
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
            👋 Hey, friend!
          </div>

          <div className="bio">
            Yo!! I'm Matt. I'm a software engineer that is breaking into the Web3 space. For this project, you can connect your MetaMask wallet to this site on the RINKEBY testnet, and "wave" at me. Leave me a link to Spotify, hit that wave button, and I'll make a dope playlist! There's a chance you'll win some fake Ethereum, too!
          </div>

          <div>
            <textarea onChange={changeHandler} placeholder="What's your jam? 🎶" cols="30" rows="10" />
          </div>

          <button className="waveButton" onClick={wave}>
            👋 Wave
          </button>

          {currAccount ? null : (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          <div className="bio">This contract has processed {globalWaveCount} waves. Here is a list of the world's top wavers. The higher you are, the more rad you become! Wave away, my dudes!</div>
          {allWaves.map((wave, index) => {
            return(
              <div style={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px"}}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toUTCString()}</div>
                <div>Message: {wave.message}</div>
                <div>Winner: {wave.winner.toString()}</div>
                <div>User's Waves: {wave.userWaveCount.toString()}</div>
              </div>
            )
          })}
        </div>
      </div>
  )
}
