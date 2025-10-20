import Card from "../components/layout/Card";

function Conditions() {
  return (
    <Card title="Conditions générales d'utilisation">
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-6">En vigueur au 17/11/2025</p>

        <p className="mb-4">
          Les présentes conditions générales d'utilisation (dites « CGU ») ont
          pour objet l'encadrement juridique des modalités de mise à disposition
          du site et des services par <strong>EsportEvo</strong> et de définir
          les conditions d’accès et d’utilisation des services par «
          l'Utilisateur ».
        </p>

        <p className="mb-4">
          Toute inscription ou utilisation du site implique l'acceptation sans
          réserve des présentes CGU par l’utilisateur. Lors de l'inscription,
          chaque utilisateur accepte expressément les présentes CGU en cochant
          la case suivante : « Je reconnais avoir lu et compris les CGU et je
          les accepte ».
        </p>

        <p className="mb-4">
          En cas de non-acceptation, l'Utilisateur doit renoncer à accéder aux
          services proposés par le site. <strong>EsportEvo</strong> se réserve
          le droit de modifier unilatéralement et à tout moment le contenu des
          présentes CGU.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 1 : Mentions légales
        </h2>
        <p>
          L’édition et la direction de la publication du site{" "}
          <strong>esportevolution.net</strong> est assurée par{" "}
          <strong>Nkunga Jordan</strong>, domicilié 12 rue Gambetta. <br />
          Téléphone : 06 68 31 36 27 <br />
          Email :{" "}
          <a
            href="mailto:jnkunga@hotmail.com"
            className="text-indigo-600 underline"
          >
            jnkunga@hotmail.com
          </a>
        </p>
        <p className="mt-2">
          L’hébergeur du site est la société <strong>OVH</strong>, dont le siège
          social est situé au 2 rue Kellermann, 59100 Roubaix.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 2 : Accès au site
        </h2>
        <p>
          Le site <strong>esportevolution.net</strong> permet un accès gratuit
          aux services de paris e-sportifs en ligne. Tous les frais supportés
          par l’Utilisateur pour accéder au service (matériel, connexion
          Internet, etc.) sont à sa charge.
        </p>
        <p className="mt-2">
          L’Utilisateur non membre n’a pas accès aux services réservés. Pour
          cela, il doit s’inscrire en fournissant des informations exactes et
          sincères.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 3 : Collecte des données
        </h2>
        <p>
          Le site assure à l'Utilisateur une collecte et un traitement des
          données personnelles dans le respect de la loi Informatique et
          Libertés du 6 janvier 1978. L’Utilisateur dispose d’un droit d’accès,
          de rectification et de suppression de ses données via son espace
          personnel.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 4 : Propriété intellectuelle
        </h2>
        <p>
          Les marques, logos, textes, images et sons présents sur le site sont
          protégés par le Code de la propriété intellectuelle. Toute
          reproduction totale ou partielle sans autorisation constitue une
          contrefaçon.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 5 : Responsabilité
        </h2>
        <p>
          Les informations diffusées sur le site sont données à titre indicatif.
          <strong> EsportEvo</strong> ne saurait être tenu responsable des
          erreurs ou omissions, ni des conséquences de leur utilisation.
          L’Utilisateur est responsable de la confidentialité de son mot de
          passe.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 6 : Liens hypertextes
        </h2>
        <p>
          Des liens hypertextes peuvent être présents sur le site. En cliquant
          sur ces liens, l’Utilisateur sort du site et reconnaît que{" "}
          <strong>EsportEvo</strong> n’a aucun contrôle sur le contenu des pages
          externes.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Article 7 : Cookies</h2>
        <p>
          Lors de ses visites, un cookie peut s’installer automatiquement sur le
          navigateur de l’Utilisateur afin d’améliorer son expérience. Certains
          cookies nécessitent le consentement explicite de l’Utilisateur.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 8 : Publication par l’Utilisateur
        </h2>
        <p>
          Le site permet aux membres de publier des contenus (matchs, paris).
          L’Utilisateur s’engage à ne pas publier de contenu illégal ou portant
          atteinte aux droits de tiers. <strong>EsportEvo</strong> se réserve le
          droit de modérer ou supprimer toute publication sans préavis.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">
          Article 9 : Droit applicable
        </h2>
        <p>
          La législation française s’applique au présent contrat. En cas de
          litige, les tribunaux français seront seuls compétents. Pour toute
          question, vous pouvez contacter l’éditeur aux coordonnées de l’Article
          1.
        </p>

        <p className="text-sm text-gray-500 mt-8 text-center">
          CGU générées à partir d’un modèle LegalPlace et adaptées pour
          EsportEvo.
        </p>
      </div>
    </Card>
  );
}

export default Conditions;
