import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Header.css';

export default function Header() {
    const { cartCount } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    const showBack = location.pathname !== '/' && location.pathname !== '/menu';

    return (
        <header className="header">
            <div className="header__inner">
                <div className="header__brand">
                    {showBack && (
                        <button className="header__back-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="header__logo">🍽</div>
                    <div>
                        <div className="header__name">Akshar Fast Food</div>
                        <div className="header__tagline">Fresh • Fast • Delicious</div>
                    </div>
                </div>
                <div className="header__actions">
                    <button className="header__cart-btn" onClick={() => navigate('/cart')}>
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="header__cart-badge">{cartCount}</span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
