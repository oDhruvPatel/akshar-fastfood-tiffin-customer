import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Welcome.css';

export default function Welcome() {
    const { setPhone, setCustomerName } = useApp();
    const navigate = useNavigate();
    const [nameInput, setNameInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');
    const [error, setError] = useState('');

    const handleStart = () => {
        if (!nameInput.trim()) {
            setError('Please enter your name.');
            return;
        }
        if (!phoneInput.trim() || phoneInput.trim().length < 7) {
            setError('Please enter a valid phone number.');
            return;
        }
        setCustomerName(nameInput.trim());
        setPhone(phoneInput.trim());
        navigate('/menu');
    };

    return (
        <div className="welcome">
            <div className="welcome__content">
                <div className="welcome__logo">🍽</div>
                <h1 className="welcome__title">Akshar Fast Food</h1>
                <p className="welcome__subtitle">Fresh food, delivered fast to your door</p>

                <div className="welcome__form">
                    <div className="welcome__input-group welcome__name-input">
                        <User size={20} className="welcome__input-icon" />
                        <input
                            className="welcome__input"
                            type="text"
                            placeholder="Your Name"
                            value={nameInput}
                            onChange={(e) => { setNameInput(e.target.value); setError(''); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        />
                    </div>

                    <div className="welcome__input-group welcome__phone-input">
                        <Phone size={20} className="welcome__input-icon" />
                        <input
                            className="welcome__input"
                            type="tel"
                            placeholder="Phone Number"
                            value={phoneInput}
                            onChange={(e) => { setPhoneInput(e.target.value); setError(''); }}
                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                        />
                    </div>

                    {error && <div className="welcome__error">{error}</div>}

                    <button
                        className="welcome__btn"
                        onClick={handleStart}
                        disabled={!nameInput.trim() || !phoneInput.trim()}
                    >
                        Start Ordering <ArrowRight size={18} />
                    </button>
                </div>

                <p className="welcome__footer">Tiffin • Extras • Sides — all your favourites</p>
            </div>
        </div>
    );
}
