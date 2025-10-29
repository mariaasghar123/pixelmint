"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

interface PixelBlock {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;
  ownerId?: string;
}

interface GridConfig {
  gridWidthCells: number;
  gridHeightCells: number;
  cellSize: number;
  defaultBlockWidth: number;
  defaultBlockHeight: number;
}

const DEFAULT_CONFIG: GridConfig = {
  gridWidthCells: 150,
  gridHeightCells: 100,
  cellSize: 10,
  defaultBlockWidth: 5,
  defaultBlockHeight: 5,
};

const DUMMY_INITIAL_BLOCKS: PixelBlock[] = [
  { id: "b1", x: 5, y: 5, width: 15, height: 10, imageUrl: "/car1.jpg", ownerId: "user1" },
  { id: "b2", x: 100, y: 70, width: 30, height: 10, ownerId: "placeholder" },
  { id: "b3", x: 80, y: 30, width: 5, height: 5, imageUrl: "/phone.png", ownerId: "user3" },
  { id: "b4", x: 30, y: 40, width: 10, height: 2, ownerId: "placeholder_long" },
  { id: "b5", x: 100, y: 40, width: 20, height: 5, ownerId: "placeholder_blue" },
  { id: "b6", x: 120, y: 80, width: 15, height: 5, imageUrl: "/car2.jpg", ownerId: "user6" },
  { id: "b7", x: 50, y: 70, width: 10, height: 15, ownerId: "placeholder_red" },
];

const PixelGrid: React.FC = () => {
  const { gridWidthCells, gridHeightCells, cellSize, defaultBlockWidth, defaultBlockHeight } = DEFAULT_CONFIG;
  const totalGridWidthPx = gridWidthCells * cellSize;
  const totalGridHeightPx = gridHeightCells * cellSize;

  const [hoverPixel, setHoverPixel] = useState<{ x: number; y: number } | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<{ x: number; y: number; width: number; height: number; price: number } | null>(null);
  const [placedBlocks] = useState<PixelBlock[]>(DUMMY_INITIAL_BLOCKS);
  const [magnifierMode, setMagnifierMode] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const currentBlockPrice = defaultBlockWidth * defaultBlockHeight * (25 / (5 * 5));

  // --- Controls Component ---
  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    };

    // Initial zoom centering
    useEffect(() => {
      if (gridContainerRef.current) {
        const initialScale = 0.3; // smaller for mobile
        const initialX = -((totalGridWidthPx * initialScale - gridContainerRef.current.offsetWidth) / 2);
        const initialY = -((totalGridHeightPx * initialScale - gridContainerRef.current.offsetHeight) / 2);
        setTimeout(() => {
          resetTransform();
          // If you need specific positioning, consider using setTransform instead
        }, 100);
      }
    }, [resetTransform, totalGridWidthPx, totalGridHeightPx]);

    return (
      <div className="flex gap-2 text-white flex-wrap justify-center overflow-hidden">
        <button
          onClick={() => zoomIn()}
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md"
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16zm0-10v4m0 0h4m-4 0H6" />
          </svg>
        </button>

        <button
          onClick={() => zoomOut()}
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16zm-4-8h8" />
          </svg>
        </button>

        <button
          onClick={() => toggleFullScreen()}
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md"
          title="Fullscreen"
        >
          {isFullScreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 8h4V4H8v4zm0 8h4v4H8v-4zm8-8h4V4h-4v4zm0 8h4v4h-4v-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M4 16v4h4m8-16h4v4m0 8v4h-4" />
            </svg>
          )}
        </button>
      </div>
    );
  };

  // --- Mouse Interaction Handlers ---
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridContainerRef.current) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    if (cellX >= 0 && cellX < gridWidthCells && cellY >= 0 && cellY < gridHeightCells)
      setHoverPixel({ x: cellX, y: cellY });
    else setHoverPixel(null);
  }, [cellSize, gridWidthCells, gridHeightCells]);

  const handleClick = useCallback(() => {
    if (!hoverPixel) return;
    const blockX = Math.floor(hoverPixel.x / defaultBlockWidth) * defaultBlockWidth;
    const blockY = Math.floor(hoverPixel.y / defaultBlockHeight) * defaultBlockHeight;
    const isOccupied = placedBlocks.some(
      (block) =>
        block.x < blockX + defaultBlockWidth &&
        block.x + block.width > blockX &&
        block.y < blockY + defaultBlockHeight &&
        block.y + block.height > blockY
    );
    if (!isOccupied) {
      setSelectedBlock({ x: blockX, y: blockY, width: defaultBlockWidth, height: defaultBlockHeight, price: currentBlockPrice });
    } else {
      setSelectedBlock(null);
      alert("This area is already taken! Please choose an empty block.");
    }
  }, [hoverPixel, placedBlocks, defaultBlockWidth, defaultBlockHeight, currentBlockPrice]);

  // --- Grid Lines ---
  const renderGridLines = () => {
    const lines = [];
    for (let i = 0; i <= gridWidthCells; i++) {
      const isBlockBoundary = i % defaultBlockWidth === 0;
      lines.push(
        <div key={`v-${i}`} className="absolute bg-gray-700"
          style={{
            left: i * cellSize,
            top: 0,
            height: totalGridHeightPx,
            width: 1,
            opacity: isBlockBoundary ? 0.6 : 0.2,
          }}
        />
      );
    }
    for (let i = 0; i <= gridHeightCells; i++) {
      const isBlockBoundary = i % defaultBlockHeight === 0;
      lines.push(
        <div key={`h-${i}`} className="absolute bg-gray-700"
          style={{
            top: i * cellSize,
            left: 0,
            width: totalGridWidthPx,
            height: 1,
            opacity: isBlockBoundary ? 0.6 : 0.2,
          }}
        />
      );
    }
    return lines;
  };

  return (
    <div className="flex flex-col items-center bg-[#002320] min-h-[100vh] sm:min-h-screen px-2 sm:px-4">
      <div className="w-full flex justify-center items-center h-[80vh] sm:h-screen relative">
        <TransformWrapper
          initialScale={0.3}
          minScale={0.05}
          maxScale={5}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          panning={{ disabled: true }}
        >
          <>
            {/* --- Header --- */}
            <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-[#002320] text-white flex flex-col md:flex-row md:justify-evenly md:mx-40 lg:flex-row lg:justify-evenly  xl:mx-10 xl:justify-between items-center gap-3 sm:gap-0 z-50 shadow-lg border-b border-[#0e6c6c]">
              <div className="flex flex-col gap-2 text-white text-sm sm:text-base text-center sm:text-left">
                <p className="w-full sm:w-[300px] p-2 border border-transparent rounded bg-[#024D45]">
                  Pixel: ({hoverPixel ? `${hoverPixel.x}, ${hoverPixel.y}` : "-,-"}) &nbsp;&nbsp;
                  Block: {defaultBlockWidth}x{defaultBlockHeight} Pixels (${currentBlockPrice})
                </p>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Hold <span className="text-green-300">Ctrl + Scroll</span> to zoom | 
                  <span className="text-green-300"> Ctrl + Drag</span> to pan
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => alert("Buy Pixels Clicked!")}
                  className="font-custom px-4 sm:px-6 py-2 bg-[#98F08C] hover:bg-green-700 transition rounded-lg text-black text-sm sm:text-lg shadow-md"
                >
                  Buy Pixels
                </button>
                <Controls />
              </div>
            </div>

            {/* --- Grid --- */}
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                marginTop: "100px",
                cursor: magnifierMode ? "crosshair" : "grab",
                touchAction: "none",
              }}
              contentStyle={{
                width: totalGridWidthPx,
                height: totalGridHeightPx,
                backgroundColor: "#003A36",
                position: "relative",
              }}
            >
              <div
                ref={gridContainerRef}
                className="relative w-full h-full"
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                onMouseLeave={() => setHoverPixel(null)}
              >
                {renderGridLines()}

                {hoverPixel && (
                  <div
                    className="absolute bg-white opacity-10"
                    style={{
                      left: hoverPixel.x * cellSize,
                      top: hoverPixel.y * cellSize,
                      width: cellSize,
                      height: cellSize,
                    }}
                  />
                )}

                {selectedBlock && (
                  <div
                    className="absolute border-2 border-red-500"
                    style={{
                      left: selectedBlock.x * cellSize,
                      top: selectedBlock.y * cellSize,
                      width: selectedBlock.width * cellSize,
                      height: selectedBlock.height * cellSize,
                    }}
                  />
                )}

                {placedBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`absolute border border-gray-600 overflow-hidden ${
                      block.ownerId?.includes("placeholder") ? "bg-red-700 opacity-60" : "bg-blue-600 opacity-50"
                    }`}
                    style={{
                      left: block.x * cellSize,
                      top: block.y * cellSize,
                      width: block.width * cellSize,
                      height: block.height * cellSize,
                    }}
                  >
                    {block.imageUrl ? (
                      <img src={block.imageUrl} alt={`Block ${block.id}`} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                ))}
              </div>
            </TransformComponent>
          </>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default PixelGrid;
