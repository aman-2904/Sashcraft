import { ProductColor } from '@/data/sashesData';

export interface MatrixColorItem {
  hex: string;
  name: string;
}

/**
 * Structured 8x9 color palette matrix matching the exact ceremonial design studio popover.
 * 8 columns x 9 chromatic rows:
 * - Row 1: Grayscale & Neutrals
 * - Row 2: Reds, Crimson & Burgundy
 * - Row 3: Peaches, Oranges & Earth Browns
 * - Row 4: Yellows, Golds & Olive Regalia
 * - Row 5: Greens, Emeralds & Forest Tones
 * - Row 6: Cyans, Turquoise & Deep Peacock Teals
 * - Row 7: Blues, Cobalts & Midnight Navies
 * - Row 8: Lilacs, Violets & Royal Purples
 * - Row 9: Baby Pinks, Magentas & Deep Bordeaux
 */
export const COLOR_PALETTE_ROWS: MatrixColorItem[][] = [
  // Row 1: Grayscale & Neutrals
  [
    { hex: '#ffffff', name: 'Pure White' },
    { hex: '#f2f2f2', name: 'Platinum Ice' },
    { hex: '#d9d9d9', name: 'Light Silver Gray' },
    { hex: '#bdbdbd', name: 'Silver Platinum' },
    { hex: '#9e9e9e', name: 'Medium Slate' },
    { hex: '#757575', name: 'Graphite Gray' },
    { hex: '#424242', name: 'Obsidian Charcoal' },
    { hex: '#000000', name: 'Pitch Midnight Black' },
  ],
  // Row 2: Reds, Crimson & Burgundy
  [
    { hex: '#fce4ec', name: 'Pale Blush Pink' },
    { hex: '#f8bbd0', name: 'Soft Coral Pink' },
    { hex: '#f06292', name: 'Salmon Rose' },
    { hex: '#ff4d4d', name: 'Vibrant Scarlet' },
    { hex: '#d32f2f', name: 'Imperial Red' },
    { hex: '#b71c1c', name: 'Crimson Red' },
    { hex: '#7f0000', name: 'Imperial Maroon' },
    { hex: '#4a0000', name: 'Deep Royal Burgundy' },
  ],
  // Row 3: Peaches, Oranges & Earth Browns
  [
    { hex: '#fff3e0', name: 'Pale Peach Cream' },
    { hex: '#ffe0b2', name: 'Soft Apricot' },
    { hex: '#ffb74d', name: 'Pastel Tangerine' },
    { hex: '#ff9800', name: 'Vibrant Amber Orange' },
    { hex: '#f57c00', name: 'Ceremonial Saffron' },
    { hex: '#d84315', name: 'Burnt Terracotta' },
    { hex: '#8d6e63', name: 'Antique Bronze Brown' },
    { hex: '#3e2723', name: 'Dark Chocolate Espresso' },
  ],
  // Row 4: Yellows, Golds & Olive Regalia
  [
    { hex: '#fffde7', name: 'Pale Pastel Primrose' },
    { hex: '#fff59d', name: 'Soft Cream Yellow' },
    { hex: '#fff176', name: 'Bright Lemon' },
    { hex: '#ffee58', name: 'Electric Yellow' },
    { hex: '#ffeb3b', name: 'Canary Sun Gold' },
    { hex: '#c0ca33', name: 'Regal Ochre Gold' },
    { hex: '#827717', name: 'Military Ceremonial Olive' },
    { hex: '#333300', name: 'Deep Dark Olive' },
  ],
  // Row 5: Greens, Emeralds & Forest Tones
  [
    { hex: '#e8f5e9', name: 'Mint Ice Pastel' },
    { hex: '#a5d6a7', name: 'Soft Sage Green' },
    { hex: '#66bb6a', name: 'Bright Meadow Green' },
    { hex: '#00e676', name: 'Electric Lime Green' },
    { hex: '#00c853', name: 'Vivid Kelly Green' },
    { hex: '#2e7d32', name: 'British Racing Green' },
    { hex: '#1b5e20', name: 'Deep Forest Green' },
    { hex: '#052e16', name: 'Black Forest Green' },
  ],
  // Row 6: Cyans, Turquoise & Deep Peacock Teals
  [
    { hex: '#e0f7fa', name: 'Pale Ice Cyan' },
    { hex: '#80deea', name: 'Sky Turquoise' },
    { hex: '#26c6da', name: 'Aqua Peacock' },
    { hex: '#00bcd4', name: 'Vibrant Cyan' },
    { hex: '#0097a7', name: 'Cerulean Teal' },
    { hex: '#00838f', name: 'Ocean Deep Teal' },
    { hex: '#006064', name: 'Tiffany Dark Teal' },
    { hex: '#00363a', name: 'Midnight Dark Peacock' },
  ],
  // Row 7: Blues, Cobalts & Midnight Navies
  [
    { hex: '#e3f2fd', name: 'Pale Ice Blue' },
    { hex: '#90caf9', name: 'Academic Sky Blue' },
    { hex: '#42a5f5', name: 'Cornflower Blue' },
    { hex: '#2196f3', name: 'Academic Blue' },
    { hex: '#1976d2', name: 'Royal Cobalt Blue' },
    { hex: '#1565c0', name: 'Sapphire Deep Blue' },
    { hex: '#0d47a1', name: 'Royal Navy Blue' },
    { hex: '#051a44', name: 'Midnight Navy Blue' },
  ],
  // Row 8: Lilacs, Violets & Royal Purples
  [
    { hex: '#f3e5f5', name: 'Pale Lilac Pastel' },
    { hex: '#ce93d8', name: 'Soft Lavender' },
    { hex: '#ba68c8', name: 'Bright Lilac Violet' },
    { hex: '#ab47bc', name: 'Vivid Royal Violet' },
    { hex: '#8e24aa', name: 'Deep Amethyst Violet' },
    { hex: '#7b1fa2', name: 'Majesty Regal Purple' },
    { hex: '#4a148c', name: 'Royal Indigo Plum' },
    { hex: '#2a0845', name: 'Midnight Dark Eggplant' },
  ],
  // Row 9: Baby Pinks, Magentas & Deep Bordeaux
  [
    { hex: '#fce4ec', name: 'Pale Baby Pink' },
    { hex: '#f8bbd0', name: 'Bubblegum Rose' },
    { hex: '#f472b6', name: 'Vibrant Pageant Pink' },
    { hex: '#ec4899', name: 'Hot Neon Pink' },
    { hex: '#db2777', name: 'Cerise Magenta' },
    { hex: '#be185d', name: 'Ruby Deep Magenta' },
    { hex: '#831843', name: 'Bordeaux Wine Magenta' },
    { hex: '#4a052a', name: 'Midnight Dark Bordeaux' },
  ],
];

/**
 * Flat array of all 72 matrix colors for quick lookups & iterations
 */
export const COLOR_PALETTE_FLAT: MatrixColorItem[] = COLOR_PALETTE_ROWS.flat();

/**
 * Full extended fabric color palette for ceremonial, graduation, and pageant sashes.
 */
export const FULL_COLOR_PALETTE: ProductColor[] = [
  // Signature Luxury Regalia
  { id: 'black', name: 'Midnight Black', hex: '#111111', borderHex: '#c19b38' },
  { id: 'royal-navy', name: 'Royal Navy Blue', hex: '#0b224e', borderHex: '#dfad2d' },
  { id: 'maroon', name: 'Imperial Maroon', hex: '#62101e', borderHex: '#dfad2d' },
  { id: 'gold', name: 'Regal Champagne Gold', hex: '#d4af37', borderHex: '#111111' },
  { id: 'emerald', name: 'Emerald Forest Green', hex: '#0a4427', borderHex: '#dfad2d' },
  { id: 'white', name: 'Pearl Pristine White', hex: '#fcfcfc', borderHex: '#c19b38' },

  // Jewel & Royal Tones
  { id: 'scarlet', name: 'Scarlet Crimson Red', hex: '#b91c1c', borderHex: '#dfad2d' },
  { id: 'burgundy', name: 'Deep Royal Burgundy', hex: '#4a0e17', borderHex: '#dfad2d' },
  { id: 'sapphire', name: 'Sapphire Cobalt Blue', hex: '#1d4ed8', borderHex: '#dfad2d' },
  { id: 'royal-purple', name: 'Royal Majesty Purple', hex: '#581c87', borderHex: '#dfad2d' },
  { id: 'amethyst', name: 'Deep Amethyst Violet', hex: '#7e22ce', borderHex: '#dfad2d' },
  { id: 'teal', name: 'Tiffany Peacock Teal', hex: '#0f766e', borderHex: '#dfad2d' },

  // Academic & Modern Regalia
  { id: 'sky-blue', name: 'Academic Sky Blue', hex: '#38bdf8', borderHex: '#0b224e' },
  { id: 'lavender', name: 'Pastel Lilac Lavender', hex: '#c084fc', borderHex: '#581c87' },
  { id: 'rose-gold', name: 'Metallic Blush Rose Gold', hex: '#e0a899', borderHex: '#b8860b' },
  { id: 'ceremonial-pink', name: 'Vibrant Pageant Pink', hex: '#db2777', borderHex: '#111111' },
  { id: 'forest-pine', name: 'British Racing Green', hex: '#14532d', borderHex: '#dfad2d' },
  { id: 'olive', name: 'Military Ceremonial Olive', hex: '#4d5b2c', borderHex: '#dfad2d' },

  // Metallics & Neutrals
  { id: 'saffron', name: 'Honorary Saffron Ochre', hex: '#f59e0b', borderHex: '#111111' },
  { id: 'bronze', name: 'Antique Bronze Copper', hex: '#92400e', borderHex: '#dfad2d' },
  { id: 'silver', name: 'Sterling Platinum Silver', hex: '#94a3b8', borderHex: '#111111' },
  { id: 'charcoal', name: 'Obsidian Slate Charcoal', hex: '#334155', borderHex: '#dfad2d' },
  { id: 'ivory', name: 'Vintage Bridal Ivory', hex: '#fef3c7', borderHex: '#c19b38' },
];

/**
 * Find friendly human-readable color name for any hex code
 */
export function getColorNameFromHex(hex: string): string {
  const clean = hex.toLowerCase().trim();
  const foundMatrix = COLOR_PALETTE_FLAT.find((c) => c.hex.toLowerCase() === clean);
  if (foundMatrix) return foundMatrix.name;

  const foundCatalog = FULL_COLOR_PALETTE.find((c) => c.hex.toLowerCase() === clean);
  if (foundCatalog) return foundCatalog.name;

  return `Custom Shade`;
}

/**
 * Extracts the 6-character or 3-character HEX code from any color string:
 * e.g. "Midnight Black (#111111)" -> "#111111"
 * e.g. "#7B1FA2" -> "#7B1FA2"
 */
export function extractHexFromColor(colorStr?: string): string | null {
  if (!colorStr) return null;
  const match = colorStr.match(/#([0-9a-fA-F]{3,8})/);
  if (match) {
    return `#${match[1]}`;
  }

  // Name fallback check
  const lower = colorStr.toLowerCase();
  for (const c of COLOR_PALETTE_FLAT) {
    if (lower.includes(c.name.toLowerCase()) || lower.includes(c.hex.toLowerCase())) {
      return c.hex;
    }
  }

  for (const c of FULL_COLOR_PALETTE) {
    if (lower.includes(c.name.toLowerCase()) || lower.includes(c.id)) {
      return c.hex;
    }
  }

  if (lower.includes('black')) return '#111111';
  if (lower.includes('blue') || lower.includes('navy')) return '#0b224e';
  if (lower.includes('maroon') || lower.includes('burgundy')) return '#62101e';
  if (lower.includes('gold') || lower.includes('yellow')) return '#d4af37';
  if (lower.includes('green') || lower.includes('emerald')) return '#0a4427';
  if (lower.includes('white') || lower.includes('ivory')) return '#ffffff';
  if (lower.includes('red')) return '#b91c1c';
  if (lower.includes('purple')) return '#581c87';

  return null;
}

/**
 * Standardize formatting for saving into enquiry database & WhatsApp messages:
 * e.g. "Midnight Black (#111111)"
 */
export function formatColorWithHex(name: string, hex: string): string {
  const cleanHex = hex.startsWith('#') ? hex : `#${hex}`;
  // If name already contains the hex in parentheses, avoid duplicate
  if (name.includes('(#')) {
    return name;
  }
  return `${name.trim()} (${cleanHex.toLowerCase()})`;
}
