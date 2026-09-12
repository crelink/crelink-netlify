exports.handler = async (event, context) => {
  // Sécurité : on n'accepte que l'envoi de données (POST)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    // 1. On récupère le mot de passe tapé par l'utilisateur sur le site
    const { password } = JSON.parse(event.body);
    
    // 2. On récupère ton mot de passe secret sur Netlify
    // (Avec la même sécurité de repli "admin123" que ton ancien fichier main.py)
    const realPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // 3. On compare les deux de manière invisible
    if (password === realPassword) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Accès autorisé' })
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: 'Mot de passe incorrect.' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};