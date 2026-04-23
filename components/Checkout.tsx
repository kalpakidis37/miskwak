
import React, { useState } from 'react';
import { CustomerInfo, DiscountCode } from '../types';
import { PayPalButtons } from "@paypal/react-paypal-js";

interface CheckoutProps {
  onSuccess: (data: CustomerInfo) => void;
  onBack: () => void;
  subtotal: number;
  discountCodes: DiscountCode[];
}

const Checkout: React.FC<CheckoutProps> = ({ onSuccess, onBack, subtotal, discountCodes }) => {
  const [loading, setLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountError, setDiscountError] = useState('');

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'percentage') {
      return (subtotal * appliedDiscount.value) / 100;
    }
    return appliedDiscount.value;
  };

  const discountAmount = calculateDiscount();
  const shipping = (subtotal - discountAmount) < 25 ? 4.90 : 0;
  const total = subtotal - discountAmount + shipping;

  const handleApplyDiscount = () => {
    const code = discountCodes.find(c => c.code === discountCode.toUpperCase() && c.active);
    if (!code) {
      setDiscountError('Ungültiger oder inaktiver Code.');
      setAppliedDiscount(null);
      return;
    }
    if (code.minOrderValue && subtotal < code.minOrderValue) {
      setDiscountError(`Der Mindestbestellwert für diesen Code beträgt ${code.minOrderValue.toFixed(2)} €. Bitte füge weitere Artikel hinzu.`);
      setAppliedDiscount(null);
      return;
    }
    setAppliedDiscount(code);
    setDiscountError('');
  };
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    zip: '',
    city: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={onBack}
        className="flex items-center text-stone-500 hover:text-stone-800 mb-8 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Zurück zum Warenkorb
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold text-stone-800 mb-8">Checkout</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Vorname</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Nachname</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">E-Mail Adresse</label>
                <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Telefon (optional)</label>
                <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Straße & Hausnummer</label>
              <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">PLZ</label>
                <input required name="zip" value={formData.zip} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Stadt</label>
                <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all" />
              </div>
            </div>

            <div className="pt-6">
              <h3 className="font-bold text-stone-800 mb-4">Zahlungsart</h3>
              <div className="p-4 border border-emerald-500 bg-emerald-50/30 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="ml-3 font-medium text-stone-800">Sichere Zahlung</span>
                  <div className="ml-auto flex items-center space-x-3">
                    <span className="text-blue-600 font-bold italic text-sm">PayPal</span>
                    <div className="h-4 w-px bg-stone-300"></div>
                    <span className="text-stone-800 font-bold text-sm">Apple Pay</span>
                    <div className="h-4 w-px bg-stone-300"></div>
                    <span className="text-stone-800 font-bold text-sm">Google Pay</span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-500 leading-relaxed">
                  Wir unterstützen <strong>PayPal, Apple Pay und Google Pay</strong>. Die Abwicklung erfolgt sicher über unseren Partner PayPal. Du kannst deine bevorzugte Methode im nächsten Schritt wählen.
                </p>
              </div>
              <p className="text-[10px] text-stone-400 mt-2 italic text-center">Sicher verschlüsselt & Käuferschutz inklusive.</p>
            </div>

            <div className="pt-4">
              <PayPalButtons 
                style={{ layout: "vertical", shape: "pill" }}
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.zip || !formData.city}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "EUR",
                          value: total.toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  if (actions.order) {
                    await actions.order.capture();
                    onSuccess(formData);
                  }
                }}
              />
              {(!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.zip || !formData.city) && (
                <p className="text-xs text-red-400 mt-2 text-center">Bitte fülle alle Pflichtfelder aus, um mit PayPal zu bezahlen.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-stone-50 p-8 rounded-2xl h-fit border border-stone-200 sticky top-28">
           <h3 className="text-xl font-bold text-stone-800 mb-6">Deine Bestellung</h3>
           <div className="space-y-4">
              <div className="flex justify-between text-stone-600 font-medium">
                  <span>Zwischensumme</span>
                  <span>{subtotal.toFixed(2)} €</span>
              </div>
              
              {appliedDiscount && (
                <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Rabatt ({appliedDiscount.code})</span>
                    <span>-{discountAmount.toFixed(2)} €</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600 font-medium">
                  <span>Versand</span>
                  {shipping > 0 ? (
                    <span>{shipping.toFixed(2)} €</span>
                  ) : (
                    <span className="text-emerald-600">Kostenlos</span>
                  )}
              </div>
              <div className="border-t border-stone-200 pt-4 flex justify-between text-2xl font-bold text-stone-800">
                  <span>Gesamtbetrag</span>
                  <span>{total.toFixed(2)} €</span>
              </div>
           </div>

           <div className="mt-8 pt-8 border-t border-stone-200">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Gutscheincode</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={discountCode} 
                  onChange={e => setDiscountCode(e.target.value)}
                  placeholder="CODE EINGEBEN"
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button 
                  onClick={handleApplyDiscount}
                  className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-stone-700 transition-all"
                >
                  Anwenden
                </button>
              </div>
              {discountError && <p className="text-red-500 text-[10px] mt-1 font-bold">{discountError}</p>}
              {appliedDiscount && <p className="text-emerald-600 text-[10px] mt-1 font-bold">Code "{appliedDiscount.code}" erfolgreich angewendet!</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
