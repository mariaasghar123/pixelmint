import Navbar from "./components/Navbar";
import StatsBar from "./components/Statsbar";
import PixelGrid from "./components/PixelGrid";
import { FaUsers } from "react-icons/fa";
import BuyerSection from "./components/BuyerSection";
import { BuyerData } from "./components/BuyerSection";
import StayConnected from "./components/StayConnected";

// --- Dummy Data ---
const BiggestBuyersData: BuyerData[] = [
  {
    id: "b1",
    name: "Aphrodite Cooley",
    pixelsBought: "22000",
    position: "((665, 125), (895, 125))",
    logoUrl: "/logo1.png",
    rank: 1,
  },
  {
    id: "b2",
    name: "Angelica Zamora",
    pixelsBought: "8250",
    position: "((755, 360), (920, 410))",
    logoUrl: "/logo2.png",
    rank: 2,
  },
  {
    id: "b3",
    name: "fghsf",
    pixelsBought: "4050",
    position: "((520, 465), (566, 555))",
    logoUrl: "/logo3.png",
    rank: 3,
  },
  {
    id: "b4",
    name: "Shopverse",
    pixelsBought: "45x40 px",
    position: "(-, -)",
    logoUrl: "/logo4.png",
    rank: null,
  },
  {
    id: "b5",
    name: "New Client Inc.",
    pixelsBought: "30x30 px",
    position: "(-, -)",
    logoUrl: "/logo5.png",
    rank: null,
  },
];

const RecentBuyersData: BuyerData[] = [
  {
    id: "r1",
    name: "Our Client",
    pixelsBought: "5x5 px",
    position: "(-, -)",
    logoUrl: "/logo6.png",
    tag: "Our Client",
    rank: null,
  },
  {
    id: "r2",
    name: "Shopverse",
    pixelsBought: "45x40 px",
    position: "(-, -)",
    logoUrl: "/logo7.png",
    tag: "New",
    rank: null,
  },
  {
    id: "r3",
    name: "Another Buyer",
    pixelsBought: "10x10 px",
    position: "(-, -)",
    logoUrl: "/logo8.png",
    tag: "Featured",
    rank: null,
  },
  {
    id: "r4",
    name: "Our Client",
    pixelsBought: "20x20 px",
    position: "(-, -)",
    logoUrl: "/logo9.png",
    tag: "Our Client",
    rank: null,
  },
  {
    id: "r5",
    name: "Shopverse",
    pixelsBought: "15x15 px",
    position: "(-, -)",
    logoUrl: "/logo10.png",
    tag: "Our Client",
    rank: null,
  },
];

export default function Home() {
  return (
    <div className="w-full pb-4 min-h-screen bg-[#0B3C31] text-white flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Stats Bar */}
      <div className="w-full">
        <StatsBar />
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-6 gap-10">
        {/* 🔹 Pixel Grid Section */}
        <section className="w-full max-w-6xl flex justify-center">
          <PixelGrid />
        </section>

        {/* 🔹 Buyer Sections (Now Fully Responsive Grid) */}
        <section className="w-full max-w-[1440px] flex flex-col gap-10">
          <BuyerSection title="Biggest Buyers" icon="👑" data={BiggestBuyersData} />
          <BuyerSection title="Recent Buyers" icon="⏱️" data={RecentBuyersData} />
          <BuyerSection
            title="Our Clients"
            icon={<FaUsers className="text-white" />}
            data={RecentBuyersData}
          />
        </section>
      </main>

      {/* Stay Connected Section */}
      <footer className="w-full mt-auto">
        <StayConnected
          twitterUrl="https://twitter.com/yourhandle"
          telegramUrl="https://t.me/yourchannel"
        />
      </footer>
    </div>
  );
}