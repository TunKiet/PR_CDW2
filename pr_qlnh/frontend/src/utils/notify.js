import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

//Thông báo nhanh (toast)
export const notify = {
    success: (msg = 'Thành công!') => toast.success(msg),
    error: (msg = 'Đã xảy ra lỗi!') => toast.error(msg),
    info: (msg = 'Đang xử lý...') => toast.loading(msg),
    dismiss: () => toast.dismiss(), // tắt tất cả toast
}

//Hộp thoại xác nhận (SweetAlert2)
export const confirmAction = async (title = 'Bạn có chắc chắn?', text = '') => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy',
    })
    return result.isConfirmed
}

//Hộp thoại xác nhận
export const confirmDialog = async (title, message = "") => {
    const result = await Swal.fire({
        title,
        text: message,
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        showCancelButton: true,
        cancelButtonText: "Hủy",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
    });

    return result.isConfirmed;
};

export const confirmSuccess = async (title, message = "") => {
    const result = await Swal.fire({
        title,
        text: message,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
    });

    return result.isConfirmed;
};

