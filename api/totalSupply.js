import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://sepolia.base.org'); // change si testnet

const CONTRACT_ADDRESS = '0x1fF69457C1146B29aAA8B9970019a76F8Af39063';
const ABI = [
  "function totalSupply() view returns (uint256)"
];

export default async function handler(req, res) {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const totalMinted = await contract.totalSupply();
    res.status(200).json({ totalMinted: totalMinted.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne" });
  }
}
