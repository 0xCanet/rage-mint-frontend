import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = [
  // juste la méthode totalSupply, si c’est le seul appel que tu fais
  "function totalSupply() view returns (uint256)"
];

const contract = new ethers.Contract(contractAddress, abi, provider);

export default async function handler(req, res) {
  // ✅ Fix CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const totalMinted = await contract.totalSupply();
    res.status(200).json({ totalMinted: totalMinted.toString() });
  } catch (error) {
    console.error('Erreur totalSupply API :', error);
    res.status(500).json({ error: error.message });
  }
}
