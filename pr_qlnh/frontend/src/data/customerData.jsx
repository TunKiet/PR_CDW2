// src/data/customerData.js (Tạo file này để quản lý data)

export const initialCustomersData = [
    {
        id: 'KH001',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        totalSpent: 12500000,
        points: 1250,
        rank: 'Kim Cương',
    },
    {
        id: 'KH002',
        name: 'Trần Thị B',
        phone: '0987654321',
        totalSpent: 7800000,
        points: 780,
        rank: 'Vàng',
    },
    {
        id: 'KH003',
        name: 'Lê Văn C',
        phone: '0912345678',
        totalSpent: 3200000,
        points: 320,
        rank: 'Bạc',
    },
    {
        id: 'KH004',
        name: 'Phạm Thị D',
        phone: '0909090909',
        totalSpent: 1500000,
        points: 150,
        rank: 'Bạc',
    },
    {
        id: 'KH005',
        name: 'Hoàng Văn E',
        phone: '0977777777',
        totalSpent: 500000,
        points: 50,
        rank: 'Bạc',
    },
];

export const formatCurrency = (amount) => {
    return Number(amount).toLocaleString('vi-VN') + ' đ';
};

export const getRankColor = (rank) => {
    switch (rank) {
        case 'Kim Cương': return 'bg-blue-100 text-blue-700';
        case 'Vàng': return 'bg-yellow-100 text-yellow-700';
        case 'Bạc': return 'bg-gray-200 text-gray-700';
        default: return 'bg-gray-100 text-gray-500';
    }
};