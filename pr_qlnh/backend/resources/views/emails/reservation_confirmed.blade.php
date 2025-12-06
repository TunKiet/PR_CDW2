@component('mail::message')
# Xác nhận đặt bàn thành công!

Xin chào **{{ $reservation->customer_name ?? 'Quý khách' }}**,

Đơn đặt bàn của bạn đã được **xác nhận thành công**.

---

### 📌 Thông tin đặt bàn:

- **Bàn:** {{ $reservation->table_id }}
- **Ngày:** {{ $reservation->reservation_date }}
- **Giờ:** {{ $reservation->reservation_time }}
- **Số khách:** {{ $reservation->num_guests }}

---

Cảm ơn bạn đã tin tưởng và đặt bàn tại nhà hàng.  
Chúng tôi rất hân hạnh được phục vụ bạn!

Trân trọng,  
**{{ config('app.name', 'Nhà hàng') }}**
@endcomponent
