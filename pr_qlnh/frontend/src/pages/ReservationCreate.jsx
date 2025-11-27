import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { notify } from "../utils/notify";
export default function ReservationCreate() {
    const [tables, setTables] = useState([]);

    const [form, setForm] = useState({
        table_id: "",
        reservation_date: "",
        reservation_time: "",
        num_guests: 1,
        deposit_amount: 0,
        note: "",
        status: "pending", // Mặc định user luôn pending
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const fetchTables = async () => {
        try {
            const res = await axiosClient.get("/tables?per_page=100");
            setTables(res.data.data);
        } catch (err) {
            console.log("Error:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tắt toast cũ trước
        notify.dismiss();

        try {
            // Hiện loading
            notify.info("Đang gửi yêu cầu...");

            await axiosClient.post("/reservations", form);

            // Xóa loading
            notify.dismiss();

            notify.success("Đặt bàn thành công!");

            // Reset form
            setForm({
                table_id: "",
                reservation_date: "",
                reservation_time: "",
                num_guests: 1,
                deposit_amount: 0,
                note: "",
                status: "pending"
            });

        } catch (err) {

            notify.dismiss(); // tắt loading nếu có

            console.log("ERRRR", err);

            // --- LỖI VALIDATE (422) có nhiều lỗi ---
            if (err.response && err.response.status === 422) {

                if (err.response.data.errors) {
                    const errors = err.response.data.errors;

                    Object.values(errors).forEach(msgArr => {
                        msgArr.forEach(msg => {
                            notify.error(msg);
                        });
                    });
                    return;
                }

                // --- Lỗi custom từ backend (dạng message) ---
                if (err.response.data.message) {
                    notify.error(err.response.data.message);
                    return;
                }
            }

            // --- Lỗi khác ---
            notify.error("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };


    useEffect(() => {
        fetchTables();
    }, []);

    return (
        <div className="p-6 flex justify-center">
            <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">
                <h1 className="text-2xl font-semibold text-center mb-6">Đặt Bàn</h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Table */}
                    <div className="flex flex-col max-w-sm mx-auto w-full">
                        <label className="font-medium mb-1">Chọn bàn</label>
                        <select
                            name="table_id"
                            value={form.table_id}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2"
                        >
                            <option value="">-- Chọn bàn --</option>
                            {tables.map((t) => (
                                <option key={t.table_id} value={t.table_id}>
                                    Bàn {t.table_name || t.table_id} ({t.capacity} người)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col max-w-sm mx-auto w-full">
                        <label className="font-medium mb-1">Ngày đặt</label>
                        <input
                            type="date"
                            name="reservation_date"
                            value={form.reservation_date}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Time */}
                    <div className="flex flex-col max-w-sm mx-auto w-full">
                        <label className="font-medium mb-1">Giờ đặt</label>
                        <input
                            type="time"
                            name="reservation_time"
                            value={form.reservation_time}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Guests */}
                    <div className="flex flex-col max-w-sm mx-auto w-full">
                        <label className="font-medium mb-1">Số khách</label>
                        <input
                            type="number"
                            min="1"
                            name="num_guests"
                            value={form.num_guests}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Deposit */}
                    <div className="flex flex-col max-w-sm mx-auto w-full">
                        <label className="font-medium mb-1">Tiền cọc (không bắt buộc)</label>
                        <input
                            type="number"
                            name="deposit_amount"
                            value={form.deposit_amount}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2"
                        />
                    </div>

                    {/* Note */}
                    <div className="flex flex-col max-w-md mx-auto w-full">
                        <label className="font-medium mb-1">Ghi chú</label>
                        <textarea
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            className="border rounded-lg px-3 py-2 h-24"
                        ></textarea>
                    </div>

                    {/* Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                        >
                            Xác nhận đặt bàn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
