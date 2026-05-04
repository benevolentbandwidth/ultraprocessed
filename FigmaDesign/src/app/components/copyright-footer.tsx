import { Heart } from "lucide-react";

export function CopyrightFooter() {
  return (
    <div className="text-center py-2.5 px-4">
      <p className="text-white/15 text-[0.65rem] leading-relaxed" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        © The Benevolent Bandwidth Foundation, Inc. · Massachusetts Nonprofit Corporation. All rights reserved.
      </p>
      <p className="text-white/15 text-[0.65rem] mt-0.5 flex items-center justify-center gap-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        Built with <Heart className="w-2.5 h-2.5 fill-red-500/40 text-red-500/40" /> for humanity
      </p>
    </div>
  );
}
