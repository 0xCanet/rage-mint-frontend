// pages/api/sponsoredMint.js
import { ethers } from 'ethers';
import abi from '../abis/RageToken.json';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.SPONSOR_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { address } = req.body;

    if (!address || !ethers.utils.isAddress(address)) {
      return res.status(400).json({ error: 'Adresse invalide ou manquante' });
    }

    if (!PRIVATE_KEY || !RPC_URL || !CONTRACT_ADDRESS) {
      return res.status(500).json({ error: 'Variables d’environnement manquantes (.env)' });
    }

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Si abi est déjà au bon format, pas besoin de .abi
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi || abi, wallet);

    // Si tu veux éviter les double mints :
    const hasClaimed = await contract.hasClaimed(address);
    if (hasClaimed) {
      return res.status(400).json({ error: 'Adresse a déjà minté' });
    }

    const tx = await contract.mint(address);
    const receipt = await tx.wait();

    return res.status(200).json({
      success: true,
      txHash: receipt.transactionHash,
    });

  } catch (error) {
    console.error('❌ Erreur API /api/sponsoredMint:', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
