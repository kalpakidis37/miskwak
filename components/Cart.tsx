
import React from 'react';
import { CartItem } from '../types';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard, Minus, Plus } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onContinueShopping, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 25;
  const shipping = subtotal < freeShippingThreshold ? 4.90 : 0;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-stone-50 p-8 rounded-full mb-6 animate-in fade-in zoom-in duration-500">
          <ShoppingBag className="w-16 h-16 text-stone-300" />
        </div>
        <h2 className="text-3xl font-bold text-stone-800 mb-3 font-serif">Dein Warenkorb ist leer</h2>
        <p className="text-stone-500 mb-8 text-center max-w-md">
          Sieht aus, als hättest du noch keine unserer natürlichen Pflegeprodukte entdeckt.
        </p>
        <button 
          onClick={onContinueShopping}
          className="bg-emerald-700 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-700/20 flex items-center gap-2 group"
        >
          Jetzt stöbern
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 mb-8 font-serif">Warenkorb</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Progress */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl mb-6">
            {remainingForFreeShipping > 0 ? (
              <p className="text-emerald-800 text-sm font-medium mb-2">
                Nur noch <span className="font-bold">{remainingForFreeShipping.toFixed(2)} €</span> bis zum kostenlosen Versand!
              </p>
            ) : (
              <p className="text-emerald-800 text-sm font-bold mb-2 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Kostenloser Versand aktiviert!
              </p>
            )}
            <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={`p-6 flex flex-col sm:flex-row gap-6 ${
                  index !== items.length - 1 ? 'border-b border-stone-100' : ''
                }`}
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-stone-50 rounded-xl overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-stone-800 text-lg leading-tight">{item.name}</h3>
                        <p className="text-stone-500 text-sm mt-1">{item.category}</p>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Entfernen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-stone-400 text-xs">Einzelpreis: {item.price.toFixed(2)} €</p>
                  </div>

                  <div className="flex justify-between items-end mt-4 sm:mt-0">
                    {/* Quantity Control */}
                    <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200 p-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-bold text-stone-800 text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right">
                      <span className="font-bold text-stone-900 text-lg">
                        {(item.price * item.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onContinueShopping}
            className="flex items-center text-stone-500 font-medium hover:text-emerald-700 transition-colors group px-2"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            Weiter einkaufen
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm sticky top-32">
            <h3 className="text-xl font-bold text-stone-800 mb-6 font-serif">Zusammenfassung</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-stone-600 text-sm">
                <span>Zwischensumme</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-stone-600 text-sm items-center">
                <span>Versandkosten</span>
                {shipping > 0 ? (
                  <span>{shipping.toFixed(2)} €</span>
                ) : (
                  <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">Kostenlos</span>
                )}
              </div>
              <div className="pt-4 border-t border-stone-100 flex justify-between items-end">
                <span className="font-bold text-stone-800">Gesamtsumme</span>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-stone-900 leading-none">{total.toFixed(2)} €</span>
                  <span className="text-[10px] text-stone-400 font-normal">inkl. MwSt.</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 group mb-6"
            >
              Zur Kasse gehen
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-100">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wide">Sichere Zahlung</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wide">Schneller Versand</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
