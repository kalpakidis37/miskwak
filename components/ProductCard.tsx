
import React, { useState } from 'react';
import { Product, Review } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'verified'>) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, reviews, onAddReview }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', customerName: '', customerEmail: '' });
  
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const discountPercentage = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${isOutOfStock ? 'opacity-75' : ''}`}>
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image || 'https://picsum.photos/seed/placeholder/600/600'} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <span className="bg-white/90 backdrop-blur-sm text-stone-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                {product.category}
            </span>
            {discountPercentage > 0 && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                -{discountPercentage}%
              </span>
            )}
            {isOutOfStock ? (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider">
                Ausverkauft
              </span>
            ) : product.stock !== undefined && product.stock < 5 && (
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider">
                Nur noch {product.stock} verfügbar
              </span>
            )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-stone-800 mb-2">{product.name}</h3>
        <p className="text-stone-500 text-sm mb-4 line-clamp-2 h-10">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-800">{(product.price || 0).toFixed(2)} €</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through decoration-stone-400 decoration-1">{product.originalPrice.toFixed(2)} €</span>
              )}
            </div>
            {reviews.length > 0 && (
              <button 
                onClick={() => setShowReviews(!showReviews)}
                className="text-[10px] text-stone-400 hover:text-emerald-700 flex items-center mt-1 font-bold uppercase tracking-wider"
              >
                <div className="flex text-yellow-400 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.round(avgRating) ? '★' : '☆'}</span>
                  ))}
                </div>
                ({reviews.length})
              </button>
            )}
            {reviews.length === 0 && (
              <button 
                onClick={() => {setShowReviews(true); setIsReviewing(true);}}
                className="text-[10px] text-stone-400 hover:text-emerald-700 mt-1 font-bold uppercase tracking-wider"
              >
                Erste Bewertung schreiben
              </button>
            )}
          </div>
          <button 
            onClick={() => !isOutOfStock && onAddToCart(product)}
            disabled={isOutOfStock}
            className={`${isOutOfStock ? 'bg-stone-300 cursor-not-allowed' : 'bg-emerald-700 hover:bg-emerald-800'} text-white p-3 rounded-xl transition-colors shadow-lg shadow-emerald-700/20`}
            aria-label={isOutOfStock ? "Ausverkauft" : "In den Warenkorb"}
          >
            {isOutOfStock ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      {showReviews && (
        <div className="p-6 bg-stone-50 border-t border-stone-100 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Bewertungen</h4>
            <button 
              onClick={() => setIsReviewing(!isReviewing)}
              className="text-[10px] bg-white border border-stone-200 px-2 py-1 rounded-lg font-bold text-stone-600 hover:bg-stone-100"
            >
              {isReviewing ? 'Abbrechen' : 'Bewerten'}
            </button>
          </div>

          {isReviewing ? (
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddReview({ ...newReview, productId: product.id });
              setIsReviewing(false);
              setNewReview({ rating: 5, comment: '', customerName: '', customerEmail: '' });
            }} className="space-y-3">
              <div className="flex gap-1 text-xl text-yellow-400">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setNewReview({...newReview, rating: star})}
                    className={star <= newReview.rating ? 'opacity-100' : 'opacity-30'}
                  >
                    ★
                  </button>
                ))}
              </div>
              <input 
                required 
                placeholder="Dein Name" 
                value={newReview.customerName}
                onChange={e => setNewReview({...newReview, customerName: e.target.value})}
                className="w-full px-3 py-1.5 text-xs border rounded-lg outline-none focus:ring-1 focus:ring-emerald-500" 
              />
              <input 
                required 
                type="email" 
                placeholder="Deine E-Mail (nur für Verifizierung)" 
                value={newReview.customerEmail}
                onChange={e => setNewReview({...newReview, customerEmail: e.target.value})}
                className="w-full px-3 py-1.5 text-xs border rounded-lg outline-none focus:ring-1 focus:ring-emerald-500" 
              />
              <textarea 
                required 
                placeholder="Deine Meinung..." 
                rows={3}
                value={newReview.comment}
                onChange={e => setNewReview({...newReview, comment: e.target.value})}
                className="w-full px-3 py-1.5 text-xs border rounded-lg outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              ></textarea>
              <button type="submit" className="w-full py-2 bg-stone-800 text-white text-xs font-bold rounded-lg hover:bg-stone-700">
                Bewertung abschicken
              </button>
              <p className="text-[9px] text-stone-400 italic">Hinweis: Nur verifizierte Käufer können Bewertungen abgeben.</p>
            </form>
          ) : (
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-stone-200 pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-stone-800">{review.customerName}</span>
                    <div className="flex text-[10px] text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-[9px] text-stone-400">{new Date(review.date).toLocaleDateString('de-DE')}</span>
                    {review.verified && (
                      <span className="ml-2 text-[9px] text-emerald-600 font-bold flex items-center">
                        <svg className="w-2 h-2 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Verifizierter Kauf
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-xs text-stone-400 text-center py-4">Noch keine Bewertungen.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
