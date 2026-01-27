/**
 * Compresses an image file and returns a Base64 string
 * @param {File} file - The original image file
 * @param {number} maxWidth - Maximum width (reduced for Firestore limits)
 * @param {number} maxHeight - Maximum height (reduced for Firestore limits)
 * @param {number} quality - Compression quality (0 to 1)
 * @returns {Promise<string>} - The compressed Base64 string
 */
export const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.6) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Return as Base64 string
                const base64 = canvas.toDataURL('image/jpeg', quality);
                resolve(base64);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
