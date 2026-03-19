const API_BASE_URL = 'http://localhost:4000/api';

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
        try {
            const response = await fetch(`${API_BASE_URL}/menu`);
            if (!response.ok) throw new Error('Failed to fetch menu');
            const data = await response.json();
            
            let items = data.map((item: any) => ({
                ...item,
                id: item._id // Map MongoDB's _id to id for frontend
            }));

            if (params?.category) {
                items = items.filter((i: MenuItem) => i.category === params.category);
            }
            if (params?.search) {
                const s = params.search.toLowerCase();
                items = items.filter((i: MenuItem) => i.name.toLowerCase().includes(s) || i.category.toLowerCase().includes(s));
            }
            return items;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
    getCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/menu`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            const cats = Array.from(new Set(data.map((i: any) => i.category))) as string[];
            return cats;
        } catch (error) {
            console.error(error);
            return [];
        }
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
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create order');
            const result = await response.json();
            return {
                ...result,
                id: result._id // Map MongoDB's _id to id for frontend
            } as Order;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
};
