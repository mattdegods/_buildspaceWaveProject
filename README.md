# _buildspaceWaveProject
<h1>About</h1><br>
<p>
  This project is the result of a _buildspace course which combines a Solidity smart contract with a React UI. The smart contract is deployed using an Ethereum development environment called HardHat and linked to the web3 page via the Alchemy API.<br>
  I am constantly adding functionality and styling on top of this project to continue to learn and improve my work.<br>
  The functionality is as follows: <br>
  <ol>
    <li>Send a message along with a "wave" and log that transaction on the Rinkeby testnet.</li>
    <li>Users can go to the site, wave, and see a list of all transactions stored on this smart contract. </li>
    <li>There is a built-in random prize of Rinkeby ETH that uses block difficulty as a seed for a more secure "randomness" (RNG not supported in Solidity at this time).</li>
    </ol>
</p>

<p>Some future improvements/DRs:<br>
  <ol>
    <li>Request Spotify links for a blockchain-backed Spotify playlist!</li>
    <li>Create a "top wavers" list that ranks specific addresses by total number of userWaves!</li>
    <li>Improved styling and front-end functionality:
      <ol>
        <li>Dark/Light mode toggle</li>
        <li>Interactive buttons</li>
        <li>"Mining TXN" visual cue to help create a more helpful UX</li>
      </ol>
    </li>
  </ol>
</p>
    
<h1>Important Setup Notes</h1><br>
<p>
  Source Lessons: https://app.buildspace.so/<br>
  Rinkeby ETH Faucet: https://app.mycrypto.com/faucet<br>
  Alchemy API: https://dashboard.alchemyapi.io/<br>
  Terminal cmd to deploy smart contract to Rinkeby:<br>
  <code class="language-bash">npx hardhat run scripts/deploy.js --network rinkeby</code><br>
  Terminal cmd to run smart contract for testing:<br>
  <code class="language-bash">npx hardhat run scripts/run.js</code><br>
</p>
  
  
  
  
