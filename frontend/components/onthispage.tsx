"use client";

import React, { useEffect, useState } from "react";

interface Heading {
  text: string | null;
  id: string;
}

interface OnThisPageProps {
  htmlContent: string;
}

const OnThisPage: React.FC<OnThisPageProps> = ({ htmlContent }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const h2Elements = tempDiv.querySelectorAll("h2");
    const h2Data: Heading[] = Array.from(h2Elements).map((h2) => ({
      text: h2.textContent,
      id: h2.id,
    }));
    setHeadings(h2Data);
  }, [htmlContent]);

  return (
    <div className="fixed top-24 right-6 hidden lg:block z-10">
      <div className="bg-zinc-900/90 border border-zinc-800 backdrop-blur-sm shadow-lg shadow-zinc-900/50 w-64 rounded-xl">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200 tracking-wide">
            On This Page
          </h2>
        </div>

        <div className="max-h-[300px] overflow-y-auto px-4 py-3">
          <ul className="text-sm space-y-1.5 text-zinc-400">
            {headings.map((heading, index) => (
              <li key={index}>
                <a
                  href={`#${heading.id}`}
                  className="block py-1 px-2 rounded-md transition-all duration-200 hover:text-blue-400 hover:bg-zinc-800/60"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OnThisPage;
