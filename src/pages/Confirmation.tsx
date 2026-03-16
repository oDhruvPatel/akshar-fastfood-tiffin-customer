import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import type { Order } from '../services/api';
import './Confirmation.css';

export default function Confirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = (location.state as { order?: Order })?.order;

    if (!order) {
        return (
            <div className="page">
                <div className="confirmation-page">
                    <div className="confirmation-page__icon">
                        <CheckCircle size={48} color="var(--color-success)" />
                    </div>
                    <h1 className="confirmation-page__title">No Order Found</h1>
                    <p className="confirmation-page__subtitle">
                        It looks like you haven't placed an order yet.
                    </p>
                    <div className="confirmation-page__actions">
                        <button className="btn-primary" onClick={() => navigate('/menu')}>
                            Browse Menu <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="confirmation-page">
                <div className="confirmation-page__icon">
                    <CheckCircle size={48} color="var(--color-success)" />
                </div>
                <h1 className="confirmation-page__title">Order Placed!</h1>
                <p className="confirmation-page__subtitle">
                    Thank you, {order.customerName}! Your order is being prepared.
                </p>

                <div className="confirmation-page__status">
                    <Clock size={16} /> {order.status}
                </div>

                <div className="confirmation-page__order-card">
                    <div className="confirmation-page__order-id">
                        Order {order.orderId}
                    </div>

                    {order.items.map((item, i) => (
                        <div className="confirmation-page__order-row" key={i}>
                            <span>{item.name} × {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}

                    <div className="confirmation-page__total-row">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                </div>

                <div className="confirmation-page__actions">
                    <button className="btn-primary" onClick={() => navigate('/menu')}>
                        Order Again <ArrowRight size={16} />
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
