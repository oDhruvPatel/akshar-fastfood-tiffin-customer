import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Minus, ShoppingCart, ChevronRight } from 'lucide-react';
import { menuApi } from '../services/api';
import type { MenuItem } from '../services/api';
import { useApp } from '../context/AppContext';
import './Menu.css';

export default function Menu() {
    const { cart, addToCart, updateQuantity, cartCount, cartTotal, phone } = useApp();
    const navigate = useNavigate();

    const [categories, setCategories] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('');
    const [items, setItems] = useState<MenuItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Redirect to welcome if no phone
    useEffect(() => {
        if (!phone) navigate('/', { replace: true });
    }, [phone, navigate]);

    useEffect(() => {
        menuApi.getCategories().then((cats) => {
            setCategories(cats);
            if (cats.length > 0) setActiveTab(cats[0]);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (!activeTab) return;
        const params: { category?: string; search?: string } = { category: activeTab };
        if (searchQuery) params.search = searchQuery;
        menuApi.list(params).then(setItems).catch(console.error);
    }, [activeTab, searchQuery]);

    const getCartQty = (itemId: string) => {
        const ci = cart.find(c => c.menuItem.id === itemId);
        return ci ? ci.quantity : 0;
    };

    return (
        <div className="page">
            {/* Category Tabs */}
            <div className="menu-page__tabs">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`menu-page__tab ${activeTab === cat ? 'active' : ''}`}
                        onClick={() => setActiveTab(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="menu-page__search">
                <div className="menu-page__search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Food Grid */}
            <div className="menu-page__grid">
                {items.length === 0 ? (
                    <div className="menu-page__empty">
                        <div className="menu-page__empty-icon">🍽</div>
                        <h3>No dishes found</h3>
                        <p>Try a different category or search term</p>
                    </div>
                ) : (
                    items.map(item => {
                        const qty = getCartQty(item.id);
                        const unavailable = !item.available || item.outOfStock;

                        return (
                            <div
                                className={`food-card ${unavailable ? 'is-unavailable' : ''}`}
                                key={item.id}
                            >
                                <div
                                    className="food-card__image"
                                    style={{ background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)` }}
                                >
                                    🍽
                                    <div className="food-card__badges">
                                        {item.veg && <span className="food-card__veg">VEG</span>}
                                        {item.bestseller && <span className="food-card__bestseller">★ BEST</span>}
                                    </div>
                                    {unavailable && <span className="food-card__unavailable-tag">UNAVAILABLE</span>}
                                </div>
                                <div className="food-card__info">
                                    <div className="food-card__name">{item.name}</div>
                                    {item.comment && (
                                        <div className="food-card__comment">"{item.comment}"</div>
                                    )}
                                    <div className="food-card__bottom">
                                        <div className="food-card__price">${item.price.toFixed(2)}</div>
                                        {!unavailable && (
                                            qty === 0 ? (
                                                <button
                                                    className="food-card__add-btn"
                                                    onClick={() => addToCart(item)}
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            ) : (
                                                <div className="food-card__qty-controls">
                                                    <button
                                                        className="food-card__qty-btn"
                                                        onClick={() => updateQuantity(item.id, qty - 1)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="food-card__qty">{qty}</span>
                                                    <button
                                                        className="food-card__qty-btn"
                                                        onClick={() => updateQuantity(item.id, qty + 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Floating Cart Bar */}
            {cartCount > 0 && (
                <div className="menu-page__cart-bar" onClick={() => navigate('/cart')}>
                    <div className="menu-page__cart-bar-left">
                        <div className="menu-page__cart-bar-count">{cartCount}</div>
                        <div className="menu-page__cart-bar-text">
                            <ShoppingCart size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                            View Cart
                        </div>
                    </div>
                    <div className="menu-page__cart-bar-total">
                        ${cartTotal.toFixed(2)} <ChevronRight size={18} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    </div>
                </div>
            )}
        </div>
    );
}
