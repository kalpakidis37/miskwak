import React from 'react';

const VersandZahlung: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-stone-900 mb-8 font-serif">Versand & Zahlung</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Versandinformationen</h2>
        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-4">
          <p>
            Wir legen großen Wert auf einen schnellen und sicheren Versand deiner Miswak-Produkte. 
            Alle Bestellungen werden sorgfältig verpackt, um die Frische und Qualität der Naturprodukte zu bewahren.
          </p>
          
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
            <h3 className="font-bold text-stone-800 mb-2">Versandkosten (Deutschland)</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Bestellwert unter 25,00 €: <strong>4,90 €</strong></li>
              <li>Bestellwert ab 25,00 €: <strong>Kostenloser Versand</strong></li>
            </ul>
          </div>

          <h3 className="font-bold text-stone-800 mt-6">Lieferzeiten</h3>
          <p>
            Die Lieferzeit innerhalb Deutschlands beträgt in der Regel <strong>2-4 Werktage</strong> nach Zahlungseingang. 
            Sobald deine Bestellung versandt wurde, erhältst du eine Bestätigung per E-Mail.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Zahlungsmöglichkeiten</h2>
        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed space-y-4">
          <p>
            Für deinen Einkauf bei Miswak Nature bieten wir dir folgende sichere Zahlungsmethoden an:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 border border-stone-200 rounded-xl flex flex-col items-center text-center">
              <span className="text-blue-600 font-bold italic mb-2">PayPal</span>
              <p className="text-xs text-stone-500">Sicher & schnell mit Käuferschutz.</p>
            </div>
            <div className="p-4 border border-stone-200 rounded-xl flex flex-col items-center text-center">
              <span className="text-stone-800 font-bold mb-2">Apple Pay</span>
              <p className="text-xs text-stone-500">Einfach mit deinem Apple-Gerät zahlen.</p>
            </div>
            <div className="p-4 border border-stone-200 rounded-xl flex flex-col items-center text-center">
              <span className="text-stone-800 font-bold mb-2">Google Pay</span>
              <p className="text-xs text-stone-500">Schnell & sicher mit deinem Google-Konto.</p>
            </div>
          </div>

          <p className="mt-6">
            Alle Transaktionen werden verschlüsselt und sicher verarbeitet. Deine Zahlungsdaten werden zu keinem Zeitpunkt auf unseren Servern gespeichert.
          </p>
        </div>
      </section>
    </div>
  );
};

export default VersandZahlung;
