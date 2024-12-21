import Head from "next/head";
import { useEffect, useState, useRef } from 'react';
import toast from "react-hot-toast";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export default function Home() {
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [userImage, setUserImage] = useState<string | null>('avatar.jpg');
  const [loading, setLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setFrames(Array.from({ length: 39 }, (_, i) => `/frames/${39 - i}.png`));

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
      a.download = 'my-custom-jersey.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Jersey downloaded successfully.');
    } else {
      toast.error('Canvas is not available.');
    }
  };

  const selectFrame = (index: number) => {
    setCurrentFrame(index);
    const image = new Image();
    image.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    };
    image.src = frames[index];
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 space-y-8 lg:space-y-0 lg:space-x-8">
        <div className="w-full lg:w-1/2 flex flex-col items-center p-4 rounded-md bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg order-2 lg:order-1">
          <canvas
            ref={canvasRef}
            className="border-2 border-gray-700 mb-4 w-full max-w-md rounded-lg shadow-xl"
            width="500"
            height="500"
          ></canvas>

          <div className="flex space-x-4 mt-4">
            <label className="py-2 px-4 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg shadow-md hover:bg-gray-600 hover:text-gray-200 cursor-pointer transition-colors duration-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              UPLOAD
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={downloadImage}
              className="py-2 px-4 bg-gray-700 text-gray-300 rounded-lg shadow-md hover:bg-gray-600 hover:text-gray-200 focus:outline-none transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              DOWNLOAD
            </button>
          </div>

          <div className="hidden">
            <img
              ref={imageRef}
              className="object-cover"
              src={frames[currentFrame]}
              alt={`Frame ${currentFrame}`}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          {/* Scrolling row for smaller screens */}
          <div className="lg:hidden overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300 pb-4">
            {frames.map((frame, index) => (
              <div
                key={index}
                className="inline-block mr-2 last:mr-0 relative group cursor-pointer"
                onClick={() => selectFrame(index)}
              >
                <img
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg shadow-lg transition-all duration-200 border-2"
                  src={frame}
                  alt={`Frame ${index}`}
                  style={{
                    borderColor: currentFrame === index ? '#60A5FA' : 'transparent',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-lg">
                  <span className="text-white text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Responsive grid for larger screens */}
          <div className="hidden lg:grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 overflow-y-auto max-h-[calc(100vh-16rem)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300 p-2">
            {frames.map((frame, index) => (
              <div
                key={index}
                className="relative group cursor-pointer aspect-square"
                onClick={() => selectFrame(index)}
              >
                <img
                  className="w-full h-full object-cover rounded-lg shadow-lg transition-all duration-200 border-2"
                  src={frame}
                  alt={`Frame ${index}`}
                  style={{
                    borderColor: currentFrame === index ? '#60A5FA' : 'transparent',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-50 rounded-lg">
                  <span className="text-white text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

