import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;

const abi = ["function totalSupply() view returns (uint256)"];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const total = await contract.totalSupply();
    res.status(200).json({ totalMinted: total.toString() });
  } catch (err) {
    console.error('Erreur totalSupply:', err);
    res.status(500).json({ error: err.message });
  }
}
