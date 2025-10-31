"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
// next/navigation is being used via useRouter
import { useRouter } from "next/navigation";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

const DEFAULT_CONFIG = {
  gridWidthCells: 160,
  gridHeightCells: 80,
  cellSize: 10,
  defaultBlockWidth: 5,
  defaultBlockHeight: 5,
};

// Dummy data remains unchanged
const DUMMY_INITIAL_BLOCKS = [
  {
    id: "b1",
    x: 5,
    y: 5,
    width: 15,
    height: 10,
    imageUrl: "/images/car.webp",
    ownerId: "user1",
  },
  { id: "b2", x: 100, y: 70, width: 30, height: 10, ownerId: "placeholder" },
  {
    id: "b3",
    x: 80,
    y: 30,
    width: 10,
    height: 10,
    imageUrl: "/images/car2.jpg",
    ownerId: "user3",
  },
  { id: "b4", x: 30, y: 40, width: 10, height: 2, ownerId: "placeholder_long" },
  {
    id: "b5",
    x: 100,
    y: 40,
    width: 20,
    height: 5,
    ownerId: "placeholder_blue",
  },
  {
    id: "b6x",
    x: 40,
    y: 20,
    width: 15,
    height: 5,
    imageUrl: "/images/car3.jpg",
    ownerId: "user6",
  },
  {
    id: "b6y",
    x: 20,
    y: 70,
    width: 15,
    height: 5,
    imageUrl: "/images/car3.jpg",
    ownerId: "user6",
  },
  { id: "b7", x: 50, y: 70, width: 10, height: 15, ownerId: "placeholder_red" },
];

interface SelectionData {
  width: number;
  height: number;
  totalPixels: number;
  price: number;
}
interface MouseCoords {
  x: number;
  y: number;
}
interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  imageUrl?: string;
  ownerId: string;
}

const PixelGrid = () => {
  const router = useRouter();
  const {
    gridWidthCells,
    gridHeightCells,
    cellSize,
    defaultBlockWidth,
    defaultBlockHeight,
  } = DEFAULT_CONFIG;
  const totalGridWidthPx = gridWidthCells * cellSize;
  const totalGridHeightPx = gridHeightCells * cellSize;
  const [reservedBlocks, setReservedBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);


  const [hoverPixel, setHoverPixel] = useState<{
    x: number;
    y: number;
    block?: Block;
  } | null>(null);
  const [mouseCoords, setMouseCoords] = useState<MouseCoords | null>(null);
  const [showStatusButtons, setShowStatusButtons] = useState(false);
  const [placedBlocks] = useState<Block[]>(DUMMY_INITIAL_BLOCKS);
  const [magnifierMode, setMagnifierMode] = useState(false);
  const [magnifierZoom, setMagnifierZoom] = useState(2);
  const gridContainerRef = useRef<HTMLDivElement | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  const magnifierSize = 200;
  const [fullscreen, setFullscreen] = useState(false);
  const [initialScale, setInitialScale] = useState(1);

useEffect(() => {
  const updateScale = () => {
    if (window.innerWidth < 500) setInitialScale(0.3);  // Mobile
    else if (window.innerWidth < 900) setInitialScale(0.5); // Tablet
    else setInitialScale(1);  // Desktop
  };
  updateScale();
  window.addEventListener("resize", updateScale);
  return () => window.removeEventListener("resize", updateScale);
}, []);


  const [selectedCells, setSelectedCells] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectionData, setSelectionData] = useState<SelectionData | null>(
    null
  );

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleConfirmReservation = () => {
    setIsConfirming(true);

    setTimeout(() => {
      // Reservation complete hone ke baad loader hatao
      setIsConfirming(false);
      setShowModal(false);

      // Reserve pixels ko final list me add karo
      // NOTE: This logic needs to generate the Block object from the selectionData and selectionStart/mouseCoords
      // For now, keeping the user's placeholder logic:
      if (selectedBlock) {
        setReservedBlocks((prev) => [...prev, selectedBlock]);
      }
      setSelectedBlock(null);
      setShowConfirmMessage(true);
    }, 2000);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!showStatusButtons) return; // Only allow selection if 'Buy Pixels' is clicked
    if (!gridContainerRef.current) return;
    const rect = gridContainerRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    setSelectionStart({ x, y });
    setIsSelecting(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting || !selectionStart || !showStatusButtons) return;

    const rect = gridContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xEnd = Math.floor((e.clientX - rect.left) / cellSize);
    const yEnd = Math.floor((e.clientY - rect.top) / cellSize);

    const x1 = Math.min(selectionStart.x, xEnd);
    const y1 = Math.min(selectionStart.y, yEnd);
    const x2 = Math.max(selectionStart.x, xEnd);
    const y2 = Math.max(selectionStart.y, yEnd);

    const width = x2 - x1 + 1;
    const height = y2 - y1 + 1;
    const totalPixels = width * height;
    const price = totalPixels * 1; // $1 per pixel

    setSelectionData({ width, height, totalPixels, price });

    // NOTE: Generating a temporary block ID here for the reservation flow
    setSelectedBlock({
      id: `temp-${Date.now()}`,
      x: x1,
      y: y1,
      width: width,
      height: height,
      ownerId: "current-user-temp",
    });

    setShowModal(true);
    setIsSelecting(false);
    setSelectionStart(null);
  };

  // Fullscreen toggle using browser API
  const handleGridFullscreen = useCallback(() => {
    const elem =
      gridContainerRef.current?.parentElement?.parentElement?.parentElement; // Target the fixed/relative container
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .then(() => setFullscreen(true))
        .catch((err) => console.error("Fullscreen failed:", err));
    } else if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setFullscreen(false));
    }
  }, []);

  // StatusButtonGroup unchanged
  const StatusButtonGroup = () => (
    // Responsive layout for buttons
    <div className="flex gap-2 sm:gap-3 items-center p-1 sm:p-2 mt-0 sm:mt-4 rounded-lg flex-wrap justify-end">
      <button
        className="bg-red-600 text-black font-custom px-3 py-1 sm:px-4 sm:py-2 mb-2 rounded-lg text-sm sm:text-base"
        onClick={() => {
          setShowStatusButtons(false);
          setIsSelecting(false);
          setSelectionStart(null);
        }}
        style={{ backgroundColor: "rgba(209, 32, 32, 1)" }}
      >
        Revert
      </button>
      <div
        className="flex gap-2 items-center bg-[#024D45] rounded-lg mb-2 py-1 sm:py-2 px-2 sm:px-3 text-sm flex-grow-0"
        style={{ outlineColor: "#98f08c" }}
      >
        <span className="w-3 h-3 rounded bg-[#022820] inline-block"></span>
        <span className="text-white text-xs sm:text-sm">Free</span>
        <span className="w-3 h-3 rounded bg-red-600 inline-block"></span>
        <span className="text-white text-xs sm:text-sm">Taken</span>
        <span className="w-3 h-3 rounded bg-blue-600 inline-block"></span>
        <span className="text-white text-xs sm:text-sm">Reserved</span>
        <span className="w-3 h-3 rounded bg-green-500 inline-block"></span>
        <span className="text-white text-xs sm:text-sm">Selected</span>
      </div>
    </div>
  );

  const Controls = () => {
    // useControls is used for pan-pinch transform controls
    const { zoomIn, zoomOut, resetTransform } = useControls();

    // + shows/increases magnifier zoom, - decreases/closes
    const handleMagnifierZoomInClick = () => {
      setMagnifierMode(true);
      setMagnifierZoom((prev) => (prev < 10 ? prev + 1 : 10));
    };
    const handleMagnifierZoomOutClick = () => {
      if (magnifierZoom > 1) {
        setMagnifierZoom((prev) => prev - 1);
      } else {
        setMagnifierMode(false); // disables if reaching 1x and pressing -
      }
    };

    return (
      <div className="flex gap-2 text-white flex-wrap justify-center overflow-hidden flex-shrink-0">
        <button
          onClick={handleMagnifierZoomInClick}
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md"
          title="Magnifier Zoom In"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16zm0-10v4m0 0h4m-4 0H6"
            />
          </svg>
        </button>
        <button
          onClick={handleMagnifierZoomOutClick}
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md"
          title="Magnifier Zoom Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16zm-4-8h8"
            />
          </svg>
        </button>
        {/* Magnifier: only show current zoom value, no dropdown, no green row */}
        {magnifierMode && (
          <span className="ml-2 text-green-400 font-medium">
            Mag Zoom: {magnifierZoom}x
          </span>
        )}
        <button
          onClick={handleGridFullscreen}
          className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md"
          title="Fullscreen grid"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4h4M4 16v4h4m8-16h4v4m0 8v4h-4"
            />
          </svg>
        </button>
        {/* Buttons to control the actual pan/zoom library */}
        {/* <button
          onClick={() => zoomIn()}
          className="w-8 h-8 flex items-center justify-center bg-blue-700 hover:bg-blue-600 rounded-md"
          title="Canvas Zoom In (Ctrl+Scroll)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M5 9V7H3V9H5ZM7 9V7H9V9H7ZM11 9V7H13V9H11ZM15 9V7H17V9H15ZM5 13V11H3V13H5ZM7 13V11H9V13H7ZM11 13V11H13V13H11ZM15 13V11H17V13H15Z" />
          </svg>
        </button> */}
        {/* <button
          onClick={() => zoomOut()}
          className="w-8 h-8 flex items-center justify-center bg-blue-700 hover:bg-blue-600 rounded-md"
          title="Canvas Zoom Out (Ctrl+Scroll)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M5 9V7H3V9H5ZM7 9V7H9V9H7ZM11 9V7H13V9H11ZM15 9V7H17V9H15ZM5 13V11H3V13H5ZM7 13V11H9V13H7ZM11 13V11H13V13H11ZM15 13V11H17V13H15Z" />
          </svg>
        </button> */}
      </div>
    );
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!gridContainerRef.current) return;

      const rect = gridContainerRef.current.getBoundingClientRect();
      // Calculate mouse coordinates relative to the grid container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMouseCoords({ x, y });

      // Calculate the cell/pixel coordinates
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);

      // Boundary check for hover pixel
      if (
        cellX < 0 ||
        cellX >= gridWidthCells ||
        cellY < 0 ||
        cellY >= gridHeightCells
      ) {
        setHoverPixel(null);
        return;
      }

      // Check for hovered block using cell coordinates
      const hoveredBlock = placedBlocks.find(
        (b) =>
          cellX >= b.x &&
          cellX < b.x + b.width &&
          cellY >= b.y &&
          cellY < b.y + b.height
      );

      if (hoveredBlock) {
        setHoverPixel({ x: cellX, y: cellY, block: hoveredBlock });
      } else {
        setHoverPixel({ x: cellX, y: cellY, block: undefined });
      }

      // If selecting, update the selection box in real-time
      if (isSelecting && selectionStart) {
        // Force re-render by setting state
        // The selection box logic relies on mouseCoords, which is updated above.
      }
    },
    [
      cellSize,
      gridWidthCells,
      gridHeightCells,
      placedBlocks,
      isSelecting,
      selectionStart,
    ]
  );

  // Grid lines etc—all same
  const renderGridLines = () => {
    const lines = [];
    for (let i = 0; i <= gridWidthCells; i++) {
      const isBlockBoundary = i % defaultBlockWidth === 0;
      lines.push(
        <div
          key={`v-${i}`}
          className="absolute bg-gray-700"
          style={{
            left: i * cellSize,
            top: 0,
            height: gridHeightCells * cellSize,
            width: 1,
            opacity: isBlockBoundary ? 0.6 : 0.2,
          }}
        />
      );
    }
    for (let i = 0; i <= gridHeightCells; i++) {
      const isBlockBoundary = i % defaultBlockHeight === 0;
      lines.push(
        <div
          key={`h-${i}`}
          className="absolute bg-gray-700"
          style={{
            top: i * cellSize,
            left: 0,
            width: gridWidthCells * cellSize,
            height: 1,
            opacity: isBlockBoundary ? 0.6 : 0.2,
          }}
        />
      );
    }
    return lines;
  };

  // Main grid fullscreen logic
  return (
    <div className="flex flex-col items-center w-[300px] sm:w-[600px] md:w-[800px] lg:w-[1200px] xl:w-[1800px]  bg-[#002320] min-h-screen px-2 sm:px-4">
      <div
        // **RESPONSIVENESS FIX:** This container now fills the available vertical space.
        className={`relative transition-all duration-300 ${
          fullscreen
            ? "fixed inset-0 z-[9999] bg-black flex justify-center items-center p-2"
            : // Use dynamic height to account for the header
              "w-full max-w-[100vw] flex justify-center items-center h-[calc(100vh-140px)] sm:h-[calc(100vh-100px)] pt-20 sm:pt-24"
        }`}
        // The style is mostly handled by classes now
      >
        <TransformWrapper
  initialScale={initialScale}
  minScale={initialScale}
  maxScale={1}
  wheel={{ disabled: true }}
  panning={{ disabled: true }}
  
>
          <>
            {/* --- Header - Responsive Layout --- */}
            <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 bg-[#002320] text-white flex flex-col gap-2 z-50 shadow-lg border-b border-[#0e6c6c]">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-8">
                {" "}
                {/* Changed to flex-col on mobile */}
                {/* LEFT info */}
                <div className="flex flex-col justify-center min-w-0 max-w-full sm:max-w-[40vw]">
                  {" "}
                  {/* Max width adjustment */}
                  <p className="p-2 rounded bg-[#024D45] mb-1 w-max text-sm sm:text-base">
                    Pixel: (
                    {hoverPixel ? `${hoverPixel.x}, ${hoverPixel.y}` : "-,-"})
                    &nbsp; Block {defaultBlockWidth}x {defaultBlockHeight}{" "}
                    &nbsp; $25 pixels
                  </p>
                  {showStatusButtons && (
                    <p className="text-gray-400 text-xs sm:text-sm">
                      The selected pixels will be{" "}
                      <span className="text-green-300">
                        reserved for 10 minutes.
                      </span>
                    </p>
                  )}
                  {!showStatusButtons && (
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Hold <span className="text-green-300">Ctrl + Scroll</span>{" "}
                      to zoom in/out. Current zoom:{" "}
                      <span className="text-green-300">100%. </span> Hold
                      <span className="text-green-300">Drag</span> to pan. Use
                      the{" "}
                      <span className="text-green-300">magnifier tool </span>{" "}
                      for precision zooming.
                    </p>
                  )}
                </div>
                {/* RIGHT Controls and Buy Button */}
                <div className="flex flex-col md:flex-row items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                  {!showStatusButtons && (
                    <button
                      onClick={() => setShowStatusButtons(true)}
                      className="font-custom px-4 py-2 bg-[#98F08C] hover:bg-green-700 transition rounded-lg text-black text-sm sm:text-lg shadow-md flex-shrink-0"
                    >
                      Buy Pixels
                    </button>
                  )}
                  {showStatusButtons && <StatusButtonGroup />}
                  <Controls />
                </div>
              </div>
            </div>

            {/* --- Grid - Responsive Wrapper --- */}
            
            
            <TransformComponent
              wrapperStyle={{
                // **RESPONSIVENESS FIX:** The wrapper now fills the parent container's available space.
                // width: totalGridWidthPx,
                // height: totalGridHeightPx,
                width: "100%",
                height: "100%",
                // Removed fixed width/height and marginTop
                cursor: magnifierMode ? "crosshair" : "grab",
                touchAction: "none",
                overflow: "hidden",
              }}
              contentStyle={{
                // **CRITICAL:** Content must retain fixed pixel size for grid math to work
                width: totalGridWidthPx,
                height: totalGridHeightPx,
                backgroundColor: "#002320",
                backgroundSize: "10px 10px, 50px 50px",
                position: "relative",
              }}
            >
              <div
                ref={gridContainerRef}
                className={`
  relative mt-[100px] sm:mt-0
  w-[320px] sm:w-[600px] md:w-[900px] lg:w-[1200px] xl:w-[1600px]
  h-auto
`}

                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => {
                  setHoverPixel(null);
                  setMouseCoords(null);
                }}
              >
                {renderGridLines()}
                {/* Highlighted hover pixel */}
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

                {/* Selection Box */}
                {isSelecting && selectionStart && mouseCoords && (
                  <div
                    className="absolute border-2 border-green-400 bg-green-400/10"
                    style={{
                      left: Math.min(
                        selectionStart.x * cellSize,
                        Math.floor(mouseCoords.x / cellSize) * cellSize
                      ),
                      top: Math.min(
                        selectionStart.y * cellSize,
                        Math.floor(mouseCoords.y / cellSize) * cellSize
                      ),
                      width:
                        (Math.abs(
                          Math.floor(mouseCoords.x / cellSize) -
                            selectionStart.x
                        ) +
                          1) *
                        cellSize,
                      height:
                        (Math.abs(
                          Math.floor(mouseCoords.y / cellSize) -
                            selectionStart.y
                        ) +
                          1) *
                        cellSize,
                      pointerEvents: "none",
                      zIndex: 10,
                    }}
                  ></div>
                )}

                {/* Temporary Reserved Blocks */}
                {reservedBlocks
                  .filter((b) => b !== null)
                  .map((block, index) => (
                    <div
                      key={index}
                      className="absolute border border-green-500 bg-green-700/30"
                      style={{
                        left: block.x * cellSize, // Scaled to pixel dimensions
                        top: block.y * cellSize, // Scaled to pixel dimensions
                        width: block.width * cellSize, // Scaled to pixel dimensions
                        height: block.height * cellSize, // Scaled to pixel dimensions
                      }}
                    ></div>
                  ))}

                {/* Confirmation Message Modal */}
                {showConfirmMessage && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-green-800 p-6 rounded-2xl shadow-2xl text-center w-[340px] text-white border-2 border-green-600">
                      <h2 className="text-xl font-bold mb-3">
                        Pixels Reserved!
                      </h2>

                      <p className="text-sm opacity-90 mb-6">
                        You have successfully reserved these pixels.
                      </p>

                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setShowConfirmMessage(false);
                            router.push("/login"); // navigate to login page
                          }}
                          className="bg-green-600 text-white hover:bg-gray-800 px-4 py-2 rounded-lg font-medium"
                        >
                          Continue
                        </button>

                        <button
                          onClick={() => setShowConfirmMessage(false)}
                          className="bg-red-600  hover:bg-red-700 text-black px-4 py-2 rounded-lg font-semibold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Magnifier View */}
                {magnifierMode && mouseCoords && (
                  <div
                    className="pointer-events-none absolute"
                    style={{
                      left: mouseCoords.x - magnifierSize / 2,
                      top: mouseCoords.y - magnifierSize / 2,
                      width: magnifierSize,
                      height: magnifierSize,
                      borderRadius: "50%",
                      border: "3px solid white",
                      boxShadow: "0 0 8px 2px #111",
                      overflow: "hidden",
                      background: "#002320",
                      zIndex: 20,
                    }}
                  >
                    {/* Inner zoomed grid view */}
                    <div
                      style={{
                        position: "absolute",
                        left:
                          -(mouseCoords.x * magnifierZoom) + magnifierSize / 2,
                        top:
                          -(mouseCoords.y * magnifierZoom) + magnifierSize / 2,
                        width: totalGridWidthPx * magnifierZoom,
                        height: totalGridHeightPx * magnifierZoom,
                        transformOrigin: "top left",
                      }}
                    >
                      {/* Draw grid lines */}
                      {renderGridLines()}

                      {/* Draw all blocks (Zoomed) */}
                      {placedBlocks.map((block) => (
                        <div
                          key={`mag-${block.id}`}
                          className={`absolute border border-gray-600 overflow-hidden ${
                            block.ownerId?.includes("placeholder")
                              ? "bg-red-700 opacity-60"
                              : "bg-blue-600 opacity-50"
                          }`}
                          style={{
                            left: block.x * cellSize * magnifierZoom,
                            top: block.y * cellSize * magnifierZoom,
                            width: block.width * cellSize * magnifierZoom,
                            height: block.height * cellSize * magnifierZoom,
                          }}
                        >
                          {block.imageUrl && (
                            <img
                              src={block.imageUrl}
                              alt={`Block ${block.id}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Crosshair */}
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        width: "22px",
                        height: "22px",
                        transform: "translate(-50%,-50%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "2px",
                          height: "22px",
                          background: "red",
                          position: "absolute",
                        }}
                      />
                      <div
                        style={{
                          height: "2px",
                          width: "22px",
                          background: "red",
                          position: "absolute",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Placed Blocks (Normal View) */}
                {placedBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`absolute border border-gray-600 overflow-hidden ${
                      block.ownerId?.includes("placeholder")
                        ? "bg-red-700 opacity-60"
                        : "bg-blue-600 opacity-50"
                    }`}
                    style={{
                      left: block.x * cellSize,
                      top: block.y * cellSize,
                      width: block.width * cellSize,
                      height: block.height * cellSize,
                    }}
                  >
                    {block.imageUrl ? (
                      <img
                        src={block.imageUrl}
                        alt={`Block ${block.id}`}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </TransformComponent>
          </>
        </TransformWrapper>
      </div>
      {/* Modal - Already Responsive (fixed inset-0) */}
      {showModal && selectionData && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[99999]">
          <div className="bg-[#002c26] text-center rounded-2xl p-8 max-w-sm w-[90%] sm:max-w-lg shadow-2xl border border-[#0e6c6c]">
            <h2 className="text-4xl font-custom text-green-300 mb-4">
              Reserve Pixels
            </h2>
            <p className="text-green-200 mb-6">
              Please confirm your reservation of the selected pixels.
            </p>

            <div className="bg-[#013b34] rounded-lg p-4 mb-6 border border-[#0e6c6c] text-left text-sm sm:text-base">
              <h3 className="text-green-400 font-semibold mb-2 text-center">
                Selection Details
              </h3>
              <p className="text-green-300 mb-1 flex justify-between border-b border-green-700 pb-2">
                Dimensions:{" "}
                <span className="text-green-200">
                  {selectionData.width}px × {selectionData.height}px
                </span>
              </p>
              <p className="text-green-300 mb-1 flex justify-between border-b border-green-700 pb-2">
                Total Area:
                <span className="text-green-200">
                  {selectionData.totalPixels}px
                </span>
              </p>
              <p className="text-green-300 mt-2 flex justify-between text-lg text-center">
                <strong>Price:</strong>{" "}
                <span className="text-green-500 text-lg font-bold">
                  ${selectionData.price.toLocaleString()}
                </span>
              </p>
              <p className="text-green-500 text-center text-xs mt-1">
                Rate: $1 per pixel
              </p>
            </div>

            <div className="flex justify-around font-custom">
              <button
                onClick={handleConfirmReservation}
                disabled={isConfirming}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-black font-semibold transition"
              >
                {isConfirming ? "Confirming..." : "Confirm Reservation"}
              </button>

              <button
                className="bg-red-600 hover:bg-red-700 text-black px-6 py-2 rounded-lg font-custom font-semibold transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PixelGrid;
