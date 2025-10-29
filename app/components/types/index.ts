// types/index.ts

export interface PixelBlock {
  id: string; // Unique ID for the block
  x: number;  // Top-left X coordinate of the block (in grid cells)
  y: number;  // Top-left Y coordinate of the block (in grid cells)
  width: number; // Width of the block in grid cells
  height: number; // Height of the block in grid cells
  imageUrl?: string; // URL of the image placed in this block
  ownerId?: string; // ID of the user who bought this block
  pricePaid?: number; // Price paid for this block
  // Add more properties as needed
}

export interface GridConfig {
  gridWidthCells: number;   // Total width of the grid in cells
  gridHeightCells: number;  // Total height of the grid in cells
  cellSize: number;         // Size of each individual cell in pixels (e.g., 10px)
  defaultBlockWidth: number; // Default block width to buy in grid cells (e.g., 5)
  defaultBlockHeight: number; // Default block height to buy in grid cells (e.g., 5)
}

interface BuyerData {
  id: string;
  name: string;
  pixelsBought: string;
  position: string; // e.g., '(-, -)' or '((755, 360), (920, 410))'
  logoUrl: string; // Path to the logo image
  tag?: string; // Additional tag like 'Our Client'
  rank?: 1 | 2 | 3 | null; // 1 for Gold (Trophy), 2 for Silver, 3 for Bronze
}

interface BuyerSectionProps {
  title: string;
  icon: React.ReactNode; // For the Crown/Clock/Client icon
  data: BuyerData[];
}