import { ethers } from 'ethers';
import abi from '../../abis/RageToken.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }

  const { address } = req.body;

  if (!ethers.utils.isAddress(address)) {
    return res.status(400).json({ error: "Adresse invalide" });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.providers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.providers.Contract(process.env.CONTRACT_ADDRESS, abi.abi, wallet);

    const tx = await contract.mint(address); // ou `sponsoredMint(address)` si tu as renommé
    const receipt = await tx.wait();

    return res.status(200).json({ success: true, txHash: receipt.transactionHash });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur lors du mint sponsorisé" });
  }
}
