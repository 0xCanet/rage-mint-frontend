import { ethers } from "ethers";
import abi from '../../abis/RageToken.json';

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi.abi, wallet);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Adresse requise" });

  try {
    const tx = await contract.claim({ gasLimit: 100000 });
    await tx.wait();
    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
