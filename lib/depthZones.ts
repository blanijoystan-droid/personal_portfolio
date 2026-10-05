/**
 * Expedition depth model.
 *
 * The single source of truth for the dive. Each portfolio section maps to a
 * real depth band in the ocean, and the camera, lighting and fog all read from
 * here. Sections and their environments are intentionally kept in this order so
 * the dive always descends — never ascends, never teleports.
 */

export type SectionId =
  | 'home'
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'achievements'
  | 'certifications'
  | 'contact';

export interface DepthZone {
  id: SectionId;
  /** Environment name shown in the dive UI, e.g. "SHALLOW REEF". */
  zone: string;
  /** Short poetic descriptor used on the loading screen and the depth meter. */
  descriptor: string;
  /** Depth in metres at which this zone is fully established. */
  depth: number;
  /** Camera Y position for this zone. */
  cameraY: number;
  /** How far the camera sits from the centre of the world. */
  cameraZ: number;
  /** Fog colour — the water colour at this depth. */
  water: string;
  /** Fog near/far planes. Deeper water loses visibility faster. */
  fogNear: number;
  fogFar: number;
  /** Key light colour and strength. Sunlight fades as you descend. */
  keyColor: string;
  keyIntensity: number;
  /** Ambient bounce colour. */
  ambientColor: string;
  ambientIntensity: number;
  /** Hemisphere fill. */
  fillColor: string;
  fillGround: string;
  fillIntensity: number;
  /** Exposure — the abyss is darker but must stay readable. */
  exposure: number;
}

export const DEPTH_ZONES: DepthZone[] = [
  {
    id: 'home',
    zone: 'SURFACE',
    descriptor: 'WHERE THE LIGHT STILL REACHES',
    depth: 8,
    cameraY: 9.5,
    cameraZ: 12,
    water: '#1d6f8c',
    fogNear: 16,
    fogFar: 150,
    keyColor: '#cdeef5',
    keyIntensity: 2.5,
    ambientColor: '#5fb8cf',
    ambientIntensity: 0.85,
    fillColor: '#8fe4f0',
    fillGround: '#124a5c',
    fillIntensity: 1.1,
    exposure: 1.16,
  },
  {
    id: 'about',
    zone: 'SHALLOW REEF',
    descriptor: 'FIRST LIFE IN THE LIGHT',
    depth: 62,
    cameraY: -4,
    cameraZ: 14,
    water: '#135a76',
    fogNear: 13,
    fogFar: 108,
    keyColor: '#a8dfe9',
    keyIntensity: 1.8,
    ambientColor: '#3f9ab4',
    ambientIntensity: 0.7,
    fillColor: '#63c6d8',
    fillGround: '#0d3b4c',
    fillIntensity: 0.95,
    exposure: 1.1,
  },
  {
    id: 'skills',
    zone: 'CORAL CAVE',
    descriptor: 'STONE THAT LEARNS',
    depth: 148,
    cameraY: -17,
    cameraZ: 15,
    water: '#0c4460',
    fogNear: 11,
    fogFar: 84,
    keyColor: '#7fc4d6',
    keyIntensity: 1.1,
    ambientColor: '#2b7b96',
    ambientIntensity: 0.58,
    fillColor: '#41a2b8',
    fillGround: '#092b3c',
    fillIntensity: 0.78,
    exposure: 1.06,
  },
  {
    id: 'projects',
    zone: 'THE FACILITY',
    descriptor: 'A MACHINE ON THE SEABED',
    depth: 268,
    cameraY: -33,
    cameraZ: 17,
    water: '#08354c',
    fogNear: 9.5,
    fogFar: 68,
    keyColor: '#5fa8bd',
    keyIntensity: 0.72,
    ambientColor: '#1d5f79',
    ambientIntensity: 0.5,
    fillColor: '#2d8296',
    fillGround: '#061f2c',
    fillIntensity: 0.62,
    exposure: 1.03,
  },
  {
    id: 'experience',
    zone: 'THE WRECK',
    descriptor: 'WHAT THE SEA KEPT',
    depth: 402,
    cameraY: -48,
    cameraZ: 18,
    water: '#052740',
    fogNear: 8.5,
    fogFar: 56,
    keyColor: '#4a8fa6',
    keyIntensity: 0.5,
    ambientColor: '#154a60',
    ambientIntensity: 0.44,
    fillColor: '#206b7e',
    fillGround: '#04161f',
    fillIntensity: 0.5,
    exposure: 1.0,
  },
  {
    id: 'achievements',
    zone: 'TREASURE REEF',
    descriptor: 'WHAT WAS BROUGHT BACK',
    depth: 548,
    cameraY: -62,
    cameraZ: 17,
    water: '#041d33',
    fogNear: 8,
    fogFar: 50,
    keyColor: '#3d7d94',
    keyIntensity: 0.38,
    ambientColor: '#103d50',
    ambientIntensity: 0.38,
    fillColor: '#1a5a6b',
    fillGround: '#03101a',
    fillIntensity: 0.42,
    exposure: 0.98,
  },
  {
    id: 'certifications',
    zone: 'THE ARCHIVE',
    descriptor: 'RECORDS THAT SURVIVED',
    depth: 704,
    cameraY: -76,
    cameraZ: 16,
    water: '#03162a',
    fogNear: 7.5,
    fogFar: 44,
    keyColor: '#356f86',
    keyIntensity: 0.3,
    ambientColor: '#0d3141',
    ambientIntensity: 0.33,
    fillColor: '#164c5c',
    fillGround: '#020c14',
    fillIntensity: 0.36,
    exposure: 0.96,
  },
  {
    id: 'contact',
    zone: 'THE ABYSS',
    descriptor: 'A SIGNAL IN THE DARK',
    depth: 890,
    cameraY: -90,
    cameraZ: 15,
    water: '#020e1e',
    fogNear: 7,
    fogFar: 38,
    keyColor: '#2d5f75',
    keyIntensity: 0.22,
    ambientColor: '#0a2635',
    ambientIntensity: 0.28,
    fillColor: '#123e4c',
    fillGround: '#01080e',
    fillIntensity: 0.3,
    exposure: 0.94,
  },
];

export const SECTION_ORDER: SectionId[] = DEPTH_ZONES.map((z) => z.id);

export function getZone(id: string): DepthZone {
  return DEPTH_ZONES.find((z) => z.id === id) ?? DEPTH_ZONES[0]!;
}

/** Linear interpolation between two zones, used while scrolling. */
export function lerpZone(a: DepthZone, b: DepthZone, t: number): DepthZone {
  const mix = (x: number, y: number) => x + (y - x) * t;

  // Colours blend in linear-ish space by lerping the two sRGB triples.
  const mixColor = (x: string, y: string) => {
    const cx = parseInt(x.slice(1), 16);
    const cy = parseInt(y.slice(1), 16);
    const r = Math.round(mix((cx >> 16) & 255, (cy >> 16) & 255));
    const g = Math.round(mix((cx >> 8) & 255, (cy >> 8) & 255));
    const bl = Math.round(mix(cx & 255, cy & 255));
    return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
  };

  return {
    id: t < 0.5 ? a.id : b.id,
    zone: t < 0.5 ? a.zone : b.zone,
    descriptor: t < 0.5 ? a.descriptor : b.descriptor,
    depth: mix(a.depth, b.depth),
    cameraY: mix(a.cameraY, b.cameraY),
    cameraZ: mix(a.cameraZ, b.cameraZ),
    water: mixColor(a.water, b.water),
    fogNear: mix(a.fogNear, b.fogNear),
    fogFar: mix(a.fogFar, b.fogFar),
    keyColor: mixColor(a.keyColor, b.keyColor),
    keyIntensity: mix(a.keyIntensity, b.keyIntensity),
    ambientColor: mixColor(a.ambientColor, b.ambientColor),
    ambientIntensity: mix(a.ambientIntensity, b.ambientIntensity),
    fillColor: mixColor(a.fillColor, b.fillColor),
    fillGround: mixColor(a.fillGround, b.fillGround),
    fillIntensity: mix(a.fillIntensity, b.fillIntensity),
    exposure: mix(a.exposure, b.exposure),
  };
}