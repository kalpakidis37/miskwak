
import React from 'react';

const Impressum: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-stone">
      <h1 className="text-4xl font-bold text-stone-900 mb-8 font-serif">Impressum</h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Angaben gemäß § 5 TMG</h2>
        <p className="text-stone-600 leading-relaxed">
          Miswak Nature <br />
          Göthestraße 9<br />
          89518 Heidenheim an der Brenz<br />
          Deutschland
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Kontakt</h2>
        <p className="text-stone-600 leading-relaxed">
          Telefon: +49 (0) 123 456789<br />
          E-Mail: info@miswak-nature.de
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Vertreten durch</h2>
        <p className="text-stone-600 leading-relaxed">
          Geschäftsführer: Lazaros Kalpakidis
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Registereintrag</h2>
        <p className="text-stone-600 leading-relaxed">
          Eintragung im Handelsregister.<br />
          Registergericht: Amtsgericht Ulm<br />
          Registernummer: HRB 
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Umsatzsteuer-ID</h2>
        <p className="text-stone-600 leading-relaxed">
          Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
          DE 123 456 789
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
        <p className="text-stone-600 leading-relaxed">
          Lazaros Kalpakidis<br />
          Göthestraße 9<br />
          89518 Heidenheim an der Brenz
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Streitschlichtung</h2>
        <p className="text-stone-600 leading-relaxed">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
          <a href="https://ec.europa.eu/consumers/odr" className="text-emerald-700 hover:underline ml-1">https://ec.europa.eu/consumers/odr</a>.<br />
          Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>
    </div>
  );
};

export default Impressum;
