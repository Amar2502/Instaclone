import imageCompression from "browser-image-compression";

export async function cropToSquareAndCompress(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = async () => {
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const squareFile = new File([blob], file.name, { type: file.type });

          const compressedFile = await imageCompression(squareFile, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 512,
            useWebWorker: true,
          });

          resolve(compressedFile);
        }, file.type);
      };
    };
  });
}
