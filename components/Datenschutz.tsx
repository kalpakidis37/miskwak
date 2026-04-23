
import React from 'react';

const Datenschutz: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-stone">
      <h1 className="text-4xl font-bold text-stone-900 mb-8 font-serif">Datenschutzerklärung</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">1. Datenschutz auf einen Blick</h2>
        <h3 className="text-lg font-semibold text-stone-700 mb-2">Allgemeine Hinweise</h3>
        <p className="text-stone-600 leading-relaxed">
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">2. Datenerfassung auf dieser Website</h2>
        <h3 className="text-lg font-semibold text-stone-700 mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</h3>
        <p className="text-stone-600 leading-relaxed">
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
        </p>
        <h3 className="text-lg font-semibold text-stone-700 mt-4 mb-2">Wie erfassen wir Ihre Daten?</h3>
        <p className="text-stone-600 leading-relaxed">
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular oder im Rahmen des Bestellprozesses eingeben.
        </p>
        <p className="text-stone-600 leading-relaxed mt-2">
          Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">3. Rechte der betroffenen Person</h2>
        <p className="text-stone-600 leading-relaxed">
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">4. Bestellabwicklung und Zahlungsanbieter</h2>
        <p className="text-stone-600 leading-relaxed">
          Wenn Sie in unserem Shop Waren bestellen, erfassen wir die von Ihnen eingegebenen Adress- und Kontaktdaten ausschließlich zum Zweck der Vertragsabwicklung und des Versands. Eine Weitergabe an Dritte erfolgt nur an die mit der Lieferung beauftragten Versandunternehmen sowie das mit der Zahlungsabwicklung beauftragte Kreditinstitut.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">5. Cookies und Local Storage</h2>
        <p className="text-stone-600 leading-relaxed">
          Diese Website nutzt den Local Storage Ihres Browsers, um Ihren Warenkorb und Ihre Admin-Sitzung lokal zu speichern. Dies dient der Benutzerfreundlichkeit, damit Ihre Auswahl auch beim Neuladen der Seite erhalten bleibt. Diese Daten werden nicht an unsere Server übertragen, sofern sie nicht für eine Bestellung notwendig sind.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">6. SSL- bzw. TLS-Verschlüsselung</h2>
        <p className="text-stone-600 leading-relaxed">
          Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt.
        </p>
      </section>
    </div>
  );
};

export default Datenschutz;
