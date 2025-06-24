import { ethers } from 'ethers';
import abi from '../../abis/RageToken.json';

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

    if (!PRIVATE_KEY || !RPC_URL) {
      return res.status(500).json({ error: 'Clé privée ou RPC manquant dans .env' });
    }

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, wallet);

    const tx = await contract.mint(address);
    const receipt = await tx.wait();

    return res.status(200).json({
      success: true,
      txHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error('Erreur pendant le mint sponsorisé :', error);
    return res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
}
