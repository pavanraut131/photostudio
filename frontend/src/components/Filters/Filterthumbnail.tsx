// components/Filters/FilterThumbnail.tsx
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import Konva from "konva";

interface FilterThumbnailProps {
  filterKey?: string;
  imageUrl: string;
  size?: number;
}

const FILTERS_MAP: Record<string, any[]> = {
  original: [],
  sepia: [Konva.Filters.Sepia],
  grayscale: [Konva.Filters.Grayscale],
  brighten: [Konva.Filters.Brighten],
  invert: [Konva.Filters.Invert],
  blur: [Konva.Filters.Blur],
  tropical: [Konva.Filters.HSV],
  crisp: [Konva.Filters.Contrast],
  sandy: [Konva.Filters.Sepia],
  moody: [Konva.Filters.HSL],
  "black-white": [Konva.Filters.Grayscale],
  neon: [Konva.Filters.HSV],
  washed: [Konva.Filters.Brighten],
  bright: [Konva.Filters.Brighten],
  mellow: [Konva.Filters.Sepia],
  romantic: [Konva.Filters.Sepia, Konva.Filters.HSV],
  newspaper: [Konva.Filters.Grayscale, Konva.Filters.Contrast],
  darken: [Konva.Filters.Brighten],
  lighten: [Konva.Filters.Brighten],
  faded: [Konva.Filters.Blur],
  unicorn: [Konva.Filters.HSV],
  nightrain: [Konva.Filters.Brighten, Konva.Filters.HSL],
  "neon-sky": [Konva.Filters.HSV],
  "blue-ray": [Konva.Filters.HSV],
  jellybean: [Konva.Filters.HSV],
  concrete: [Konva.Filters.Contrast],
};

const Filterthumbnail: React.FC<FilterThumbnailProps> = ({
  filterKey,
  imageUrl,
  size = 80,
}) => {
  const [image] = useImage(imageUrl, "anonymous");
  const imageRef = useRef<Konva.Image>(null);
  

  useEffect(() => {
    if (!image || !imageRef.current) return;

    const node = imageRef.current;
    node.filters(FILTERS_MAP[filterKey] || []);

    switch (filterKey) {
      case "bright":
        node.brightness(0.3);
        break;
      case "darken":
        node.brightness(-0.3);
        break;
      case "lighten":
        node.brightness(0.3);
        break;
      case "faded":
        node.blurRadius(10);
        break;
      case "tropical":
      case "unicorn":
      case "neon-sky":
      case "blue-ray":
      case "jellybean":
        node.saturation(1.5);
        node.hue(200);
        break;
      case "moody":
        node.brightness(-0.2);
        node.saturation(-0.2);
        break;
      case "neon":
        node.saturation(2);
        node.hue(270);
        break;
      case "washed":
        node.brightness(0.2);
        node.saturation(-0.3);
        break;
      case "mellow":
        node.saturation(-0.2);
        break;
      case "romantic":
        node.saturation(0.3);
        node.hue(320);
        break;
      case "crisp":
      case "concrete":
        node.contrast(30);
        break;
      case "sandy":
        node.saturation(0.3);
        break;
      case "nightrain":
        node.brightness(-0.1);
        node.hue(180);
        break;
      default:
        break;
    }

    node.cache();
    node.getLayer()?.batchDraw();
  }, [filterKey, image]);

  return (
    <Stage width={size} height={size}>
      <Layer>
        {image && (
          <KonvaImage ref={imageRef} image={image} width={size} height={size} />
        )}
      </Layer>
    </Stage>
  );
};

export default Filterthumbnail;
