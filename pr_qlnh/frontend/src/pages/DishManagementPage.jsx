// SAU KHI TẠO THƯ MỤC
import React, { useState, useEffect, useCallback } from 'react';
// CẬP NHẬT ĐƯỜNG DẪN TƯƠNG ĐỐI
import DishTable from '../components/08_hao_qlmonan/DishTable';
import DetailDishModal from '../components/08_hao_qlmonan/DetailDishModal';
import AddDishModal from '../components/08_hao_qlmonan/AddDishModal'; 

// ... phần code còn lại giữ nguyên ...

const DishManagementPage = () => {
    // 1. Trạng thái Dữ liệu (Khởi tạo Rỗng)
    const [dishes, setDishes] = useState([]);
    const [filteredDishes, setFilteredDishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
    
    // 2. Trạng thái Bộ lọc
    const [filters, setFilters] = useState({
        searchTerm: '',
        category: '',
        status: '',
        minPrice: 0,
        maxPrice: Infinity
    });
    
    // 3. Trạng thái Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [detailDish, setDetailDish] = useState(null); 

    // ** GIẢ LẬP GỌI API **
    // Hàm này sẽ thay thế bằng cuộc gọi Axios/fetch thực tế đến Laravel API
    useEffect(() => {
        const fetchDishes = async () => {
            setIsLoading(true);
            try {
                // Thay thế dòng này bằng: 
                // const response = await axios.get('/api/dishes');
                // setDishes(response.data);
                
                // Giả lập độ trễ API và dữ liệu rỗng
                await new Promise(resolve => setTimeout(resolve, 800)); 
                setDishes([]); 
                
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                setDishes([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDishes();
    }, []); // Chỉ gọi 1 lần khi component được mount

    // 4. Hàm Lọc (Vẫn giữ lại logic lọc, nhưng sẽ chạy trên mảng `dishes` rỗng ban đầu)
    const applyFilters = useCallback(() => {
        // ... Logic lọc giữ nguyên ...
        if (isLoading) return; // Không lọc nếu đang tải
        
        const { searchTerm, category, status, minPrice, maxPrice } = filters;
        
        const search = searchTerm.toLowerCase().trim();
        const minP = parseFloat(minPrice) || 0;
        const maxP = parseFloat(maxPrice) || Infinity;

        const data = dishes.filter(dish => {
            const matchesSearch = search === '' || 
                                  (dish.name && dish.name.toLowerCase().includes(search)) || 
                                  (dish.id && dish.id.toLowerCase().includes(search));
            
            const matchesCategory = category === '' || dish.categoryKey === category;
            const matchesStatus = status === '' || dish.statusKey === status;
            const matchesPrice = dish.price >= minP && dish.price <= maxP;
            
            return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
        });

        setFilteredDishes(data);
    }, [dishes, filters, isLoading]);

    // Chạy lọc khi bộ lọc hoặc dữ liệu dishes thay đổi
    useEffect(() => {
        applyFilters();
    }, [filters, dishes, applyFilters]);

    // 5. Xử lý Thay đổi Bộ lọc (Giữ nguyên)
    const handleFilterChange = (e) => {
        const { id, value } = e.target;
        // ... Logic ánh xạ filterKeyMap giữ nguyên ...
        const filterKeyMap = {
            'search-input': 'searchTerm',
            'category-filter': 'category',
            'status-filter': 'status',
            'min-price-input': 'minPrice',
            'max-price-input': 'maxPrice',
        };
        setFilters(prev => ({
            ...prev,
            [filterKeyMap[id]]: id.includes('price') ? (value === '' ? '' : parseFloat(value)) : value 
        }));
    };
    
    // 6. Xử lý Modal (Giữ nguyên)
    const openDetailsModal = (dishId) => {
        const dish = dishes.find(d => d.id === dishId);
        setDetailDish(dish);
    };

    const saveNewDish = (newDish) => {
        // ** TẠI ĐÂY BẠN SẼ GỌI API POST ĐỂ LƯU MÓN ĂN MỚI **
        console.log("Sẵn sàng gọi API POST để lưu món ăn mới:", newDish);
        // Sau khi gọi API thành công, bạn nên gọi lại hàm fetchDishes để tải lại dữ liệu mới nhất.
        setIsAddModalOpen(false);
    };
    
    // 7. JSX cho Giao diện
    return (
        <div id="dishes-view" className="bg-white p-6 rounded-xl shadow-lg transition-opacity duration-300">
            {/* Thanh Công cụ */}
            <div className="flex justify-start mb-6">
                <button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition duration-150">
                    <span>Thêm Món Ăn Mới</span>
                </button>
            </div>

            {/* Khung Tìm kiếm Nâng cao (Giữ nguyên) */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                {/* ... Các input filter giữ nguyên với handleFilterChange ... */}
            </div>

            {/* Bảng Danh sách Món ăn */}
            {/* Truyền trạng thái isLoading vào component DishTable */}
            <DishTable dishes={filteredDishes} openDetailsModal={openDetailsModal} isLoading={isLoading} />

            {/* Phân trang (Placeholder) */}
            <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
                <span>{`Đang hiển thị ${filteredDishes.length} trên tổng số ${dishes.length} kết quả.`}</span>
                {/* ... Các nút phân trang tĩnh ... */}
            </div>
            
            {/* Modals */}
            <AddDishModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={saveNewDish} />
            <DetailDishModal dish={detailDish} onClose={() => setDetailDish(null)} />
        </div>
    );
};

export default DishManagementPage;