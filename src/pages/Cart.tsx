import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Cart.css';

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, cartTotal, phone } = useApp();
    const navigate = useNavigate();

    // Redirect if no phone
    if (!phone) {
        navigate('/', { replace: true });
        return null;
    }

    const TAX_RATE = 0.13;
    const tax = cartTotal * TAX_RATE;
    const total = cartTotal + tax;

    if (cart.length === 0) {
        return (
            <div className="page">
                <div className="cart-page">
                    <div className="cart-page__empty">
                        <div className="cart-page__empty-icon">🛒</div>
                        <h3>Your cart is empty</h3>
                        <p>Browse our menu and add some delicious items!</p>
                        <button className="btn-primary" onClick={() => navigate('/menu')}>
                            <ShoppingBag size={18} />
                            Browse Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="cart-page">
                <h2 className="cart-page__title">Your Cart</h2>

                <div className="cart-page__items">
                    {cart.map(({ menuItem, quantity }) => (
                        <div className="cart-item" key={menuItem.id}>
                            <div
                                className="cart-item__image"
                                style={{ background: `linear-gradient(135deg, ${menuItem.color}40, ${menuItem.color}20)` }}
                            >
                                🍽
                            </div>
                            <div className="cart-item__details">
                                <div className="cart-item__name">{menuItem.name}</div>
                                <div className="cart-item__price">${menuItem.price.toFixed(2)} each</div>
                            </div>
                            <div className="cart-item__right">
                                <div className="cart-item__total">
                                    ${(menuItem.price * quantity).toFixed(2)}
                                </div>
                                <div className="cart-item__qty">
                                    <button
                                        className="cart-item__qty-btn"
                                        onClick={() => updateQuantity(menuItem.id, quantity - 1)}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span className="cart-item__qty-value">{quantity}</span>
                                    <button
                                        className="cart-item__qty-btn"
                                        onClick={() => updateQuantity(menuItem.id, quantity + 1)}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    className="cart-item__remove"
                                    onClick={() => removeFromCart(menuItem.id)}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="cart-page__summary">
                    <div className="cart-page__summary-title">Order Summary</div>
                    <div className="cart-page__summary-row">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="cart-page__summary-row">
                        <span>Tax (13%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="cart-page__summary-row cart-page__summary-row--total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="cart-page__actions">
                    <button className="btn-primary" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/menu')}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
