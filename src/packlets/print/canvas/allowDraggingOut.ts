/**
 * Allow the user to drag the image out of the canvas to their desktop.
 * The image will be saved as a PNG file.
 */
export function allowDraggingOut(
  canvas: HTMLCanvasElement,
  getFileName: () => string | null | undefined
) {
  canvas.draggable = true;
  canvas.ondragstart = (e) => {
    const fileName = getFileName();
    if (!fileName) {
      return;
    }
    if (!e.dataTransfer) {
      return;
    }
    e.dataTransfer.clearData();
    const dataUrl = canvas.toDataURL();
    e.dataTransfer.setData(
      "DownloadURL",
      ["image/png", fileName, dataUrl].join(":")
    );
  };
}
