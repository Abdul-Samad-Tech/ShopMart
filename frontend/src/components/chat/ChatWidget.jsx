import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, KeyRound, Search, ShoppingBag, Tag, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../../services/api';
import { formatPrice } from '../../utils/helpers';

const STORAGE_KEY = 'shophub_gemini_api_key';
const WELCOME = 'Hi! I\'m your personal shopping assistant. I can help you find products, discover deals, or answer any questions. What are you looking for today?';

const QUICK_ACTIONS = [
  { icon: Search, label: 'Find products', query: 'Show me products under Rs. 50' },
  { icon: ShoppingBag, label: 'Best sellers', query: 'What are your best selling products?' },
  { icon: Tag, label: 'Deals', query: 'Show me current deals and discounts' },
  { icon: TrendingUp, label: 'New arrivals', query: 'What\'s new in the store?' },
];

const loadStoredKey = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

const isUsableStoredKey = (k) => k && k.length >= 20 && !/PASTE_YOUR|placeholder/i.test(k);

const ChatWidget = () => {
  const navigate = useNavigate();
  const { filteredProducts } = useSelector((state) => state.products);
  const [open, setOpen] = useState(false);
  const [keyHint, setKeyHint] = useState(null);
  const [storedKey, setStoredKey] = useState(loadStoredKey);
  const [keyInput, setKeyInput] = useState('');
  const [showKeySetup, setShowKeySetup] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const activeKey = isUsableStoredKey(storedKey) ? storedKey : '';

  const searchProducts = async (query) => {
    try {
      const { data } = await apiEndpoints.searchProducts(query);
      return data.slice(0, 5);
    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  };

  const processCommand = async (text) => {
    const lowerText = text.toLowerCase();
    
    // Product search commands
    if (lowerText.includes('find') || lowerText.includes('search') || lowerText.includes('show me') || lowerText.includes('looking for')) {
      const searchQuery = text.replace(/find|search|show me|looking for/gi, '').trim();
      if (searchQuery) {
        const results = await searchProducts(searchQuery);
        if (results.length > 0) {
          setSearchResults(results);
          return `I found ${results.length} products matching "${searchQuery}". Here are the top results:`;
        } else {
          return `I couldn't find any products matching "${searchQuery}". Try a different search term or browse our categories.`;
        }
      }
    }

    // Price-based search
    if (lowerText.includes('under') || lowerText.includes('below') || lowerText.includes('less than')) {
      const priceMatch = text.match(/\$?(\d+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        const results = filteredProducts.filter(p => p.price <= maxPrice).slice(0, 5);
        if (results.length > 0) {
          setSearchResults(results);
          return `I found ${results.length} products under Rs. ${maxPrice}:`;
        } else {
          return `I couldn't find any products under Rs. ${maxPrice}. Would you like to see products in a different price range?`;
        }
      }
    }

    // Category-based search
    if (lowerText.includes('category') || lowerText.includes('department')) {
      navigate('/categories');
      return 'Opening categories page to help you browse by department...';
    }

    // Navigation commands
    if (lowerText.includes('home') || lowerText.includes('homepage')) {
      navigate('/');
      return 'Navigating to home page...';
    }
    if (lowerText.includes('product') || lowerText.includes('shop')) {
      navigate('/products');
      return 'Opening products page...';
    }
    if (lowerText.includes('cart')) {
      navigate('/cart');
      return 'Opening your cart...';
    }
    if (lowerText.includes('login') || lowerText.includes('sign in')) {
      navigate('/login');
      return 'Opening login page...';
    }
    if (lowerText.includes('register') || lowerText.includes('sign up') || lowerText.includes('create account')) {
      navigate('/register');
      return 'Opening registration page...';
    }
    if (lowerText.includes('dashboard') || lowerText.includes('my account')) {
      navigate('/dashboard');
      return 'Opening your dashboard...';
    }
    if (lowerText.includes('about')) {
      navigate('/about');
      return 'Opening about us page...';
    }
    if (lowerText.includes('contact')) {
      navigate('/contact');
      return 'Opening contact page...';
    }
    if (lowerText.includes('career') || lowerText.includes('job')) {
      navigate('/careers');
      return 'Opening careers page...';
    }
    if (lowerText.includes('brand')) {
      navigate('/brands');
      return 'Opening brands page...';
    }
    if (lowerText.includes('store') || lowerText.includes('location')) {
      navigate('/stores');
      return 'Opening store locator...';
    }
    if (lowerText.includes('blog')) {
      navigate('/blog');
      return 'Opening blog...';
    }
    if (lowerText.includes('loyalty') || lowerText.includes('reward') || lowerText.includes('point')) {
      navigate('/loyalty');
      return 'Opening loyalty program...';
    }
    if (lowerText.includes('gift card')) {
      navigate('/gift-cards');
      return 'Opening gift cards page...';
    }
    if (lowerText.includes('return') || lowerText.includes('refund')) {
      navigate('/return-policy');
      return 'Opening return policy...';
    }
    
    // Help commands
    if (lowerText.includes('help') || lowerText.includes('what can you do')) {
      setSearchResults(null);
      return `I can help you with:\n• Find products by name or category\n• Search within your budget\n• Discover deals and discounts\n• Navigate to any page\n• Answer questions about orders\n\nTry asking: "Find products under Rs. 50" or "Show me best sellers"`;
    }
    
    return null; // No command matched, send to AI
  };

  const refreshStatus = useCallback(() => {
    apiEndpoints
      .getChatStatus(activeKey || undefined)
      .then(({ data }) => setKeyHint(data.keyHint ?? 'missing'))
      .catch(() => setKeyHint(null));
  }, [activeKey]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  useEffect(() => {
    if (keyHint && keyHint !== 'ok' && !activeKey) setShowKeySetup(true);
  }, [keyHint, activeKey]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open, showKeySetup]);

  const saveApiKey = async () => {
    const k = keyInput.trim();
    if (k.length < 20) {
      setError('Paste the full API key from Google AI Studio.');
      return;
    }
    setSavingKey(true);
    setError('');
    try {
      await apiEndpoints.validateChatKey(k);
      localStorage.setItem(STORAGE_KEY, k);
      setStoredKey(k);
      setKeyInput('');
      setShowKeySetup(false);
      setKeyHint('ok');
      refreshStatus();
    } catch (err) {
      setError(err.response?.data?.message || 'Key was rejected. Create a new key at aistudio.google.com/apikey');
    } finally {
      setSavingKey(false);
    }
  };

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError('');
    setSearchResults(null);
    const userMsg = { role: 'user', content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    // Check for local commands first
    const commandResponse = await processCommand(text);
    if (commandResponse) {
      setMessages((prev) => [...prev, { role: 'assistant', content: commandResponse }]);
      setLoading(false);
      inputRef.current?.focus();
      return;
    }

    // If no command matched, send to AI
    if (!activeKey && keyHint !== 'ok') {
      setShowKeySetup(true);
      setError('Save a valid Gemini API key first (or set GEMINI_API_KEY in .env).');
      setLoading(false);
      return;
    }

    try {
      const history = nextMessages
        .slice(1, -1)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const { data } = await apiEndpoints.sendChatMessage({ message: text, history }, activeKey || undefined);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      setKeyHint('ok');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach assistant.');
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
      if (String(err.response?.data?.message || '').includes('missing')) setShowKeySetup(true);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (query) => {
    setInput(query);
    inputRef.current?.focus();
  };

  const ready = keyHint === 'ok' || Boolean(activeKey);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-24 right-4 sm:right-6 z-[200] w-[min(100vw-2rem,420px)] h-[min(80vh,600px)] flex flex-col rounded-3xl shadow-2xl border border-neutral-200 bg-white overflow-hidden pointer-events-auto"
          >
            <header className="flex items-center gap-3 px-5 py-4 bg-neutral-900 text-white shrink-0">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Shopping Assistant</p>
                <p className="text-[10px] text-white/60 uppercase tracking-wider">
                  {ready ? 'Online' : 'Setup required'}
                </p>
              </div>
              <button type="button" onClick={() => setShowKeySetup((v) => !v)} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="API key">
                <KeyRound className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </header>

            <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-neutral-50">
              {/* Quick Actions */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.query)}
                      className="flex items-center gap-2 p-3 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all text-left"
                    >
                      <action.icon className="w-4 h-4 text-neutral-600" />
                      <span className="text-xs font-medium text-neutral-700">{action.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}

              {(showKeySetup || !ready) && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-3">
                  <p className="text-xs font-semibold text-neutral-900">Gemini API key</p>
                  <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-[11px] text-neutral-600 underline">
                    Get key from AI Studio
                  </a>
                  <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:border-neutral-400"
                  />
                  <button
                    type="button"
                    onClick={saveApiKey}
                    disabled={savingKey || !keyInput.trim()}
                    className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                  >
                    {savingKey ? 'Testing…' : 'Save key'}
                  </button>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      m.role === 'user' 
                        ? 'bg-neutral-900 text-white' 
                        : 'bg-white border border-neutral-200 text-neutral-800 shadow-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Search Results */}
              {searchResults && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all group"
                    >
                      <div className="w-16 h-16 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                        <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{product.name}</p>
                        <p className="text-xs text-ink-muted">{formatPrice(product.price)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                    </Link>
                  ))}
                </motion.div>
              )}

              {loading && <p className="text-xs text-neutral-500 animate-pulse">Searching…</p>}
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <form onSubmit={send} className="p-4 border-t border-neutral-200 bg-white shrink-0">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send(e);
                    }
                  }}
                  placeholder={ready ? 'Find products, ask about deals...' : 'Configure API key'}
                  disabled={loading}
                  className="flex-1 min-h-[44px] rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-neutral-400 resize-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-11 h-11 rounded-xl bg-neutral-900 text-white flex items-center justify-center disabled:opacity-40 transition-colors hover:bg-neutral-800"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-4 sm:right-6 z-[200] w-14 h-14 rounded-full bg-neutral-900 text-white shadow-lg flex items-center justify-center hover:bg-neutral-800 transition-colors"
        aria-label="Open chat"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
};

export default ChatWidget;
