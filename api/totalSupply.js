import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x1fF69457C1146B29aAA8B9970019a76F8Af39063';
const ABI = [
  "function totalClaimed() public view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // CORS

  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const totalClaimed = await contract.totalClaimed();
    res.status(200).json({ totalMinted: totalClaimed.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
