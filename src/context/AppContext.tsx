import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { MenuItem } from '../services/api';

export interface CartItem {
    menuItem: MenuItem;
    quantity: number;
}

interface AppContextType {
    phone: string;
    setPhone: (phone: string) => void;
    address: string;
    setAddress: (address: string) => void;
    customerName: string;
    setCustomerName: (name: string) => void;
    cart: CartItem[];
    addToCart: (item: MenuItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((item: MenuItem) => {
        setCart(prev => {
            const existing = prev.find(ci => ci.menuItem.id === item.id);
            if (existing) {
                return prev.map(ci =>
                    ci.menuItem.id === item.id
                        ? { ...ci, quantity: ci.quantity + 1 }
                        : ci
                );
            }
            return [...prev, { menuItem: item, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            setCart(prev => prev.filter(ci => ci.menuItem.id !== itemId));
        } else {
            setCart(prev =>
                prev.map(ci =>
                    ci.menuItem.id === itemId ? { ...ci, quantity } : ci
                )
            );
        }
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const cartTotal = cart.reduce(
        (sum, ci) => sum + ci.menuItem.price * ci.quantity,
        0
    );

    const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

    return (
        <AppContext.Provider
            value={{
                phone, setPhone,
                address, setAddress,
                customerName, setCustomerName,
                cart, addToCart, removeFromCart, updateQuantity, clearCart,
                cartTotal, cartCount,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within an AppProvider');
    return context;
}
