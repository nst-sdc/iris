// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import Image from "next/image";
// import fs from "fs"
// import matter from 'gray-matter';
// import { Navbar } from "@/components/Navbar";


// const dirContent = fs.readdirSync("articles", "utf-8")

// const blogs = dirContent.map(file=>{
//     const fileContent = fs.readFileSync(`articles/${file}`, "utf-8")
//     const {data} = matter(fileContent)
//     return data
// })

// const BlogsPage = () => {

//   return (
//     <>
//     <Navbar/>
//     <div className="blogs-container min-h-screen bg-linear-to-br from-[#050505] via-[#0a0a0a] to-[#111] text-gray-200 py-16 px-6 md:px-16">
//       {/* Header */}
//       <div className="blogs-header text-center mb-12 mt-15">
//         <h1 className="text-4xl md:text-5xl font-extrabold bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
//           Blogs
//         </h1>
//         <p className="text-gray-400 mt-3 text-lg tracking-wide">
//           Discover blogs on various topics related to robotics.
//         </p>
//       </div>
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//       {blogs.map((blog, index) => (
//         <Card key={index} className="hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 border border-zinc-800 bg-zinc-900 text-white">
//           <img
//             src={blog.image}
//             alt={blog.title}
//             className="w-full h-48 object-cover rounded-t-xl"
//           />
//           <CardHeader>
//             <CardTitle className="text-xl font-semibold">{blog.title}</CardTitle>
//             <CardDescription className="text-zinc-400 text-sm">
//               {blog.date} • {blog.author}
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-sm text-zinc-300 line-clamp-3">{blog.description}</p>
//           </CardContent>
//           <CardFooter>
//             <Link href={`/blogpost/${blog.slug}`} className="w-full">
//       <Button className="cursor-pointer w-full bg-linear-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/40 text-blue-300 font-semibold rounded-full py-2.5 transition-all duration-300 hover:from-zinc-700 hover:to-zinc-800 hover:border-blue-500/40 hover:text-white-100 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)]">
//                 Read More
//               </Button>
//             </Link>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//     </div>
//     </>
//   );
// };

// export default BlogsPage;
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import matter from "gray-matter";
import { Navbar } from "@/components/Navbar";

const dirContent = fs.readdirSync("articles", "utf-8");

const blogs = dirContent.map((file) => {
  const fileContent = fs.readFileSync(`articles/${file}`, "utf-8");
  const { data } = matter(fileContent);
  return data;
});

const BlogsPage = () => {
  return (
    <>
      <Navbar />
      <div className="blogs-container min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#111] text-gray-200 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="blogs-header text-center mb-12 mt-16">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
              Blogs
            </h1>
            <p className="text-gray-400 mt-3 text-lg tracking-wide">
              Discover blogs on various topics related to robotics.
            </p>
          </div>

          {/* Grid */}
          <div
            className="
            grid gap-6 p-2
            [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]
          "
          >
            {blogs.map((blog, index) => (
              <Card
                key={index}
                className="
                  h-full overflow-hidden border border-zinc-800 bg-zinc-900/90 text-white
                  transition-all duration-300
                  hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5
                  flex flex-col
                "
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full aspect-[16/9] object-cover"
                  loading="lazy"
                />
                <CardHeader className="space-y-2">
                  <CardTitle className="text-xl font-semibold">
                    {blog.title}
                  </CardTitle>
                  <CardDescription className="text-zinc-400 text-sm">
                    {blog.date} • {blog.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300 line-clamp-3">
                    {blog.description}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link href={`/blogpost/${blog.slug}`} className="w-full">
                    <Button
                      className="
                        w-full cursor-pointer rounded-full
                        bg-gradient-to-br from-blue-500/20 to-cyan-500/10
                        border border-blue-500/40 text-blue-300 font-semibold
                        py-2.5
                        transition-all duration-300
                        hover:from-zinc-800 hover:to-zinc-900 hover:text-white
                        hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.6)]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
                      "
                    >
                      Read More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogsPage;
