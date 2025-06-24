import { ethers } from 'ethers';
import abi from '../abis/RageToken.json'; // adapte le chemin si besoin

const handler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { userAddress } = req.body;

  if (!ethers.utils.isAddress(userAddress)) {
    return res.status(400).json({ error: 'Adresse invalide' });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_SPONSOR, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

    const tx = await contract.mint({ gasLimit: 100000 }); // ajuste le gas limit si besoin
    await tx.wait();

    res.status(200).json({ success: true, txHash: tx.hash });
  } catch (err) {
    console.error('Mint sponsorisé failed:', err);
    res.status(500).json({ error: 'Mint sponsorisé échoué' });
  }
};

export default handler;
