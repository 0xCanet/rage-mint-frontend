import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.SPONSOR_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

// Chargement de l'ABI depuis le système de fichiers
const abiPath = path.resolve(process.cwd(), 'abis', 'RageToken.json');
const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

export default async function handler(req, res) {
  console.log("🔍 method:", req.method);
  console.log("🔍 headers:", req.headers);
  console.log("🔍 body:", req.body);

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
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi || abi, wallet);

    const hasClaimed = await contract.hasClaimed(address);
    if (hasClaimed) {
      return res.status(400).json({ error: 'Adresse a déjà minté' });
    }

    const tx = await contract.claim();
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

export const config = {
  api: {
    bodyParser: true,
  },
};
