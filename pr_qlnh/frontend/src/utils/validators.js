export function validateImageFile(file, maxSizeMB = 2) {
    const validTypes = ["image/png", "image/jpg", "image/jpeg"]; 

    if (!validTypes.includes(file.type)) {
        return "Chỉ chấp nhận ảnh JPG, PNG";
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
        return `Dung lượng ảnh không vượt quá ${maxSizeMB}MB`;
    }

    return null;
}