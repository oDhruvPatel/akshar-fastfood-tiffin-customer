import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Truck, ShoppingBag, CreditCard, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ordersApi } from '../services/api';
import './Checkout.css';

export default function Checkout() {
    const {
        phone, customerName, address, setAddress,
        cart, cartTotal, clearCart,
    } = useApp();
    const navigate = useNavigate();

    const [orderType, setOrderType] = useState<'Delivery' | 'Pickup'>('Delivery');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!phone) {
        navigate('/', { replace: true });
        return null;
    }

    if (cart.length === 0) {
        navigate('/cart', { replace: true });
        return null;
    }

    const TAX_RATE = 0.13;
    const tax = cartTotal * TAX_RATE;
    const total = cartTotal + tax;

    const handlePlaceOrder = async () => {
        if (orderType === 'Delivery' && !address.trim()) {
            setError('Please enter a delivery address.');
            return;
        }
        if (!cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
            setError('Please fill in all payment details.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const order = await ordersApi.create({
                customerName,
                phone,
                address: orderType === 'Delivery' ? address.trim() : 'Pickup',
                orderType,
                items: cart.map(ci => ({
                    menuItemId: ci.menuItem.id,
                    name: ci.menuItem.name,
                    quantity: ci.quantity,
                    price: ci.menuItem.price,
                })),
            });

            clearCart();
            navigate('/confirmation', { state: { order } });
        } catch (err: any) {
            setError(err.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="checkout-page">
                <h2 className="checkout-page__title">Checkout</h2>

                {/* Order Type */}
                <div className="checkout-section">
                    <div className="checkout-section__title">Order Type</div>
                    <div className="checkout-page__type-toggle">
                        <button
                            className={`checkout-page__type-btn ${orderType === 'Delivery' ? 'active' : ''}`}
                            onClick={() => setOrderType('Delivery')}
                        >
                            <Truck size={18} /> Delivery
                        </button>
                        <button
                            className={`checkout-page__type-btn ${orderType === 'Pickup' ? 'active' : ''}`}
                            onClick={() => setOrderType('Pickup')}
                        >
                            <ShoppingBag size={18} /> Pickup
                        </button>
                    </div>

                    {orderType === 'Delivery' && (
                        <div className="form-group">
                            <label>Delivery Address</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="123 Main Street, Apt 4B"
                                    value={address}
                                    onChange={(e) => { setAddress(e.target.value); setError(''); }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment */}
                <div className="checkout-section">
                    <div className="checkout-section__title">
                        <CreditCard size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                        Payment Details
                    </div>
                    <div className="form-group">
                        <label>Card Number</label>
                        <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            maxLength={19}
                        />
                    </div>
                    <div className="checkout-page__card-row">
                        <div className="form-group">
                            <label>Expiry</label>
                            <input
                                type="text"
                                placeholder="MM/YY"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                maxLength={5}
                            />
                        </div>
                        <div className="form-group">
                            <label>CVV</label>
                            <input
                                type="text"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength={4}
                            />
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="checkout-section">
                    <div className="checkout-section__title">Order Summary</div>
                    <div className="checkout-page__items">
                        {cart.map(({ menuItem, quantity }) => (
                            <div className="checkout-page__item" key={menuItem.id}>
                                <div>
                                    <span className="checkout-page__item-name">{menuItem.name}</span>
                                    <span className="checkout-page__item-qty"> × {quantity}</span>
                                </div>
                                <span className="checkout-page__item-price">
                                    ${(menuItem.price * quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-page__total-section">
                        <div className="checkout-page__total-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="checkout-page__total-row">
                            <span>Tax (13%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="checkout-page__total-row checkout-page__total-row--final">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {error && <div className="checkout-page__error">{error}</div>}

                <div className="checkout-page__actions">
                    <button
                        className="checkout-page__place-btn"
                        onClick={handlePlaceOrder}
                        disabled={loading}
                    >
                        <Lock size={16} />
                        {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
