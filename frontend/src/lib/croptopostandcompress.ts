import imageCompression from "browser-image-compression";

export async function cropToPostAndCompress(
  file: File
): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.onload = async () => {
        const aspectRatio = 4 / 5; // Width:Height (portrait)
        const { width: originalW, height: originalH } = img;

        // Calculate crop dimensions
        let cropWidth = originalW;
        let cropHeight = cropWidth / aspectRatio;

        if (cropHeight > originalH) {
          cropHeight = originalH;
          cropWidth = cropHeight * aspectRatio;
        }

        const offsetX = (originalW - cropWidth) / 2;
        const offsetY = (originalH - cropHeight) / 2;

        const canvas = document.createElement("canvas");
        const outputWidth = 1080;
        const outputHeight = 1350;

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          cropWidth,
          cropHeight,
          0,
          0,
          outputWidth,
          outputHeight
        );

        canvas.toBlob(async (blob) => {
          if (!blob) return;

          const croppedFile = new File([blob], file.name, {
            type: file.type,
          });

          const compressedFile = await imageCompression(croppedFile, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1350,
            useWebWorker: true,
          });

          resolve(compressedFile);
        }, file.type);
      };
    };
  });
}
