export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Méthode ${req.method} non autorisée` });
  }

  // Tu peux loger ce qui arrive côté serveur
  console.log("Requête reçue avec : ", req.body);

  // Juste une réponse temporaire pour tester
  return res.status(200).json({ success: true, message: "API fonctionnelle !" });
}
