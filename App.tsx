
import React, { useState, useEffect } from 'react';
import { Product, CartItem, View, Order, OrderStatus, CustomerInfo, CustomPage, ShopSettings, User, Customer, DiscountCode, NewsletterSubscriber, EmailSettings, Review } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';
import VersandZahlung from './components/VersandZahlung';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { get, set } from 'idb-keyval';

const App: React.FC = () => {
  const [view, setView] = useState<View>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Shop Settings & Pages
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({ logoText: 'Miswak', logoSubText: 'Nature' });
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: '',
    senderEmail: '',
    senderName: 'Miswak Nature'
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const isInitialLoad = React.useRef(true);

  // Change detection to prevent redundant saves and overwriting with defaults
  const lastSavedData = React.useRef<Record<string, string>>({});

  // Apply Design Settings
  useEffect(() => {
    if (settings.primaryColor) {
      document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
    }
    if (settings.secondaryColor) {
      document.documentElement.style.setProperty('--color-secondary', settings.secondaryColor);
    }
    if (settings.backgroundColor) {
      document.documentElement.style.setProperty('--color-background', settings.backgroundColor);
    }
    if (settings.fontFamily) {
      const fonts = {
        sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
        serif: '"Playfair Display", ui-serif, Georgia, serif',
        mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace'
      };
      document.documentElement.style.setProperty('--font-family-base', fonts[settings.fontFamily as keyof typeof fonts] || fonts.sans);
    }
    if (settings.borderRadius) {
      const radii = {
        none: '0px',
        small: '4px',
        medium: '8px',
        large: '16px',
        xl: '24px',
        full: '9999px'
      };
      document.documentElement.style.setProperty('--border-radius-base', radii[settings.borderRadius as keyof typeof radii] || radii.xl);
    }
    if (settings.buttonStyle) {
      document.documentElement.setAttribute('data-button-style', settings.buttonStyle);
    }
  }, [settings]);

  // Initial Data Fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        const resources = [
          'users', 'settings', 'pages', 'products', 'orders', 
          'customers', 'discountCodes', 'subscribers', 'emailSettings', 'reviews'
        ];
        
        const results = await Promise.all(
          resources.map(async name => {
            try {
              // 1. Try to fetch from server
              const res = await fetch(`/api/data/${name}`);
              if (res.status === 404) {
                // 2. If server has no data (new/reset), try local storage
                const localData = await get(`miswak_${name}`);
                if (localData) {
                  // Sync local data back to server immediately
                  await fetch(`/api/data/${name}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(localData)
                  });
                  return localData;
                }
                return { __isNew: true };
              }
              const serverData = await res.json();
              // Update local storage with fresh server data
              await set(`miswak_${name}`, serverData);
              return serverData;
            } catch (err) {
              console.error(`Failed to fetch ${name}`, err);
              // Fallback to local storage on network error
              const localData = await get(`miswak_${name}`);
              if (localData) return localData;
              return { __isError: true };
            }
          })
        );

        const [u, s, p, pr, o, c, d, sub, es, rev] = results;

        // Initialize defaults ONLY if the resource is new (__isNew)
        let finalUsers = u.__isNew ? [
          { id: 'u1', username: 'admin', password: 'admin', role: 'admin', name: 'Administrator' },
          { id: 'u2', username: 'lazos', password: 'admin', role: 'admin', name: 'Lazos' },
          { id: 'u3', username: 'Lena', password: 'admin', role: 'mitarbeiter', name: 'Lena' }
        ] : (u.__isError ? [] : u);
        
        let finalSettings = s.__isNew ? { logoText: 'Miswak', logoSubText: 'Nature' } : (s.__isError ? { logoText: 'Miswak', logoSubText: 'Nature' } : s);
        if (!s.__isNew && !s.__isError && (!s.logoText && !s.logoImage)) {
          finalSettings = { ...s, logoText: s.logoText || 'Miswak', logoSubText: s.logoSubText || 'Nature' };
        }
        
        const initialPages: CustomPage[] = [
          { id: 'p1', title: 'Impressum', slug: 'impressum', content: '', inMenu: false, inFooter: true },
          { id: 'p2', title: 'Datenschutz', slug: 'datenschutz', content: '', inMenu: false, inFooter: true },
          { id: 'p3', title: 'Versand & Zahlung', slug: 'versand-zahlung', content: '', inMenu: false, inFooter: true },
          { id: 'p4', title: 'Angebote', slug: 'angebote', content: 'Entdecke unsere aktuellen Angebote und Spar-Sets.', inMenu: true, inFooter: true },
          { id: 'p6', title: 'Anwendung', slug: 'anwendung', content: 'So benutzt du deinen Miswak richtig: 1. Rinde ca. 1cm abkauen. 2. Borsten weich kauen. 3. Zähne sanft bürsten.', inMenu: true, inFooter: true }
        ];
        let finalPages = p.__isNew ? initialPages : (p.__isError ? [] : p);
        
        if (!p.__isError) {
          const mergedPages = [...finalPages];
          initialPages.forEach(initial => {
            const exists = mergedPages.find(pg => pg.slug === initial.slug || pg.id === initial.id);
            if (!exists) mergedPages.push(initial);
          });

          const uniquePages: CustomPage[] = [];
          const seenIds = new Set();
          const seenSlugs = new Set();
          for (const pg of mergedPages) {
            if (!seenIds.has(pg.id) && !seenSlugs.has(pg.slug)) {
              uniquePages.push(pg);
              seenIds.add(pg.id);
              seenSlugs.add(pg.slug);
            }
          }

          finalPages = uniquePages.map(pg => ({
            ...pg,
            inMenu: pg.inMenu ?? false,
            inFooter: pg.inFooter ?? (['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].includes(pg.id) || pg.slug === 'impressum' || pg.slug === 'datenschutz' || pg.slug === 'versand-zahlung' || pg.slug === 'angebote' || pg.slug === 'anwendung')
          }));
        }

        let finalProducts = pr.__isNew ? INITIAL_PRODUCTS : (pr.__isError ? [] : pr);

        // Set state
        setUsers(finalUsers);
        setSettings(finalSettings);
        setPages(finalPages);
        setProducts(finalProducts);
        setOrders(o.__isNew || o.__isError ? [] : o);
        setCustomers(c.__isNew || c.__isError ? [] : c);
        setDiscountCodes(d.__isNew || d.__isError ? [] : d);
        setSubscribers(sub.__isNew || sub.__isError ? [] : sub);
        if (!es.__isNew && !es.__isError && Object.keys(es).length > 0) setEmailSettings(es);
        setReviews(rev.__isNew || rev.__isError ? [] : rev);
        
        // Populate change detection ref with loaded data
        lastSavedData.current = {
          users: JSON.stringify(finalUsers),
          settings: JSON.stringify(finalSettings),
          pages: JSON.stringify(finalPages),
          products: JSON.stringify(finalProducts),
          orders: JSON.stringify(o.__isNew || o.__isError ? [] : o),
          customers: JSON.stringify(c.__isNew || c.__isError ? [] : c),
          discountCodes: JSON.stringify(d.__isNew || d.__isError ? [] : d),
          subscribers: JSON.stringify(sub.__isNew || sub.__isError ? [] : sub),
          emailSettings: JSON.stringify(es.__isNew || es.__isError ? {} : es),
          reviews: JSON.stringify(rev.__isNew || rev.__isError ? [] : rev)
        };
        
        setHasLoaded(true);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Persistence to Server
  const saveData = async (name: string, data: any, force = false) => {
    if (!hasLoaded) return;
    
    const dataString = JSON.stringify(data);
    if (!force && lastSavedData.current[name] === dataString) {
      return; // No change, skip save
    }

    lastSavedData.current[name] = dataString;

    // Save locally first (robustness)
    set(`miswak_${name}`, data).catch(err => console.error('Local save failed', err));

    try {
      const response = await fetch(`/api/data/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataString
      });
      if (!response.ok) throw new Error(`Save failed with status ${response.status}`);
    } catch (error) {
      console.error(`Failed to save ${name}`, error);
    }
  };

  const handleSaveAll = async () => {
    if (!hasLoaded) return;
    setIsLoading(true);
    try {
      await Promise.all([
        saveData('orders', orders, true),
        saveData('products', products, true),
        saveData('settings', settings, true),
        saveData('pages', pages, true),
        saveData('users', users, true),
        saveData('customers', customers, true),
        saveData('discountCodes', discountCodes, true),
        saveData('subscribers', subscribers, true),
        saveData('emailSettings', emailSettings, true),
        saveData('reviews', reviews, true)
      ]);
      alert('Alle Daten wurden erfolgreich auf dem Server gespeichert.');
    } catch (error) {
      alert('Fehler beim Speichern der Daten: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  // Explicit handlers that also trigger saves
  const updateProducts = (newProducts: Product[] | ((prev: Product[]) => Product[])) => {
    setProducts(prev => {
      const next = typeof newProducts === 'function' ? newProducts(prev) : newProducts;
      saveData('products', next);
      return next;
    });
  };

  const updateSettings = (newSettings: ShopSettings | ((prev: ShopSettings) => ShopSettings)) => {
    setSettings(prev => {
      const next = typeof newSettings === 'function' ? newSettings(prev) : newSettings;
      saveData('settings', next);
      return next;
    });
  };

  const updatePages = (newPages: CustomPage[] | ((prev: CustomPage[]) => CustomPage[])) => {
    setPages(prev => {
      const next = typeof newPages === 'function' ? newPages(prev) : newPages;
      saveData('pages', next);
      return next;
    });
  };

  const updateOrders = (newOrders: Order[] | ((prev: Order[]) => Order[])) => {
    setOrders(prev => {
      const next = typeof newOrders === 'function' ? newOrders(prev) : newOrders;
      saveData('orders', next);
      return next;
    });
  };

  const updateCustomers = (newCustomers: Customer[] | ((prev: Customer[]) => Customer[])) => {
    setCustomers(prev => {
      const next = typeof newCustomers === 'function' ? newCustomers(prev) : newCustomers;
      saveData('customers', next);
      return next;
    });
  };

  const updateDiscountCodes = (newCodes: DiscountCode[] | ((prev: DiscountCode[]) => DiscountCode[])) => {
    setDiscountCodes(prev => {
      const next = typeof newCodes === 'function' ? newCodes(prev) : newCodes;
      saveData('discountCodes', next);
      return next;
    });
  };

  const updateSubscribers = (newSubscribers: NewsletterSubscriber[] | ((prev: NewsletterSubscriber[]) => NewsletterSubscriber[])) => {
    setSubscribers(prev => {
      const next = typeof newSubscribers === 'function' ? newSubscribers(prev) : newSubscribers;
      saveData('subscribers', next);
      return next;
    });
  };

  const updateEmailSettings = (newEmailSettings: EmailSettings | ((prev: EmailSettings) => EmailSettings)) => {
    setEmailSettings(prev => {
      const next = typeof newEmailSettings === 'function' ? newEmailSettings(prev) : newEmailSettings;
      saveData('emailSettings', next);
      return next;
    });
  };

  const updateReviews = (newReviews: Review[] | ((prev: Review[]) => Review[])) => {
    setReviews(prev => {
      const next = typeof newReviews === 'function' ? newReviews(prev) : newReviews;
      saveData('reviews', next);
      return next;
    });
  };

  const updateUsers = (newUsers: User[] | ((prev: User[]) => User[])) => {
    setUsers(prev => {
      const next = typeof newUsers === 'function' ? newUsers(prev) : newUsers;
      saveData('users', next);
      return next;
    });
  };

  const categories = ['Alle', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || p.category === selectedCategory;
    const isVisible = p.isVisible !== false;
    return matchesSearch && matchesCategory && isVisible;
  });

  const handleAddReview = (review: Omit<Review, 'id' | 'date' | 'verified'>) => {
    // Check if buyer has actually purchased this product
    const hasPurchased = orders.some(o => 
      o.customer.email.toLowerCase() === review.customerEmail.toLowerCase() && 
      o.items.some(item => item.id === review.productId)
    );

    if (!hasPurchased) {
      alert('Nur verifizierte Käufer können eine Bewertung abgeben.');
      return;
    }

    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      verified: true
    };
    updateReviews([...reviews, newReview]);
    alert('Vielen Dank für deine Bewertung!');
  };
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handlePlaceOrder = (customer: CustomerInfo) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal < 25 ? 4.90 : 0;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      customer,
      items: [...cart],
      total: subtotal + shipping,
      status: 'offen'
    };

    // Update customers list
    updateCustomers(prev => {
      const existing = prev.find(c => c.email.toLowerCase() === customer.email.toLowerCase());
      if (existing) {
        return prev.map(c => c.email.toLowerCase() === customer.email.toLowerCase() ? { ...c, ...customer } : c);
      }
      return [...prev, { ...customer, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }];
    });

    updateOrders(prev => [...prev, newOrder]);
    
    // Reduce stock
    updateProducts(prev => prev.map(p => {
      const orderedItem = cart.find(item => item.id === p.id);
      if (orderedItem) {
        return { ...p, stock: Math.max(0, (p.stock || 0) - orderedItem.quantity) };
      }
      return p;
    }));

    setCart([]);
    setView('success');
  };

  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setLoginError('');
      setView('admin');
    } else {
      setLoginError('Falscher Benutzername oder Passwort.');
    }
  };

  // Dynamic Content Rendering
  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
        </div>
      );
    }

    if (view === 'shop') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">{settings.shopTitle || 'Unsere Produkte'}</h2>
              <p className="text-stone-500 mt-2">{settings.shopSubtitle || 'Natur pur für deine Zahnpflege.'}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Suchen..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 w-full"
                />
                <svg className="absolute left-3 top-2.5 text-stone-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                reviews={reviews.filter(r => r.productId === product.id)}
                onAddReview={handleAddReview}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone-400 text-lg">Keine Produkte gefunden.</p>
              <button onClick={() => {setSearchQuery(''); setSelectedCategory('Alle');}} className="mt-4 text-emerald-700 font-bold hover:underline">Alle Produkte anzeigen</button>
            </div>
          )}
        </div>
      );
    }
    
    if (view === 'cart') return <Cart items={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity+d)} : i))} onRemove={id => setCart(prev => prev.filter(i => i.id !== id))} onContinueShopping={() => setView('shop')} onCheckout={() => setView('checkout')} />;
    if (view === 'checkout') return <Checkout subtotal={cart.reduce((s,i) => s + i.price*i.quantity, 0)} discountCodes={discountCodes} onBack={() => setView('cart')} onSuccess={handlePlaceOrder} />;
    if (view === 'admin-login') return <AdminLogin onLogin={handleLogin} error={loginError} />;
    if (view === 'admin' && isLoggedIn) return (
      <AdminDashboard 
        orders={orders} 
        onUpdateStatus={(id, s) => updateOrders(prev => prev.map(o => o.id === id ? {...o, status: s} : o))} 
        products={products} 
        onUpdateProduct={p => updateProducts(prev => prev.map(x => x.id === p.id ? p : x))} 
        onAddProduct={p => updateProducts(prev => [...prev, p])} 
        onDeleteProduct={id => updateProducts(prev => prev.filter(p => p.id !== id))} 
        onReorderProducts={updateProducts} 
        settings={settings} 
        onUpdateSettings={updateSettings} 
        pages={pages} 
        onUpdatePages={updatePages} 
        users={users} 
        onUpdateUsers={updateUsers} 
        currentUser={currentUser!} 
        customers={customers}
        onUpdateCustomers={updateCustomers}
        discountCodes={discountCodes}
        onUpdateDiscountCodes={updateDiscountCodes}
        subscribers={subscribers}
        onUpdateSubscribers={updateSubscribers}
        emailSettings={emailSettings}
        onUpdateEmailSettings={updateEmailSettings}
        reviews={reviews}
        onUpdateReviews={updateReviews}
        onLogout={() => {setIsLoggedIn(false); setCurrentUser(null); setView('shop');}}
        onSaveAll={handleSaveAll}
        onReload={() => window.location.reload()}
        onResetProducts={() => updateProducts(INITIAL_PRODUCTS)}
      />
    );
    
    // Custom Pages
    const customPage = pages.find(p => p.slug === view);
    if (customPage) {
      if (view === 'impressum') return <Impressum />;
      if (view === 'datenschutz') return <Datenschutz />;
      if (view === 'versand-zahlung') return <VersandZahlung />;
      const pageProducts = products.filter(p => customPage.productIds?.includes(p.id));

      return (
        <div className="max-w-7xl mx-auto px-4 pt-48 pb-16">
          <div className="max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-stone-900 mb-8 font-serif">{customPage.title}</h1>
            <div className="prose prose-stone max-w-none whitespace-pre-wrap text-stone-600 leading-relaxed">
              {customPage.content || (!pageProducts.length && "Diese Seite hat noch keinen Inhalt.")}
            </div>
          </div>
          
          {pageProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {pageProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  reviews={reviews.filter(r => r.productId === product.id)}
                  onAddReview={handleAddReview}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return <div className="py-24 text-center">Seite nicht gefunden.</div>;
  };

  return (
    <PayPalScriptProvider options={{ 
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
      currency: "EUR"
    }}>
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
        <Navbar 
          cartCount={cart.reduce((s,i) => s + i.quantity, 0)} 
          currentView={view} 
          setView={setView} 
          isLoggedIn={isLoggedIn} 
          onLogout={() => {setIsLoggedIn(false); setCurrentUser(null); setView('shop');}} 
          settings={settings}
          pages={pages}
        />
        <div className="h-20" />
        <main className="flex-grow">{renderView()}</main>
        <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex justify-center items-center space-x-2 mb-10">
              {settings.logoImage && settings.logoImage.trim() !== "" ? (
                <img src={settings.logoImage} alt={settings.logoText} className="h-12 w-auto object-contain mx-auto opacity-90" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-serif text-sm">{settings.logoText[0]}</span>
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">{settings.logoText}<span className="text-emerald-700">{settings.logoSubText}</span></span>
                </>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium mb-8">
              <button onClick={() => isLoggedIn ? setView('admin') : setView('admin-login')} className="hover:text-white">Backoffice</button>
              {pages.filter(p => p.inFooter).map(p => (
                <button key={p.id} onClick={() => setView(p.slug)} className="hover:text-white">{p.title}</button>
              ))}
            </div>

            <div className="max-w-md mx-auto mb-8">
              <h4 className="text-white font-bold mb-4">Newsletter abonnieren</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                if (subscribers.find(s => s.email === email)) {
                  alert('Du bist bereits angemeldet!');
                  return;
                }
                updateSubscribers([...subscribers, { id: Math.random().toString(36).substr(2, 9), email, subscribedAt: new Date().toISOString(), active: true }]);
                (e.target as any).reset();
                alert('Vielen Dank für deine Anmeldung!');
              }} className="flex flex-col sm:flex-row gap-2">
                <input name="email" type="email" required placeholder="Deine E-Mail" className="flex-1 px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 text-white outline-none focus:ring-2 focus:ring-emerald-500" />
                <button type="submit" className="px-6 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all w-full sm:w-auto">Anmelden</button>
              </form>
            </div>

            <p className="text-xs">&copy; 2026 {settings.logoText} {settings.logoSubText}.</p>
          </div>
        </footer>
      </div>
    </PayPalScriptProvider>
  );
};

export default App;
