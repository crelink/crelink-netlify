const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // On n'accepte que les envois de données (POST)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    // 1. Récupération des infos envoyées par ton site web
    const { email_destinataire, prenom } = JSON.parse(event.body);

    // 2. Connexion sécurisée au serveur mail via tes variables Netlify
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // Vrai si port 465 (SSL)
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 3. Préparation du message (Texte adapté de ton ancienne version)
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email_destinataire,
      subject: 'Accès validé - Espace CRELINK',
      text: `Bonjour ${prenom},\n\nBonne nouvelle ! Votre demande d'accès à l'espace CRELINK de l'école Montessori de Rennes a été validée par l'équipe.\n\nVous pouvez désormais vous connecter sur votre portail personnel.\n\nAu nom des enfants et de l'équipe pédagogique, un immense merci d'avoir rejoint 🪢CRELINK !\n\nÀ très bientôt,\nL'équipe CRELINK - CRELAM`
    };

    // 4. Déclenchement de l'envoi
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "E-mail de bienvenue envoyé avec succès !" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};