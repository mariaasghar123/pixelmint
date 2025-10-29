"use client";
import React from "react";
import SocialLink from "./SocialLink";

interface StayConnectedProps {
  title?: string;
  twitterUrl: string;
  telegramUrl: string;
}

const StayConnected: React.FC<StayConnectedProps> = ({
  title = "Stay Connected",
  twitterUrl,
  telegramUrl,
}) => {
  return (
    <div
      className="
        w-full 
        max-w-[95vw] 
        sm:max-w-[600px] 
        md:max-w-[800px] 
        lg:max-w-[1000px] 
        xl:max-w-[1200px] 
        bg-[#002320] 
        rounded-2xl 
        py-8 
        px-4 
        mx-auto 
        mt-12 
        shadow-2xl 
        text-center
      "
    >
      {/* Title */}
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-6">
        {title}
      </h3>

      {/* Social Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <SocialLink platform="twitter" url={twitterUrl} />
        <SocialLink platform="telegram" url={telegramUrl} />
      </div>
    </div>
  );
};

export default StayConnected;
