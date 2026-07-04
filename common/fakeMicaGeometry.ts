export type DisplayBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Window content origin and the display it is on (Electron DIP coordinates). */
export type MicaGeometry = {
  contentX: number;
  contentY: number;
  displayX: number;
  displayY: number;
  displayWidth: number;
  displayHeight: number;
};

export function getMicaGeometry(
  contentX: number,
  contentY: number,
  display: DisplayBounds
): MicaGeometry {
  return {
    contentX,
    contentY,
    displayX: display.x,
    displayY: display.y,
    displayWidth: display.width,
    displayHeight: display.height,
  };
}

export function isValidMicaGeometry(geo: MicaGeometry): boolean {
  return geo.displayWidth > 0 && geo.displayHeight > 0;
}

export function getMicaCoverSize(
  displayWidth: number,
  displayHeight: number,
  imageWidth: number,
  imageHeight: number
): string {
  if (displayWidth <= 0 || displayHeight <= 0) {
    return "cover";
  }
  if (imageWidth <= 0 || imageHeight <= 0) {
    return `${displayWidth}px ${displayHeight}px`;
  }
  const scale = Math.max(displayWidth / imageWidth, displayHeight / imageHeight);
  return `${imageWidth * scale}px ${imageHeight * scale}px`;
}

export function getMicaBackgroundPosition(
  geo: MicaGeometry,
  imageWidth: number,
  imageHeight: number
): { size: string; position: string } {
  const { displayWidth: dw, displayHeight: dh } = geo;

  if (!isValidMicaGeometry(geo)) {
    return { size: "cover", position: "center" };
  }

  if (imageWidth <= 0 || imageHeight <= 0) {
    const posX = geo.displayX - geo.contentX;
    const posY = geo.displayY - geo.contentY;
    return {
      size: `${dw}px ${dh}px`,
      position: `${posX}px ${posY}px`,
    };
  }

  const scale = Math.max(dw / imageWidth, dh / imageHeight);
  const bgW = imageWidth * scale;
  const bgH = imageHeight * scale;
  const offsetX = geo.displayX + (dw - bgW) / 2;
  const offsetY = geo.displayY + (dh - bgH) / 2;
  const posX = offsetX - geo.contentX;
  const posY = offsetY - geo.contentY;

  return {
    size: `${bgW}px ${bgH}px`,
    position: `${posX}px ${posY}px`,
  };
}

export function isMicaGeometry(value: unknown): value is MicaGeometry {
  return (
    typeof value === "object" &&
    value !== null &&
    "displayWidth" in value &&
    typeof (value as MicaGeometry).displayWidth === "number"
  );
}
