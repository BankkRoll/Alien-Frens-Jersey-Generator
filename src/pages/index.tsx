import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import Head from "next/head";
import { useEffect, useState, useRef } from 'react';
import toast from "react-hot-toast";

export default function Home() {
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [userImage, setUserImage] = useState<string | null>('avatar.jpg');
  const [loading, setLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setFrames(Array.from({ length: 39 }, (_, i) => `/frames/${i + 1}.png`));

    const defaultImage = new Image();
    defaultImage.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(defaultImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
      }
      setLoading(false);
    };

    defaultImage.onerror = () => {
      toast.error('Error loading the default image.');
      setLoading(false);
    };

    setLoading(true);
    if (userImage) {
      defaultImage.src = userImage;
    }
  }, []);

  useEffect(() => {
    if (userImage) {
      const image = new Image();
      image.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && imageRef.current) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(imageRef.current, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        setLoading(false);
      };

      image.onerror = () => {
        toast.error('Error loading the user image.');
        setLoading(false);
      };

      setLoading(true);
      image.src = userImage;
    }
  }, [userImage, currentFrame]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserImage(reader.result as string);
        toast.success('File uploaded successfully.');
      };

      reader.onerror = () => {
        toast.error('Error reading the file.');
        setLoading(false);
      };

      setLoading(true);
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'my-custom-avatar.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Image downloaded successfully.');
    } else {
      toast.error('Canvas is not available.');
    }
  };

  const selectFrame = (index: number) => {
    setCurrentFrame(index);
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://i.ibb.co/ZTyvs3b/imageedit-6-9270642517.gif" />
        <meta name="description" content="Alien Frens Jersey Generator. Developed with ❤️ by: Bankkroll.eth" />
        <meta name="copyright" content="BR Labs" />
        <meta name="language" content="En" />
        <meta name="summary" content="Alien Frens Jersey Generator. Developed with ❤️ by: Bankkroll.eth" />
        <meta name="author" content="Bankkroll" />
        <meta name="designer" content="Bankkroll" />
        <meta name="copyright" content="BR Labs - Bankkroll" />
        <meta name="owner" content="Bankkroll" />
        <meta name="url" content="https://frensjerseys.vercel.app//" />
        <meta name="identifier-URL" content="https://frensjerseys.vercel.app/" />
        <meta name="og:title" content="Alien Frens Jersey Generator" />
        <meta name="og:type" content="Generator" />
        <meta name="og:url" content="https://frensjerseys.vercel.app/" />
        <meta name="og:image" content="https://i.ibb.co/BrjvgvW/imageedit-8-3480955811.png" />
        <meta name="og:site_name" content="Alien Frens Jersey Generator" />
        <meta name="og:description" content="Alien Frens Jersey Generator. Developed with ❤️ by: Bankkroll.eth" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Frens Jerseys - Bankkroll</title>
      </Head>
      <Header />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}

      <main className="flex-1 max-h-screen flex flex-col lg:flex-row items-start justify-center p-8">
        <div className="w-full lg:w-1/2 overflow-y-auto pr-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 max-h-[90vh] lg:max-h-[60vh] mb-8 lg:mb-0">
          {frames.map((frame, index) => (
            <img
              key={index}
              className="mb-4 cursor-pointer object-cover hover:opacity-75 transition-opacity duration-200"
              src={frame}
              alt={`Frame ${index}`}
              onClick={() => selectFrame(index)}
            />
          ))}
        </div>

        <div className="w-full lg:w-1/2 pl-4 flex flex-col items-center p-4 rounded-md">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-700 mb-4 max-w-full lg:max-w-none"
            width="500"
            height="500"
          ></canvas>

          <label className="py-2 px-4 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg shadow-md hover:bg-gray-600 hover:text-gray-200 cursor-pointer mt-4 transition-colors duration-200">
            UPLOAD
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={downloadImage}
            className="py-2 px-4 bg-gray-700 text-gray-300 rounded-lg shadow-md hover:bg-gray-600 hover:text-gray-200 focus:outline-none mt-4 transition-colors duration-200"
          >
            DOWNLOAD
          </button>

          <div className="hidden">
            <img
              ref={imageRef}
              className="object-cover"
              src={frames[currentFrame]}
              alt={`Frame ${currentFrame}`}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

