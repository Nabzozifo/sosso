import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Conditions d’utilisation</h1>
        <p className="text-gray-700 mb-4">
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900">1. Objet</h2>
          <p>
            Les présentes conditions régissent l’utilisation du site Sosso Khoui et de ses fonctionnalités. En accédant au site,
            vous acceptez sans réserve ces conditions.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">2. Accès et compte</h2>
          <ul className="list-disc ml-6">
            <li>Vous pouvez utiliser le site sans compte. La création de compte permet la sauvegarde de votre progression et de vos badges.</li>
            <li>Vous êtes responsable de la confidentialité de vos identifiants et de l’activité associée à votre compte.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">3. Utilisation prévue</h2>
          <ul className="list-disc ml-6">
            <li>Utilisation personnelle et non commerciale, dans le respect des lois en vigueur.</li>
            <li>Interdiction de perturber le service, de contourner les mesures de sécurité ou de nuire aux autres utilisateurs.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">4. Contenu et propriété</h2>
          <ul className="list-disc ml-6">
            <li>Le contenu, les visuels et les fonctionnalités du site sont protégés. Toute reproduction non autorisée est interdite.</li>
            <li>Vous conservez vos droits sur vos contributions, mais accordez au site une licence d’usage limitée aux besoins du service.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">5. Confidentialité et cookies</h2>
          <p>
            L’utilisation de vos données personnelles et des cookies est détaillée dans notre Politique de confidentialité.
            Les cookies non essentiels ne sont activés qu’avec votre consentement.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">6. Disponibilité et évolution du service</h2>
          <p>
            Nous nous efforçons d’assurer la disponibilité du site, mais ne garantissons pas l’absence d’interruptions. Le service
            peut évoluer et être mis à jour régulièrement.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">7. Responsabilité</h2>
          <p>
            Le site est proposé « en l’état ». Dans la mesure permise par la loi, nous déclinons toute responsabilité pour les
            dommages indirects ou consécutifs liés à l’utilisation du site.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">8. Résiliation</h2>
          <p>
            Nous pouvons suspendre ou résilier l’accès en cas de non-respect des présentes conditions. Vous pouvez supprimer
            votre compte à tout moment.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">9. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par le droit applicable dans la juridiction indiquée sur le site. En cas de litige,
            les tribunaux compétents de cette juridiction seront saisis.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">10. Contact</h2>
          <p>
            Pour toute question sur ces conditions, merci de nous contacter via la page « Nous Contacter ».
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;