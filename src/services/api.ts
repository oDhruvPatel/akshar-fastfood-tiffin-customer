// ============================================
// API Service — Akshar Fast Food Customer
// ============================================

// Hardcoded data for demonstration when backend is not hosted
const HARDCODED_MENU: MenuItem[] = [
    {
        id: '1',
        name: 'Paneer Tikka Panini',
        price: 8.99,
        category: 'Panini',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: true,
        color: '#ff9800',
        comment: 'Spicy paneer with bell peppers',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Veggie Paradise Panini',
        price: 7.49,
        category: 'Panini',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: false,
        color: '#4caf50',
        comment: 'Fresh veggies and pesto',
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Bombay Masala Sandwich',
        price: 6.99,
        category: 'Sandwiches',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: true,
        color: '#8bc34a',
        comment: 'Classic street style grill',
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Cheese Chutney Sandwich',
        price: 5.99,
        category: 'Sandwiches',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: false,
        color: '#cddc39',
        comment: 'Spicy mint chutney & cheese',
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Masala Chai',
        price: 2.49,
        category: 'Beverages',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: true,
        color: '#795548',
        comment: 'Hand-brewed with spices',
        createdAt: new Date().toISOString()
    },
    {
        id: '6',
        name: 'Cold Coffee',
        price: 4.99,
        category: 'Beverages',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: false,
        color: '#3e2723',
        comment: 'Creamy and refreshing',
        createdAt: new Date().toISOString()
    },
    {
        id: '7',
        name: 'Vada Pav',
        price: 3.99,
        category: 'Snacks',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: true,
        color: '#ffc107',
        comment: 'Spicy potato fritter in a bun',
        createdAt: new Date().toISOString()
    },
    {
        id: '8',
        name: 'Crispy Samosa (2pcs)',
        price: 4.49,
        category: 'Snacks',
        available: true,
        veg: true,
        outOfStock: false,
        bestseller: false,
        color: '#e65100',
        comment: 'Served with tamarind chutney',
        createdAt: new Date().toISOString()
    }
];

// ---------- Menu ----------
export interface MenuItem {
    id: string;
    name: string;
    price: number;
    category: string;
    available: boolean;
    veg: boolean;
    outOfStock: boolean;
    bestseller: boolean;
    color: string;
    comment?: string;
    createdAt: string;
}

export const menuApi = {
    list: async (params?: { category?: string; search?: string }) => {
        // Return hardcoded data for demonstration
        let items = [...HARDCODED_MENU];
        if (params?.category) {
            items = items.filter(i => i.category === params.category);
        }
        if (params?.search) {
            const s = params.search.toLowerCase();
            items = items.filter(i => i.name.toLowerCase().includes(s) || i.category.toLowerCase().includes(s));
        }
        return items;
    },
    getCategories: async () => {
        const cats = Array.from(new Set(HARDCODED_MENU.map(i => i.category)));
        return cats;
    },
};

// ---------- Orders ----------
export interface OrderItem {
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    orderId: string;
    customerName: string;
    phone: string;
    address: string;
    orderType: 'Delivery' | 'Pickup';
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export const ordersApi = {
    create: async (data: {
        customerName: string;
        phone: string;
        address: string;
        orderType: 'Delivery' | 'Pickup';
        items: OrderItem[];
    }) => {
        const mockOrder: Order = {
            id: 'mock-' + Date.now(),
            orderId: 'AK-' + Math.floor(Math.random() * 9000 + 1000),
            ...data,
            total: data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'Confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        return mockOrder;
    },
};
