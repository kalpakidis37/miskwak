
import React, { useState, useRef } from 'react';
import { LayoutDashboard, ShoppingBag, Package, Users, Tag, Mail, Settings, Star, Palette, ShieldCheck, Save, LogOut, Menu, X } from 'lucide-react';
import { Order, OrderStatus, Product, ShopSettings, CustomPage, User, Customer, DiscountCode, NewsletterSubscriber, EmailSettings, Review } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onReorderProducts: (products: Product[]) => void;
  settings: ShopSettings;
  onUpdateSettings: (settings: ShopSettings) => void;
  pages: CustomPage[];
  onUpdatePages: (pages: CustomPage[]) => void;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
  currentUser: User;
  customers: Customer[];
  onUpdateCustomers: (customers: Customer[]) => void;
  discountCodes: DiscountCode[];
  onUpdateDiscountCodes: (codes: DiscountCode[]) => void;
  subscribers: NewsletterSubscriber[];
  onUpdateSubscribers: (subscribers: NewsletterSubscriber[]) => void;
  emailSettings: EmailSettings;
  onUpdateEmailSettings: (settings: EmailSettings) => void;
  reviews: Review[];
  onUpdateReviews: (reviews: Review[]) => void;
  onLogout: () => void;
  onSaveAll: () => void;
  onReload: () => void;
  onResetProducts: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  orders, onUpdateStatus, products, onUpdateProduct, onAddProduct, onDeleteProduct, onReorderProducts,
  settings, onUpdateSettings, pages, onUpdatePages, users, onUpdateUsers, currentUser,
  customers, onUpdateCustomers, discountCodes, onUpdateDiscountCodes,
  subscribers, onUpdateSubscribers, emailSettings, onUpdateEmailSettings,
  reviews, onUpdateReviews, onLogout, onSaveAll, onReload, onResetProducts
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'customers' | 'discounts' | 'newsletter' | 'email-settings' | 'reviews' | 'design' | 'users'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [isAddingDiscount, setIsAddingDiscount] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [newsletterDraft, setNewsletterDraft] = useState({ subject: '', content: '' });
  const [isSendingNewsletter, setIsSendingNewsletter] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Übersicht', icon: LayoutDashboard },
    { id: 'orders', label: 'Bestellungen', icon: ShoppingBag },
    { id: 'products', label: 'Produkte', icon: Package },
    { id: 'customers', label: 'Kunden', icon: Users },
    { id: 'discounts', label: 'Gutscheine', icon: Tag },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'email-settings', label: 'E-Mail', icon: Settings },
    { id: 'reviews', label: 'Bewertungen', icon: Star },
    { id: 'design', label: 'Shop Gestaltung', icon: Palette },
    { id: 'users', label: 'Benutzer', icon: ShieldCheck },
  ];

  const emptyProduct: Product = { id: '', name: '', price: 0, description: '', image: 'https://picsum.photos/seed/new/600/600', category: 'Einzelstücke', stock: 0, isVisible: true, originalPrice: undefined };
  const [formData, setFormData] = useState<Product>(emptyProduct);
  const [priceInput, setPriceInput] = useState('');
  const [originalPriceInput, setOriginalPriceInput] = useState('');
  const productImageInputRef = useRef<HTMLInputElement>(null);

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  const emptyDiscount: DiscountCode = { id: '', code: '', type: 'percentage', value: 0, active: true };
  const [discountFormData, setDiscountFormData] = useState<DiscountCode>(emptyDiscount);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === 'product') {
          setFormData({ ...formData, image: base64String });
        } else {
          onUpdateSettings({ ...settings, logoImage: base64String });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Shop Design Actions
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onUpdateSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const applyThemePreset = (preset: Partial<ShopSettings>) => {
    onUpdateSettings({ ...settings, ...preset });
  };

  const themes = [
    { name: 'Natur (Standard)', primary: '#047857', secondary: '#065f46', bg: '#ffffff', font: 'sans', radius: 'xl' },
    { name: 'Elegant & Edel', primary: '#1a1a1a', secondary: '#4a4a4a', bg: '#fdfbf7', font: 'serif', radius: 'none' },
    { name: 'Modern & Clean', primary: '#3b82f6', secondary: '#1d4ed8', bg: '#f8fafc', font: 'sans', radius: 'full' },
    { name: 'Warm & Erdig', primary: '#92400e', secondary: '#78350f', bg: '#fffbeb', font: 'serif', radius: 'large' },
  ];

  const handlePageAction = (page: CustomPage, action: 'edit' | 'delete' | 'toggleMenu' | 'toggleFooter') => {
    if (action === 'delete') {
      if(confirm('Seite wirklich löschen?')) onUpdatePages(pages.filter(p => p.id !== page.id));
    } else if (action === 'toggleMenu') {
      onUpdatePages(pages.map(p => p.id === page.id ? { ...p, inMenu: !p.inMenu } : p));
    } else if (action === 'toggleFooter') {
      onUpdatePages(pages.map(p => p.id === page.id ? { ...p, inFooter: !p.inFooter } : p));
    } else {
      setEditingPage({ ...page });
    }
  };

  const savePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      if (pages.find(p => p.id === editingPage.id)) {
        onUpdatePages(pages.map(p => p.id === editingPage.id ? editingPage : p));
      } else {
        onUpdatePages([...pages, editingPage]);
      }
      setEditingPage(null);
    }
  };

  // Products Reordering
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;
    
    const [movedItem] = newProducts.splice(index, 1);
    newProducts.splice(targetIndex, 0, movedItem);
    onReorderProducts(newProducts);
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const newPages = [...pages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;
    
    const [movedItem] = newPages.splice(index, 1);
    newPages.splice(targetIndex, 0, movedItem);
    onUpdatePages(newPages);
  };

  // Helper
  const getCustomerRevenue = (email: string) => {
    return orders
      .filter(o => o.customer.email.toLowerCase() === email.toLowerCase())
      .reduce((sum, o) => sum + o.total, 0);
  };

  const getCustomers = () => {
    const customerMap = new Map<string, any>();
    orders.forEach(order => {
      const email = order.customer.email.toLowerCase();
      if (!customerMap.has(email)) customerMap.set(email, { info: order.customer, orderCount: 1, totalSpent: order.total, lastOrder: order.date });
      else {
        const existing = customerMap.get(email);
        customerMap.set(email, { ...existing, orderCount: existing.orderCount + 1, totalSpent: existing.totalSpent + order.total, lastOrder: new Date(order.date) > new Date(existing.lastOrder) ? order.date : existing.lastOrder });
      }
    });
    return Array.from(customerMap.values());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* Mobile Sticky Menu */}
          <div className="lg:hidden sticky top-20 z-30 bg-white/95 backdrop-blur border-b border-stone-200 -mx-4 px-4 py-3 mb-6 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-800 text-sm uppercase tracking-wider">
                  {tabs.find(t => t.id === activeTab)?.label || 'Backoffice'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onSaveAll}
                  className="p-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shadow-sm"
                  title="Speichern"
                >
                  <Save size={18} />
                </button>
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className="p-2 bg-stone-100 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
            
            {mobileMenuOpen && (
              <div className="pt-4 pb-2 space-y-1 max-h-[70vh] overflow-y-auto animate-in slide-in-from-top-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setEditingPage(null);
                        setEditingProduct(null);
                        setEditingUser(null);
                        setIsAddingUser(false);
                        setEditingDiscount(null);
                        setIsAddingDiscount(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' 
                          : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
                <div className="pt-4 flex gap-2 border-t border-stone-100 mt-2">
                  <button onClick={onLogout} className="w-full bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-stone-300 transition-all flex items-center justify-center">
                    <LogOut className="w-4 h-4 mr-2" />
                    Abmelden
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:sticky lg:top-32 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-800">Backoffice</h2>
              <p className="text-stone-500 text-xs mt-1 font-medium uppercase tracking-wider">Administration</p>
            </div>

            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setEditingPage(null);
                      setEditingProduct(null);
                      setEditingUser(null);
                      setIsAddingUser(false);
                      setEditingDiscount(null);
                      setIsAddingDiscount(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all w-full ${
                      isActive 
                        ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20' 
                        : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-stone-200 space-y-3">
              <button 
                onClick={onLogout} 
                className="w-full flex items-center justify-center space-x-2 bg-stone-100 text-stone-600 px-4 py-3 rounded-xl text-sm font-bold hover:bg-stone-200 transition-all border border-stone-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Abmelden</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="hidden lg:flex justify-between items-center mb-8 bg-white/80 backdrop-blur p-4 rounded-2xl border border-stone-200 shadow-sm sticky top-32 z-20">
            <h2 className="text-xl font-bold text-stone-800">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <button 
              onClick={onSaveAll} 
              className="flex items-center space-x-2 bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-700/20"
            >
              <Save className="w-4 h-4" />
              <span>Änderungen speichern</span>
            </button>
          </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-stone-500 text-xs font-bold uppercase mb-1">Gesamtumsatz</p>
              <p className="text-3xl font-bold text-stone-800">{orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)} €</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-stone-500 text-xs font-bold uppercase mb-1">Bestellungen</p>
              <p className="text-3xl font-bold text-stone-800">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-stone-500 text-xs font-bold uppercase mb-1">Kunden</p>
              <p className="text-3xl font-bold text-stone-800">{customers.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-stone-500 text-xs font-bold uppercase mb-1">Durchschn. Warenkorb</p>
              <p className="text-3xl font-bold text-stone-800">
                {orders.length > 0 ? (orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toFixed(2) : '0.00'} €
              </p>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-6">Umsatzverlauf (letzte 30 Tage)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={(() => {
                  const last30Days = Array.from({ length: 30 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (29 - i));
                    return d.toISOString().split('T')[0];
                  });
                  return last30Days.map(date => ({
                    date: new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
                    revenue: orders
                      .filter(o => o.date.startsWith(date))
                      .reduce((sum, o) => sum + o.total, 0)
                  }));
                })()}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#047857" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#047857" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a8a29e'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#a8a29e'}} tickFormatter={(v) => `${v}€`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    itemStyle={{color: '#047857', fontWeight: 'bold'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#047857" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-6">Top Produkte</h3>
              <div className="space-y-4">
                {products
                  .map(p => ({
                    ...p,
                    sold: orders.flatMap(o => o.items).filter(i => i.id === p.id).reduce((sum, i) => sum + i.quantity, 0)
                  }))
                  .sort((a, b) => b.sold - a.sold)
                  .slice(0, 5)
                  .map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover mr-3" />
                        <div>
                          <p className="font-bold text-stone-800 text-sm">{p.name}</p>
                          <p className="text-stone-400 text-xs">{p.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-700">{p.sold} verkauft</p>
                        <p className="text-stone-400 text-xs">{(p.sold * p.price).toFixed(2)} € Umsatz</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-6">Letzte Bestellungen</h3>
              <div className="space-y-4">
                {orders.slice(-5).reverse().map(o => (
                  <div key={o.id} className="flex items-center justify-between border-b border-stone-50 pb-4 last:border-0">
                    <div>
                      <p className="font-bold text-stone-800 text-sm">#{o.id.slice(-6)}</p>
                      <p className="text-stone-400 text-xs">{o.customer.firstName} {o.customer.lastName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-stone-800">{o.total.toFixed(2)} €</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        o.status === 'abgeschlossen' ? 'bg-emerald-100 text-emerald-700' : 
                        o.status === 'versandt' ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'design' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Identity */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Branding (Logo)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Logo Bild URL oder Upload</label>
                  <div className="flex gap-2">
                    <input name="logoImage" value={settings.logoImage || ''} onChange={handleLogoChange} placeholder="https://..." className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={(e) => handleImageUpload(e, 'logo')}
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-stone-100 text-stone-600 rounded-xl border border-stone-200 hover:bg-stone-200 transition-all text-xs font-bold"
                    >
                      Upload
                    </button>
                  </div>
                  {settings.logoImage && (
                    <div className="mt-2 w-10 h-10 rounded border overflow-hidden bg-stone-50">
                      <img src={settings.logoImage} alt="Logo Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <p className="text-[10px] text-stone-400 mt-1 italic">Lasse das Feld leer, um das Text-Logo zu verwenden.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Haupttext</label>
                  <input name="logoText" value={settings.logoText} onChange={handleLogoChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Akzenttext</label>
                  <input name="logoSubText" value={settings.logoSubText} onChange={handleLogoChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-700" />
                </div>
                <div className="pt-2">
                  <button 
                    onClick={onSaveAll}
                    className="w-full bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shadow-md flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    Branding speichern
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
               <h4 className="font-bold text-emerald-800 text-sm mb-2">Tipp</h4>
               <p className="text-emerald-700 text-xs leading-relaxed">Der Haupttext bestimmt auch das Symbol (Initial) in der Navigation.</p>
            </div>

            {/* Colors & Style */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Farben & Design</h3>
              <div className="space-y-6">
                {/* Presets */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-3">Design Vorlagen</label>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((t) => (
                      <button
                        key={t.name}
                        onClick={() => applyThemePreset({
                          primaryColor: t.primary,
                          secondaryColor: t.secondary,
                          backgroundColor: t.bg,
                          fontFamily: t.font,
                          borderRadius: t.radius as any
                        })}
                        className="p-3 rounded-xl border border-stone-100 hover:border-emerald-500 transition-all text-left group bg-stone-50/50"
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primary }} />
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.secondary }} />
                          <div className="w-4 h-4 rounded-full border border-stone-200" style={{ backgroundColor: t.bg }} />
                        </div>
                        <p className="text-[10px] font-bold text-stone-700 group-hover:text-emerald-700">{t.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Hauptfarbe</label>
                    <div className="flex items-center gap-2">
                      <input type="color" name="primaryColor" value={settings.primaryColor || '#047857'} onChange={handleLogoChange} className="w-8 h-8 rounded-lg border-0 p-0 cursor-pointer" />
                      <input type="text" name="primaryColor" value={settings.primaryColor || '#047857'} onChange={handleLogoChange} className="flex-1 px-3 py-1.5 border rounded-lg text-xs font-mono uppercase" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Sekundärfarbe</label>
                    <div className="flex items-center gap-2">
                      <input type="color" name="secondaryColor" value={settings.secondaryColor || '#065f46'} onChange={handleLogoChange} className="w-8 h-8 rounded-lg border-0 p-0 cursor-pointer" />
                      <input type="text" name="secondaryColor" value={settings.secondaryColor || '#065f46'} onChange={handleLogoChange} className="flex-1 px-3 py-1.5 border rounded-lg text-xs font-mono uppercase" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Hintergrundfarbe</label>
                  <div className="flex items-center gap-2">
                    <input type="color" name="backgroundColor" value={settings.backgroundColor || '#ffffff'} onChange={handleLogoChange} className="w-8 h-8 rounded-lg border-0 p-0 cursor-pointer" />
                    <input type="text" name="backgroundColor" value={settings.backgroundColor || '#ffffff'} onChange={handleLogoChange} className="flex-1 px-3 py-1.5 border rounded-lg text-xs font-mono uppercase" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Schriftart</label>
                    <select name="fontFamily" value={settings.fontFamily || 'sans'} onChange={handleLogoChange} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs">
                      <option value="sans">Modern (Sans)</option>
                      <option value="serif">Elegant (Serif)</option>
                      <option value="mono">Technisch (Mono)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Eckenradius</label>
                    <select name="borderRadius" value={settings.borderRadius || 'xl'} onChange={handleLogoChange} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs">
                      <option value="none">Eckig</option>
                      <option value="small">Klein</option>
                      <option value="medium">Mittel</option>
                      <option value="large">Groß</option>
                      <option value="full">Rund</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Button Stil</label>
                  <div className="flex gap-2">
                    {['solid', 'outline', 'ghost'].map((style) => (
                      <button
                        key={style}
                        onClick={() => onUpdateSettings({ ...settings, buttonStyle: style as any })}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                          (settings.buttonStyle || 'solid') === style
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {style.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={onSaveAll}
                    className="w-full bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shadow-md flex items-center justify-center"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Design speichern
                  </button>
                </div>
              </div>
            </div>

            {/* Shop Page Content */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-lg font-bold text-stone-800 mb-4 border-b pb-2">Shop Seite Texte</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Überschrift (z.B. Unsere Produkte)</label>
                  <input name="shopTitle" value={settings.shopTitle || 'Unsere Produkte'} onChange={handleLogoChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Untertitel</label>
                  <input name="shopSubtitle" value={settings.shopSubtitle || 'Natur pur für deine Zahnpflege.'} onChange={handleLogoChange} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="pt-2">
                  <button 
                    onClick={onSaveAll}
                    className="w-full bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shadow-md flex items-center justify-center"
                  >
                    <Save className="w-3 h-3 mr-2" />
                    Texte speichern
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pages & Menu */}
          <div className="md:col-span-2 space-y-8">
            {editingPage ? (
              <div className="bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-xl animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold mb-6">Seite bearbeiten: {editingPage.title}</h3>
                <form onSubmit={savePage} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Seitentitel</label>
                      <input required value={editingPage.title} onChange={e => setEditingPage({...editingPage, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full px-4 py-2 border rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 mb-1">Slug (URL)</label>
                      <input readOnly value={editingPage.slug} className="w-full px-4 py-2 border bg-stone-50 rounded-xl font-mono text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Inhalt (Text/HTML)</label>
                    <textarea rows={6} value={editingPage.content} onChange={e => setEditingPage({...editingPage, content: e.target.value})} className="w-full px-4 py-2 border rounded-xl font-sans text-sm resize-none" placeholder="Schreibe hier den Inhalt der Seite..."></textarea>
                  </div>
                  <div className="flex space-x-6 py-2">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={editingPage.inMenu} 
                        onChange={e => setEditingPage({...editingPage, inMenu: e.target.checked})}
                        className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-bold text-stone-700 group-hover:text-emerald-700 transition-colors">Im oberen Menü anzeigen</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={editingPage.inFooter} 
                        onChange={e => setEditingPage({...editingPage, inFooter: e.target.checked})}
                        className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-bold text-stone-700 group-hover:text-emerald-700 transition-colors">Im unteren Menü anzeigen</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">Produkte auf dieser Seite anzeigen</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border rounded-xl bg-stone-50">
                      {products.map(product => {
                        const isSelected = editingPage.productIds?.includes(product.id);
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              const currentIds = editingPage.productIds || [];
                              const newIds = isSelected 
                                ? currentIds.filter(id => id !== product.id)
                                : [...currentIds, product.id];
                              setEditingPage({ ...editingPage, productIds: newIds });
                            }}
                            className={`flex items-center p-2 rounded-lg border text-left transition-all ${isSelected ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-stone-200 hover:border-stone-300'}`}
                          >
                            <img src={product.image} alt="" className="w-8 h-8 rounded object-cover mr-2" />
                            <span className="text-[10px] font-bold text-stone-700 truncate">{product.name}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-stone-400 mt-2 italic text-center">Klicke auf die Produkte, um sie dieser Seite hinzuzufügen oder zu entfernen. Zugeordnete Produkte erscheinen nicht mehr im Haupt-Shop.</p>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button type="button" onClick={() => setEditingPage(null)} className="px-6 py-2 text-stone-500 font-bold">Abbrechen</button>
                    <button type="submit" className="px-8 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800">Speichern</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-stone-50 border-b flex justify-between items-center">
                  <h3 className="font-bold text-stone-800">Seiten & Menü-Reiter</h3>
                  <button onClick={() => setEditingPage({id: Math.random().toString(36).substr(2,9), title: 'Neue Seite', slug: 'neue-seite', content: '', inMenu: false, inFooter: false, productIds: []})} className="bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-800 transition-all">+ Neue Seite</button>
                </div>
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-[10px] font-bold text-stone-400 uppercase">Titel</th>
                      <th className="px-6 py-3 text-center text-[10px] font-bold text-stone-400 uppercase">Oben?</th>
                      <th className="px-6 py-3 text-center text-[10px] font-bold text-stone-400 uppercase">Unten?</th>
                      <th className="px-6 py-3 text-center text-[10px] font-bold text-stone-400 uppercase">Reihenfolge</th>
                      <th className="px-6 py-3 text-right text-[10px] font-bold text-stone-400 uppercase">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {pages.map((page, index) => (
                      <tr key={page.id} className="hover:bg-stone-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-stone-800">{page.title}</div>
                          <div className="text-[10px] text-stone-400 font-mono">/{page.slug}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handlePageAction(page, 'toggleMenu')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${page.inMenu ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-400 border border-stone-200'}`}>
                            {page.inMenu ? 'AKTIV' : 'AUS'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handlePageAction(page, 'toggleFooter')} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${page.inFooter ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-400 border border-stone-200'}`}>
                            {page.inFooter ? 'AKTIV' : 'AUS'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center space-x-1">
                            <button 
                              disabled={index === 0}
                              onClick={() => movePage(index, 'up')}
                              className={`p-1 rounded border ${index === 0 ? 'text-stone-200 border-stone-100' : 'text-stone-500 border-stone-200 hover:bg-stone-100'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                            </button>
                            <button 
                              disabled={index === pages.length - 1}
                              onClick={() => movePage(index, 'down')}
                              className={`p-1 rounded border ${index === pages.length - 1 ? 'text-stone-200 border-stone-100' : 'text-stone-500 border-stone-200 hover:bg-stone-100'}`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={() => handlePageAction(page, 'edit')} className="text-emerald-600 text-xs font-bold hover:underline">Bearbeiten</button>
                          <button onClick={() => handlePageAction(page, 'delete')} className="text-red-400 text-xs font-bold hover:underline">Löschen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTHER TABS (Orders, Products, Customers) REMAIN SIMILAR BUT INTEGRATED */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Suche (ID, Name, Email)..." 
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select 
              value={orderStatusFilter} 
              onChange={e => setOrderStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-stone-600"
            >
              <option value="all">Alle Status</option>
              <option value="offen">Offen</option>
              <option value="in Bearbeitung">In Bearbeitung</option>
              <option value="versandt">Versandt</option>
              <option value="abgeschlossen">Abgeschlossen</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500">Kunde</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500">Datum</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500">Summe</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-stone-500">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-stone-500">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {orders.filter(o => {
                  const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                        o.customer.firstName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                                        o.customer.lastName.toLowerCase().includes(orderSearch.toLowerCase()) ||
                                        o.customer.email.toLowerCase().includes(orderSearch.toLowerCase());
                  const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
                  return matchesSearch && matchesStatus;
                }).map(o => (
                  <React.Fragment key={o.id}>
                    <tr className="hover:bg-stone-50 cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                      <td className="px-6 py-4 text-sm font-bold">#{o.id.slice(-6)}</td>
                      <td className="px-6 py-4 text-sm">{o.customer.firstName} {o.customer.lastName}</td>
                      <td className="px-6 py-4 text-sm text-stone-500">{new Date(o.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-bold text-stone-800">{o.total.toFixed(2)} €</td>
                      <td className="px-6 py-4">
                        <select 
                          value={o.status} 
                          onClick={e => e.stopPropagation()}
                          onChange={e => onUpdateStatus(o.id, e.target.value as any)} 
                          className="text-xs font-bold p-1 rounded border outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="offen">Offen</option>
                          <option value="in Bearbeitung">In Bearbeitung</option>
                          <option value="versandt">Versandt</option>
                          <option value="abgeschlossen">Abgeschlossen</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-stone-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedOrder === o.id ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === o.id && (
                      <tr className="bg-stone-50/50">
                        <td colSpan={6} className="px-12 py-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-xs font-bold text-stone-400 uppercase mb-4">Bestellte Artikel</h4>
                              <div className="space-y-3">
                                {o.items.map(item => (
                                  <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-100">
                                    <div className="flex items-center">
                                      <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover mr-3" />
                                      <div>
                                        <p className="font-bold text-stone-800 text-sm">{item.name}</p>
                                        <p className="text-stone-400 text-xs">{item.quantity}x {item.price.toFixed(2)} €</p>
                                      </div>
                                    </div>
                                    <p className="font-bold text-stone-800">{(item.quantity * item.price).toFixed(2)} €</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-stone-400 uppercase mb-4">Versandadresse</h4>
                              <div className="bg-white p-4 rounded-xl border border-stone-100 text-sm space-y-1">
                                <p className="font-bold text-stone-800">{o.customer.firstName} {o.customer.lastName}</p>
                                <p className="text-stone-600">{o.customer.address}</p>
                                <p className="text-stone-600">{o.customer.zip} {o.customer.city}</p>
                                <p className="text-emerald-700 font-medium pt-2">{o.customer.email}</p>
                                {o.customer.phone && <p className="text-stone-500">{o.customer.phone}</p>}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-stone-800">Produktverwaltung</h3>
              <div className="flex gap-2">
                {!isAdding && !editingProduct && (
                  <>
                    <button 
                      onClick={() => {
                        setFormData(emptyProduct); 
                        setPriceInput(''); 
                        setOriginalPriceInput('');
                        setIsAdding(true); 
                        setEditingProduct(null);
                      }} 
                      className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-sm"
                    >
                      + Neues Produkt
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {!isAdding && !editingProduct && (
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Suche Produkte..." 
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select 
                  value={productCategoryFilter} 
                  onChange={e => setProductCategoryFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-stone-600"
                >
                  <option value="all">Alle Kategorien</option>
                  {Array.from(new Set(products.map(p => p.category))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {(isAdding || editingProduct) && (
            <div className="bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold mb-6">
                {isAdding ? 'Neues Produkt hinzufügen' : `Produkt bearbeiten: ${editingProduct?.name}`}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (isAdding) {
                  onAddProduct({ ...formData, id: Math.random().toString(36).substr(2, 9) });
                } else if (editingProduct) {
                  onUpdateProduct(formData);
                }
                setIsAdding(false);
                setEditingProduct(null);
                setFormData(emptyProduct);
                setPriceInput('');
                setOriginalPriceInput('');
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Name</label>
                    <input 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Kategorie</label>
                    <input 
                      required 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Preis (€)</label>
                    <input 
                      type="text" 
                      required 
                      value={priceInput} 
                      onChange={e => {
                        const val = e.target.value;
                        // Allow digits, one comma or dot, and up to 2 decimal places
                        if (val === '' || /^\d*([.,]\d{0,2})?$/.test(val)) {
                          setPriceInput(val);
                          const numericVal = parseFloat(val.replace(',', '.'));
                          setFormData({...formData, price: isNaN(numericVal) ? 0 : numericVal});
                        }
                      }} 
                      placeholder="0,00"
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">UVP / Alter Preis (€)</label>
                    <input 
                      type="text" 
                      value={originalPriceInput} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '' || /^\d*([.,]\d{0,2})?$/.test(val)) {
                          setOriginalPriceInput(val);
                          if (val === '') {
                            const { originalPrice, ...rest } = formData;
                            setFormData(rest);
                          } else {
                            const numericVal = parseFloat(val.replace(',', '.'));
                            setFormData({...formData, originalPrice: isNaN(numericVal) ? undefined : numericVal});
                          }
                        }
                      }} 
                      placeholder="Optional"
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Lagerbestand</label>
                    <input 
                      type="number" 
                      required 
                      value={isNaN(formData.stock) || formData.stock === null ? '' : formData.stock} 
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                        setFormData({...formData, stock: isNaN(val) ? 0 : val});
                      }} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Bild URL oder Upload</label>
                    <div className="flex gap-2">
                      <input 
                        required 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-xs" 
                        placeholder="https://..."
                      />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        ref={productImageInputRef}
                        onChange={(e) => handleImageUpload(e, 'product')}
                      />
                      <button 
                        type="button"
                        onClick={() => productImageInputRef.current?.click()}
                        className="px-3 py-2 bg-stone-100 text-stone-600 rounded-xl border border-stone-200 hover:bg-stone-200 transition-all text-xs font-bold"
                      >
                        Upload
                      </button>
                    </div>
                    {formData.image && (
                      <div className="mt-2 w-20 h-20 rounded-lg border overflow-hidden bg-stone-50">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Beschreibung</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-wider">Auf speziellen Seiten anzeigen</label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-stone-50">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isVisible: formData.isVisible === false})}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        formData.isVisible !== false 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                          : 'bg-white text-stone-500 border-stone-200 hover:border-emerald-500'
                      }`}
                    >
                      Haupt-Shop
                    </button>
                    <div className="w-px h-6 bg-stone-200 mx-1 self-center"></div>
                    {pages.map(page => {
                      const isAssigned = page.productIds?.includes(formData.id);
                      return (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => {
                            const newPages = pages.map(p => {
                              if (p.id === page.id) {
                                const currentIds = p.productIds || [];
                                const newIds = isAssigned 
                                  ? currentIds.filter(id => id !== formData.id)
                                  : [...currentIds, formData.id];
                                return { ...p, productIds: newIds };
                              }
                              return p;
                            });
                            onUpdatePages(newPages);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${isAssigned ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}
                        >
                          {page.title}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-2 italic">
                    Hinweis: Produkte können gleichzeitig im Haupt-Shop und auf speziellen Seiten angezeigt werden. Deaktiviere "Haupt-Shop", um ein Produkt exklusiv auf einer Unterseite anzuzeigen.
                  </p>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsAdding(false); 
                      setEditingProduct(null); 
                      setFormData(emptyProduct); 
                      setPriceInput('');
                      setOriginalPriceInput('');
                    }} 
                    className="px-6 py-2 text-stone-500 font-bold hover:text-stone-700"
                  >
                    Abbrechen
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md"
                  >
                    {isAdding ? 'Hinzufügen' : 'Speichern'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
             <table className="min-w-full divide-y divide-stone-200 text-sm">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Produkt</th>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Kategorie</th>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Preis</th>
                    <th className="px-6 py-4 text-center font-bold text-stone-500 uppercase tracking-wider">Lager</th>
                    <th className="px-6 py-4 text-center font-bold text-stone-500 uppercase tracking-wider">Sichtbarkeit</th>
                    <th className="px-6 py-4 text-center font-bold text-stone-500 uppercase tracking-wider">Reihenfolge</th>
                    <th className="px-6 py-4 text-right font-bold text-stone-500 uppercase tracking-wider">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.filter(p => {
                    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                                          p.category.toLowerCase().includes(productSearch.toLowerCase());
                    const matchesCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
                    return matchesSearch && matchesCategory;
                  }).map((p, index) => (
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover mr-3 border border-stone-100" />
                          <span className="font-bold text-stone-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-500">{p.category}</td>
                      <td className="px-6 py-4 font-medium text-stone-900">{p.price.toFixed(2)} €</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          (p.stock || 0) > 5 ? 'bg-emerald-50 text-emerald-700' : 
                          (p.stock || 0) > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {p.stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          p.isVisible !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                        }`}>
                          {p.isVisible !== false ? 'Sichtbar' : 'Versteckt'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center space-x-1">
                          <button 
                            disabled={index === 0}
                            onClick={() => moveProduct(index, 'up')}
                            className={`p-1.5 rounded-lg border ${index === 0 ? 'text-stone-300 border-stone-100' : 'text-stone-600 border-stone-200 hover:bg-stone-100'}`}
                            title="Nach oben"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                          </button>
                          <button 
                            disabled={index === products.length - 1}
                            onClick={() => moveProduct(index, 'down')}
                            className={`p-1.5 rounded-lg border ${index === products.length - 1 ? 'text-stone-300 border-stone-100' : 'text-stone-600 border-stone-200 hover:bg-stone-100'}`}
                            title="Nach unten"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button 
                          onClick={() => {
                            setEditingProduct(p); 
                            setFormData(p); 
                            setPriceInput(p.price.toString().replace('.', ',')); 
                            setOriginalPriceInput(p.originalPrice ? p.originalPrice.toString().replace('.', ',') : '');
                            setIsAdding(false);
                          }} 
                          className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors"
                        >
                          Bearbeiten
                        </button>
                        <button 
                          onClick={() => {if(confirm('Produkt wirklich löschen?')) onDeleteProduct(p.id)}} 
                          className="text-red-400 font-bold hover:text-red-600 transition-colors"
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'newsletter' && (
        <div className="space-y-8">
          {/* Newsletter Composition */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-xl font-bold text-stone-800 mb-6 border-b pb-4">Newsletter verfassen</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!emailSettings.smtpHost) {
                alert('Bitte konfiguriere zuerst die E-Mail Einstellungen (SMTP).');
                return;
              }
              const activeSubs = subscribers.filter(s => s.active);
              if (activeSubs.length === 0) {
                alert('Keine aktiven Abonnenten vorhanden.');
                return;
              }
              
              setIsSendingNewsletter(true);
              // Simulate sending
              setTimeout(() => {
                setIsSendingNewsletter(false);
                alert(`Newsletter erfolgreich an ${activeSubs.length} Abonnenten versendet!`);
                setNewsletterDraft({ subject: '', content: '' });
              }, 2000);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Betreff</label>
                <input 
                  required 
                  value={newsletterDraft.subject} 
                  onChange={e => setNewsletterDraft({...newsletterDraft, subject: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="Z.B. Unsere neuen Miswak-Sets sind da!" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Inhalt</label>
                <textarea 
                  required 
                  rows={8} 
                  value={newsletterDraft.content} 
                  onChange={e => setNewsletterDraft({...newsletterDraft, content: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-sans" 
                  placeholder="Schreibe hier deine Nachricht an deine Kunden..."
                ></textarea>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-xs text-stone-400 italic">
                  Empfänger: <span className="font-bold text-stone-600">{subscribers.filter(s => s.active).length} aktive Abonnenten</span>
                </p>
                <button 
                  type="submit" 
                  disabled={isSendingNewsletter}
                  className={`px-8 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md flex items-center ${isSendingNewsletter ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSendingNewsletter ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Wird gesendet...
                    </>
                  ) : 'Newsletter jetzt absenden'}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-stone-800">Newsletter Abonnenten</h3>
            <button 
              onClick={() => {
                const csv = "Email,Anmeldedatum\n" + subscribers.map(s => `${s.email},${s.subscribedAt}`).join("\n");
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.setAttribute('hidden', '');
                a.setAttribute('href', url);
                a.setAttribute('download', 'subscribers.csv');
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}
              className="bg-stone-800 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-stone-700 transition-all shadow-sm"
            >
              CSV Export
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Angemeldet am</th>
                  <th className="px-6 py-4 text-center font-bold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right font-bold text-stone-500 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {subscribers.map(sub => (
                  <tr key={sub.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{sub.email}</td>
                    <td className="px-6 py-4 text-stone-600">{new Date(sub.subscribedAt).toLocaleDateString('de-DE')}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => onUpdateSubscribers(subscribers.map(s => s.id === sub.id ? { ...s, active: !s.active } : s))}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${sub.active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}
                      >
                        {sub.active ? 'AKTIV' : 'INAKTIV'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => {if(confirm('Abonnent wirklich löschen?')) onUpdateSubscribers(subscribers.filter(s => s.id !== sub.id))}} className="text-red-400 font-bold hover:text-red-600 transition-colors">Löschen</button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-stone-400">Keine Abonnenten vorhanden.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-stone-800">Produktbewertungen verwalten</h3>
          <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Produkt</th>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Kunde</th>
                  <th className="px-6 py-4 text-center font-bold text-stone-500 uppercase tracking-wider">Bewertung</th>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Kommentar</th>
                  <th className="px-6 py-4 text-right font-bold text-stone-500 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reviews.map(rev => {
                  const product = products.find(p => p.id === rev.productId);
                  return (
                    <tr key={rev.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img src={product?.image} alt="" className="w-8 h-8 rounded object-cover mr-2" />
                          <span className="font-bold text-stone-800">{product?.name || 'Unbekannt'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-800">{rev.customerName}</div>
                        <div className="text-[10px] text-stone-400">{rev.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-600 max-w-xs truncate">{rev.comment}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {if(confirm('Bewertung wirklich löschen?')) onUpdateReviews(reviews.filter(r => r.id !== rev.id))}} 
                          className="text-red-400 font-bold hover:text-red-600 transition-colors"
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {reviews.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-stone-400">Keine Bewertungen vorhanden.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'email-settings' && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
            <h3 className="text-xl font-bold text-stone-800 mb-6 border-b pb-4">E-Mail (SMTP) Konfiguration</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Einstellungen gespeichert!');
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">SMTP Host</label>
                  <input value={emailSettings.smtpHost} onChange={e => onUpdateEmailSettings({...emailSettings, smtpHost: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="smtp.example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">SMTP Port</label>
                  <input 
                    type="number" 
                    value={isNaN(emailSettings.smtpPort) || emailSettings.smtpPort === null ? '' : emailSettings.smtpPort} 
                    onChange={e => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      onUpdateEmailSettings({...emailSettings, smtpPort: isNaN(val) ? 0 : val});
                    }} 
                    className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    placeholder="587" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">SMTP Benutzer</label>
                  <input value={emailSettings.smtpUser} onChange={e => onUpdateEmailSettings({...emailSettings, smtpUser: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">SMTP Passwort</label>
                  <input type="password" value={emailSettings.smtpPass} onChange={e => onUpdateEmailSettings({...emailSettings, smtpPass: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Absender E-Mail</label>
                  <input value={emailSettings.senderEmail} onChange={e => onUpdateEmailSettings({...emailSettings, senderEmail: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="newsletter@deinshop.de" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Absender Name</label>
                  <input value={emailSettings.senderName} onChange={e => onUpdateEmailSettings({...emailSettings, senderName: e.target.value})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="px-8 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md">
                  Einstellungen speichern
                </button>
              </div>
            </form>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-800 text-sm mb-2">Info</h4>
            <p className="text-emerald-700 text-xs leading-relaxed">
              Diese Einstellungen werden für den Versand von Bestellbestätigungen und Newslettern verwendet. 
              Bitte stelle sicher, dass dein SMTP-Anbieter den Versand über diese Daten erlaubt.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-stone-800">Gutscheincodes</h3>
            {!isAddingDiscount && !editingDiscount && (
              <button 
                onClick={() => {setDiscountFormData(emptyDiscount); setIsAddingDiscount(true);}} 
                className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-sm"
              >
                + Neuer Gutschein
              </button>
            )}
          </div>

          {(isAddingDiscount || editingDiscount) && (
            <div className="bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold mb-6">
                {isAddingDiscount ? 'Neuen Gutschein erstellen' : `Gutschein bearbeiten: ${editingDiscount?.code}`}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const code = isAddingDiscount ? { ...discountFormData, id: Math.random().toString(36).substr(2, 9) } : discountFormData;
                if (isAddingDiscount) onUpdateDiscountCodes([...discountCodes, code]);
                else onUpdateDiscountCodes(discountCodes.map(c => c.id === code.id ? code : c));
                setIsAddingDiscount(false);
                setEditingDiscount(null);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Code</label>
                    <input required value={discountFormData.code} onChange={e => setDiscountFormData({...discountFormData, code: e.target.value.toUpperCase()})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Z.B. SOMMER20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Typ</label>
                    <select value={discountFormData.type} onChange={e => setDiscountFormData({...discountFormData, type: e.target.value as any})} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="percentage">Prozentual (%)</option>
                      <option value="fixed">Festbetrag (€)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Wert</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      value={isNaN(discountFormData.value) || discountFormData.value === null ? '' : discountFormData.value} 
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        setDiscountFormData({...discountFormData, value: isNaN(val) ? 0 : val});
                      }} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Mindestbestellwert (€)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={isNaN(discountFormData.minOrderValue || 0) || discountFormData.minOrderValue === null ? '' : (discountFormData.minOrderValue || '')} 
                      onChange={e => {
                        const val = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        setDiscountFormData({...discountFormData, minOrderValue: isNaN(val as number) ? undefined : val});
                      }} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="Optional (0 für keinen)" 
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button type="button" onClick={() => {setIsAddingDiscount(false); setEditingDiscount(null);}} className="px-6 py-2 text-stone-500 font-bold hover:text-stone-700">Abbrechen</button>
                  <button type="submit" className="px-8 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md">
                    {isAddingDiscount ? 'Erstellen' : 'Speichern'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
            <table className="min-w-full divide-y divide-stone-200 text-sm">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Rabatt</th>
                  <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Mindestwert</th>
                  <th className="px-6 py-4 text-center font-bold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right font-bold text-stone-500 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {discountCodes.map(code => (
                  <tr key={code.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-stone-800">{code.code}</td>
                    <td className="px-6 py-4 text-stone-600">
                      {code.type === 'percentage' ? `${code.value}%` : `${code.value.toFixed(2)} €`}
                    </td>
                    <td className="px-6 py-4 text-stone-500">
                      {code.minOrderValue ? `${code.minOrderValue.toFixed(2)} €` : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => onUpdateDiscountCodes(discountCodes.map(c => c.id === code.id ? { ...c, active: !c.active } : c))}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${code.active ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}
                      >
                        {code.active ? 'AKTIV' : 'INAKTIV'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button onClick={() => {setEditingDiscount(code); setDiscountFormData(code); setIsAddingDiscount(false);}} className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors">Bearbeiten</button>
                      <button onClick={() => {if(confirm('Gutschein wirklich löschen?')) onUpdateDiscountCodes(discountCodes.filter(c => c.id !== code.id))}} className="text-red-400 font-bold hover:text-red-600 transition-colors">Löschen</button>
                    </td>
                  </tr>
                ))}
                {discountCodes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-stone-400">Keine Gutscheincodes vorhanden.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-stone-800">Kundenverwaltung</h3>
            {!isAddingCustomer && !editingCustomer && (
              <button 
                onClick={() => {
                  setEditingCustomer({ 
                    id: '', 
                    firstName: '', 
                    lastName: '', 
                    email: '', 
                    phone: '', 
                    address: '', 
                    zip: '', 
                    city: '',
                    createdAt: new Date().toISOString()
                  }); 
                  setIsAddingCustomer(true);
                }} 
                className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-sm"
              >
                + Neuer Kunde
              </button>
            )}
          </div>

          {(isAddingCustomer || editingCustomer) && (
            <div className="bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold mb-6">
                {isAddingCustomer ? 'Neuen Kunden anlegen' : `Kunde bearbeiten: ${editingCustomer?.firstName} ${editingCustomer?.lastName}`}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingCustomer) {
                  if (isAddingCustomer) {
                    onUpdateCustomers([...customers, { ...editingCustomer, id: Math.random().toString(36).substr(2, 9) }]);
                  } else {
                    onUpdateCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
                  }
                }
                setIsAddingCustomer(false);
                setEditingCustomer(null);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Vorname</label>
                    <input required value={editingCustomer?.firstName || ''} onChange={e => setEditingCustomer(editingCustomer ? {...editingCustomer, firstName: e.target.value} : null)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Nachname</label>
                    <input required value={editingCustomer?.lastName || ''} onChange={e => setEditingCustomer(editingCustomer ? {...editingCustomer, lastName: e.target.value} : null)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">E-Mail</label>
                    <input required type="email" value={editingCustomer?.email || ''} onChange={e => setEditingCustomer(editingCustomer ? {...editingCustomer, email: e.target.value} : null)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Telefon</label>
                    <input type="tel" value={editingCustomer?.phone || ''} onChange={e => setEditingCustomer(editingCustomer ? {...editingCustomer, phone: e.target.value} : null)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 mb-1">Adresse</label>
                  <input required value={editingCustomer?.address || ''} onChange={e => setEditingCustomer(editingCustomer ? {...editingCustomer, address: e.target.value} : null)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">PLZ</label>
                    <input required value={editingCustomer?.zip || ''} onChange={e => setEditingCustomer(editingCustomer ? {...editingCustomer, zip: e.target.value} : null)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Stadt</label>
                    <input required value={editingCustomer?.city || ''} onChange={e => setEditingCustomer(editingCustomer ? {...editingCustomer, city: e.target.value} : null)} className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button type="button" onClick={() => {setIsAddingCustomer(false); setEditingCustomer(null);}} className="px-6 py-2 text-stone-500 font-bold hover:text-stone-700">Abbrechen</button>
                  <button type="submit" className="px-8 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md">
                    {isAddingCustomer ? 'Anlegen' : 'Speichern'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
             <table className="min-w-full divide-y divide-stone-200 text-sm">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Kunde</th>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Kontakt</th>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Adresse</th>
                    <th className="px-6 py-4 text-right font-bold text-stone-500 uppercase tracking-wider">Umsatz</th>
                    <th className="px-6 py-4 text-right font-bold text-stone-500 uppercase tracking-wider">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-800">{c.firstName} {c.lastName}</div>
                        <div className="text-xs text-stone-400">Seit {new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-stone-600">{c.email}</div>
                        <div className="text-stone-400 text-xs">{c.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-stone-600">{c.address}</div>
                        <div className="text-stone-400 text-xs">{c.zip} {c.city}</div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-700">
                        {getCustomerRevenue(c.email).toFixed(2)} €
                      </td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button onClick={() => setEditingCustomer(c)} className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors">Bearbeiten</button>
                        <button onClick={() => {if(confirm('Kunde wirklich löschen?')) onUpdateCustomers(customers.filter(cust => cust.id !== c.id))}} className="text-red-400 font-bold hover:text-red-600 transition-colors">Löschen</button>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                        Noch keine Kunden angelegt.
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-stone-800">Benutzerverwaltung</h3>
            {currentUser.role === 'admin' && !isAddingUser && !editingUser && (
              <button 
                onClick={() => {setEditingUser({ id: '', username: '', password: '', role: 'mitarbeiter', name: '' }); setIsAddingUser(true);}} 
                className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all shadow-sm"
              >
                + Neuer Benutzer
              </button>
            )}
          </div>

          {(isAddingUser || editingUser) && (
            <div className="bg-white p-8 rounded-2xl border-2 border-emerald-500 shadow-xl animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold mb-6">
                {isAddingUser ? 'Neuen Benutzer anlegen' : `Benutzer bearbeiten: ${editingUser?.username}`}
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (editingUser) {
                  if (isAddingUser) {
                    onUpdateUsers([...users, { ...editingUser, id: Math.random().toString(36).substr(2, 9) }]);
                  } else {
                    onUpdateUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
                  }
                }
                setIsAddingUser(false);
                setEditingUser(null);
              }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Name</label>
                    <input 
                      required 
                      value={editingUser?.name || ''} 
                      onChange={e => setEditingUser(editingUser ? {...editingUser, name: e.target.value} : null)} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Benutzername</label>
                    <input 
                      required 
                      value={editingUser?.username || ''} 
                      onChange={e => setEditingUser(editingUser ? {...editingUser, username: e.target.value} : null)} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Passwort</label>
                    <input 
                      type="password"
                      required 
                      value={editingUser?.password || ''} 
                      onChange={e => setEditingUser(editingUser ? {...editingUser, password: e.target.value} : null)} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Rolle</label>
                    <select 
                      disabled={currentUser.role !== 'admin'}
                      value={editingUser?.role || 'mitarbeiter'} 
                      onChange={e => setEditingUser(editingUser ? {...editingUser, role: e.target.value as any} : null)} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="admin">Administrator</option>
                      <option value="mitarbeiter">Mitarbeiter</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">E-Mail (intern)</label>
                    <input 
                      type="email"
                      value={editingUser?.email || ''} 
                      onChange={e => setEditingUser(editingUser ? {...editingUser, email: e.target.value} : null)} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="email@beispiel.de"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 mb-1">Telefon (intern)</label>
                    <input 
                      type="tel"
                      value={editingUser?.phone || ''} 
                      onChange={e => setEditingUser(editingUser ? {...editingUser, phone: e.target.value} : null)} 
                      className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="+49 123 456789"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button 
                    type="button" 
                    onClick={() => {setIsAddingUser(false); setEditingUser(null);}} 
                    className="px-6 py-2 text-stone-500 font-bold hover:text-stone-700"
                  >
                    Abbrechen
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-2 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-md"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-sm">
             <table className="min-w-full divide-y divide-stone-200 text-sm">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Kontakt</th>
                    <th className="px-6 py-4 text-left font-bold text-stone-500 uppercase tracking-wider">Rolle</th>
                    <th className="px-6 py-4 text-right font-bold text-stone-500 uppercase tracking-wider">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-stone-800">{u.name}</div>
                        <div className="text-xs text-stone-400">@{u.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-stone-600">{u.email || '-'}</div>
                        <div className="text-xs text-stone-500">{u.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-4">
                        {(currentUser.role === 'admin' || currentUser.id === u.id) && (
                          <button 
                            onClick={() => {setEditingUser(u); setIsAddingUser(false);}} 
                            className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors"
                          >
                            Bearbeiten
                          </button>
                        )}
                        {currentUser.role === 'admin' && u.id !== currentUser.id && (
                          <button 
                            onClick={() => {if(confirm('Benutzer wirklich löschen?')) onUpdateUsers(users.filter(user => user.id !== u.id))}} 
                            className="text-red-400 font-bold hover:text-red-600 transition-colors"
                          >
                            Löschen
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
