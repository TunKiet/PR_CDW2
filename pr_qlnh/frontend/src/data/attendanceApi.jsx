import axiosClient from "../api/axiosClient";

/**
 * API cho chức năng chấm công
 */

// Chấm công vào
export const checkIn = async (userId) => {
  try {
    const response = await axiosClient.post("/attendance/check-in", {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Chấm công ra
export const checkOut = async (userId) => {
  try {
    const response = await axiosClient.post("/attendance/check-out", {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy trạng thái chấm công hôm nay
export const getTodayStatus = async (userId) => {
  try {
    const response = await axiosClient.post("/attendance/today-status", {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy danh sách chấm công theo tháng
export const getMonthlyAttendance = async (userId, month, year) => {
  try {
    const response = await axiosClient.get("/attendance/monthly", {
      params: { user_id: userId, month, year },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy tổng giờ làm việc trong tuần
export const getWeeklyHours = async (userId, startDate, endDate) => {
  try {
    const response = await axiosClient.get("/attendance/weekly", {
      params: { user_id: userId, start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy tất cả chấm công (Admin/Manager)
export const getAllAttendances = async (filters = {}) => {
  try {
    const response = await axiosClient.get("/attendance", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy chi tiết một bản ghi chấm công
export const getAttendanceById = async (id) => {
  try {
    const response = await axiosClient.get(`/attendance/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tạo bản ghi chấm công thủ công (Admin/Manager)
export const createAttendance = async (data) => {
  try {
    const response = await axiosClient.post("/attendance", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Cập nhật chấm công (Admin/Manager)
export const updateAttendance = async (id, data) => {
  try {
    const response = await axiosClient.put(`/attendance/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Xóa chấm công (Admin/Manager)
export const deleteAttendance = async (id) => {
  try {
    const response = await axiosClient.delete(`/attendance/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Lấy báo cáo chấm công tổng hợp
export const getAttendanceReport = async (month, year) => {
  try {
    const response = await axiosClient.get("/attendance/report", {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
