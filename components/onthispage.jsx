"use client"
import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"


const OnThisPage = ({ htmlContent }) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    // Parse the HTML content and extract h2 headings
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const h2Elements = tempDiv.querySelectorAll('h2');
    const h2Data = Array.from(h2Elements).map(h2 => ({
      text: h2.textContent,
      id: h2.id
    }));
    setHeadings(h2Data);
  }, [htmlContent]);

  return (
   <div className="on-this-page fixed top-24 right-6 hidden lg:block z-10">
      <Card className="bg-zinc-900/90 border border-zinc-800 backdrop-blur-sm shadow-lg shadow-zinc-900/50 w-64">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-zinc-200 tracking-wide">
            On This Page
          </CardTitle>
        </CardHeader>
        <Separator className="bg-zinc-800 mb-2" />

        <CardContent className="p-0">
          <ScrollArea className="h-[300px] px-4 pb-4">
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
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnThisPage;