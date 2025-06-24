// pages/api/sponsoredMint.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Adresse manquante' });
  }

  try {
    // Exemple de traitement côté serveur — à adapter selon ta logique :
    // Ici tu peux appeler ethers.js ou un service backend qui effectue le mint.
    console.log(`Demande de mint sponsorisé pour : ${address}`);

    // Simule une réponse de succès
    return res.status(200).json({ success: true, message: 'Mint sponsorisé OK' });
  } catch (err) {
    console.error('Erreur lors du mint sponsorisé :', err);
    return res.status(500).json({ error: 'Erreur interne serveur' });
  }
}
