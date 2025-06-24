// 📁 /rage-mint-frontend/src/App.jsx
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = "0x1fF69457C1146B29aAA8B9970019a76F8Af39063";
const TOKEN_SYMBOL = "$RAGE"; // ce symbole doit matcher exactement celui déclaré dans le smart contract
const TOKEN_DECIMALS = 18;
const TOKEN_IMAGE = "https://i.imgur.com/8JeHxRS.png"; // mettre ici l'URL de ton logo hébergé

const ABI = [
  "function claim() public",
  "function balanceOf(address) public view returns (uint256)",
  "function hasClaimed(address) view returns (bool)",
  "function totalSupply() view returns (uint256)"
];

export default function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [address, setAddress] = useState();
  const [contract, setContract] = useState();
  const [balance, setBalance] = useState();
  const [hasClaimed, setHasMinted] = useState(false);
  const [totalSupply, setTotalSupply] = useState("0");
  const [txPending, setTxPending] = useState(false);

  async function connect() {
    if (!window.ethereum) return alert("Installe MetaMask !");
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _signer = _provider.getSigner();
    const _address = await _signer.getAddress();

    const _contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, _signer);
    const _balance = await _contract.balanceOf(_address);
    const _minted = await _contract.hasClaimed(_address);
    const _supply = await _contract.totalSupply();

    setProvider(_provider);
    setSigner(_signer);
    setAddress(_address);
    setContract(_contract);
    setBalance(_balance);
    setHasMinted(_minted);
    setTotalSupply(_supply);
  }

  async function handleMint() {
    if (!contract) return;
    setTxPending(true);
    try {
      const tx = await contract.claim();
      await tx.wait();
      const _balance = await contract.balanceOf(address);
      const _supply = await contract.totalSupply();
      setBalance(_balance);
      setTotalSupply(_supply);
      setHasMinted(true);
    } catch (e) {
      console.error(e);
      alert("Erreur pendant le mint (probablement déjà minté)");
    }
    setTxPending(false);
  }

  async function addTokenToWallet() {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACT_ADDRESS,
            symbol: TOKEN_SYMBOL,
            decimals: TOKEN_DECIMALS,
            image: TOKEN_IMAGE
          }
        }
      });
    } catch (error) {
      console.error('Erreur ajout token :', error);
    }
  }

  return (
    <div id="root">
      <div className="card">
        <h1 className="logo">🔥 <span className="title">$RAGE</span></h1>
        <p className="subtitle">Un seul mint. Aucune pitié. Une rage infinie. 💢</p>
        <p className="total">Total minted: {totalSupply ? ethers.utils.formatEther(totalSupply) : '...'} $RAGE</p>

        {!address ? (
          <button onClick={connect} className="button">Connect Wallet</button>
        ) : (
          <>
            <p className="info">Adresse : {address.slice(0, 6)}...{address.slice(-4)}</p>
            <p className="info">Balance : {balance ? ethers.utils.formatEther(balance) : '...'} $RAGE</p>
            {hasClaimed ? (
              <p className="success">Tu as déjà minté ton $RAGE 💥</p>
            ) : (
              <button onClick={handleMint} disabled={txPending} className="button">
                {txPending ? "Minting..." : "Mint $RAGE"}
              </button>
            )}
            <button onClick={addTokenToWallet} className="button" style={{ marginTop: '1rem' }}>
              Ajouter $RAGE à MetaMask
            </button>
          </>
        )}
        <p className="footer">Built for the Raging few. ☠️</p>
      </div>
    </div>
  );
}
