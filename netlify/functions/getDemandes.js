const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event, context) => {
  try {
    // 1. Récupération de tes identifiants secrets Netlify
    const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    const serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // 2. Connexion à ton tableur via son ID unique
    const doc = new GoogleSpreadsheet('15oOwsFdtqFvkhoF6iZq3xPXLdHMC1zWsQMiN28nRPWM', serviceAccountAuth);
    await doc.loadInfo();

    // 3. Lecture de l'onglet "Base"
    const sheet = doc.sheetsByTitle['Base'];
    const rows = await sheet.getRows();

    // 4. Filtrage et nettoyage des données
    const demandes = rows
      .filter(row => row.get('Statut') === "1_Recherche volontaire")
      .map(row => ({
        id: row.get('Identifiant'),
        materiel: row.get('Nom du matériel'),
        ambiance: row.get('Ambiance initiatrice de la demande'),
        aire: row.get('Aire(s) du matériel'),
        impact: row.get("Quel(s) impact(s) l'état actuel du matériel a-t-il sur le quotidien de l'ambiance ?")
      }));

    // 5. Envoi au site web public
    return {
      statusCode: 200,
      body: JSON.stringify(demandes)
    };

  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};