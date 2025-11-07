import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de confidentialité</h1>
        <p className="text-gray-700 mb-4">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            La présente politique décrit comment nous collectons, utilisons, stockons et protégeons vos données personnelles lors de votre
            utilisation du site Sosso Khoui. Nous nous engageons à respecter votre vie privée et à traiter vos données de manière
            transparente et sécurisée.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">1. Données collectées</h2>
          <ul className="list-disc ml-6">
            <li>Informations de compte : nom, adresse e-mail, mot de passe (haché), pays.</li>
            <li>Données techniques : adresses IP, logs serveurs, cookies nécessaires au fonctionnement.</li>
            <li>Préférences : langue, paramétrages, options facultatives de cookies si autorisées.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">2. Finalités du traitement</h2>
          <ul className="list-disc ml-6">
            <li>Fournir les fonctionnalités essentielles du site (authentification, progression, sécurité).</li>
            <li>Améliorer l’expérience utilisateur (langue, interface) et garantir la qualité du service.</li>
            <li>Respecter nos obligations légales et lutter contre la fraude et les abus.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">3. Cookies</h2>
          <p>
            Nous utilisons des cookies indispensables (nécessaires) pour assurer le bon fonctionnement du site, notamment pour
            l’authentification et la sécurité. Vous pouvez accepter tous les cookies, les refuser ou personnaliser vos préférences à
            l’aide de notre bannière de consentement. Les catégories facultatives (préférences, statistiques, marketing) ne sont
            activées que si vous y consentez.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">4. Base légale</h2>
          <p>
            Nous traitons vos données sur la base de l’exécution du contrat (fourniture du service), de notre intérêt légitime
            (sécurité, amélioration) et de votre consentement (pour les cookies non essentiels).
          </p>

          <h2 className="text-xl font-semibold text-gray-900">5. Partage des données</h2>
          <p>
            Vos données ne sont pas vendues. Elles peuvent être partagées de manière limitée avec des prestataires techniques
            strictement nécessaires au fonctionnement et à la sécurité du site, dans le respect des exigences de confidentialité.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">6. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité adaptées (chiffrement en transit, hachage des mots de passe, contrôles d’accès,
            surveillance) pour protéger vos données contre l’accès non autorisé, la perte ou l’altération.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">7. Durées de conservation</h2>
          <p>
            Les données sont conservées pendant la durée nécessaire à la fourniture du service et conformément aux obligations légales.
            Vous pouvez supprimer votre compte pour demander la suppression de vos données personnelles (hors obligations légales).
          </p>

          <h2 className="text-xl font-semibold text-gray-900">8. Vos droits</h2>
          <ul className="list-disc ml-6">
            <li>Droit d’accès, de rectification et d’effacement.</li>
            <li>Droit à la limitation et à l’opposition.</li>
            <li>Droit de retirer votre consentement pour les cookies facultatifs à tout moment.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">9. Contact</h2>
          <p>
            Pour exercer vos droits ou poser des questions, contactez-nous via la page « Nous Contacter » ou l’adresse officielle
            figurant sur le site.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;