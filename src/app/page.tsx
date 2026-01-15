'use client';

import { IParallax, Parallax, ParallaxLayer } from '@react-spring/parallax';
import { TbTopologyStarRing, TbTopologyComplex, TbTopologyRing2, TbTopologyRing3, TbTopologyStarRing2, TbDownload, TbDeviceMobile, TbCloud } from "react-icons/tb";
import { TypeAnimation } from 'react-type-animation';
import Image from 'next/image';
import { useRef } from 'react';
import Footer from './components/footer';
import { Montserrat } from "next/font/google";
import Link from 'next/link';
import { FaCheckCircle, FaChevronDown, FaCompass, FaFeatherAlt } from 'react-icons/fa';
import { FaWandSparkles } from "react-icons/fa6";
import { useTheme } from 'next-themes';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify the font weights you need
  display: 'swap',       // Optimize font rendering
});

export default function Page() {
  const parallaxRef = useRef<IParallax | null>(null);
  const { theme } = useTheme()

  const handleScrollToNext = (pageIndex: number) => {
    if (parallaxRef.current) {
      parallaxRef.current.scrollTo(pageIndex);
    }
  };

  return (
    <main className="relative mt-8 bg-background dark:bg-background">
      <Parallax ref={parallaxRef} pages={4} style={{ backgroundColor: 'hsl(var(--background))' }}>
        {/* Welcome Section */}
        <ParallaxLayer
          offset={0}
          speed={2}
          factor={1.1}
          className="relative grid place-content-center h-full"
          style={{
            backgroundImage: "linear-gradient(0deg, hsl(var(--background)) 50%, #FA802F 50%)",
          }}
        />


        <ParallaxLayer
          offset={0}
          speed={0.5}
          className='relative grid place-content-center h-full'
        >
          <h1
            className="text-[21vw] lg:text-[18vw] absolute top-10 left-1/2 -translate-x-1/2 text-white font-bold text-center text-nowrap"
            style={{
              fontFamily: montserrat.style.fontFamily,
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.4)',
            }}
          >
            Zespół 11
          </h1>
        </ParallaxLayer>

        <ParallaxLayer
          offset={0}
          speed={0.2}
          className='relative grid pt-24 place-content-start sm:place-content-center sm:p-0'
        >
          <div className='relative w-full max-w-4xl mx-auto'>
            {/* Blurred background */}
            {/* <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full -translate-y-1/3 scale-125" /> */}
            <div className="w-screen left-1/2 -translate-x-1/2 absolute inset-0 blur-3xl rounded-full bg-accent/20  max-w-3xl sm:-translate-y-8 aspect-square" />

            {/* Image container */}
            <div className='relative z-10 grid place-content-center'>
              <Image
                src={'main.png'}
                alt='Team collaboration illustration'
                width={800}
                height={600}
                className='h-auto w-full max-w-3xl lg:min-w-96 animate-floating drop-shadow-2xl'
              />
            </div>
          </div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={0}
          speed={0.3}
          className="grid place-content-center"
        >
          <div className="backdrop-blur-md bg-card/90 border border-border shadow-2xl py-8 px-6 sm:px-10 text-center rounded-xl space-y-6 max-w-2xl mx-4">
            <h1 className="text-card-foreground text-xl text-nowrap sm:text-4xl font-bold">
              Witamy na stronie <span className="text-accent">Zespołu 11</span>
            </h1>
            <p className="text-muted-foreground sm:text-lg max-w-lg mx-auto">
              Nasz projekt ułatwia integrację w zespole dzięki wspólnemu odkrywaniu opowieści, poznawaniu nowych miejsc i budowie świata na podstawie podejmowanych decyzji.
            </p>
            <div className="font-bold text-lg sm:text-2xl text-foreground">
              <TypeAnimation
                sequence={[
                  'Zintegruj się z zespołem!',
                  1500,
                  'Twórz wyjątkowe historie!',
                  1500,
                  'Odkrywaj nowe miejsca!',
                  1500,
                  'Poznawaj inspirujących ludzi!',
                  1500
                ]}
                wrapper="div"
                speed={40}
                repeat={Infinity}
              />
            </div>

            <div className='flex justify-center items-center pt-2'>
              <button
                className="flex items-center gap-2 sm:text-lg px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-lg shadow-accent/20 transition-all transform hover:scale-105 duration-300"
                onClick={() => handleScrollToNext(1)}
              >
                <span>
                  Zacznij odkrywać!
                </span>
                <FaCompass size={24} />
              </button>
            </div>
          </div>

          <ScrollIndicatorCentered onClick={() => handleScrollToNext(1)} />
        </ParallaxLayer>

        {/* Gamebook Creator Section */}
        <ParallaxLayer
          offset={1}
          speed={0.8}
          factor={1.5}
          className="relative flex justify-end items-center sm:pr-8 place-content-center 
            bg-[linear-gradient(-11deg,hsl(var(--background))_28%,#9C8B73_50%,#9C8B73_50%,hsl(var(--background))_67%)]
            dark:bg-[linear-gradient(-11deg,hsl(var(--background))_28%,#21262d_50%,#21262d_50%,hsl(var(--background))_67%)]
          "
        >
          <div className="scale-[1.6] sm:scale-100 lg:absolute lg:right-36 lg:ml-16 relative">
            <Image
              src={'creator.png'}
              alt="Gamebook creator interface preview"
              width={600}
              height={450}
              className="relative -z-50 h-auto w-full max-w-4xl rounded-xl"
            />
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.4} className="relative">
          {/* Instead of covering the entire background, wrap the text content in a subtle overlay */}
          <div className="relative z-10 grid place-content-center h-full text-white py-20">
            {/* Mobile Section */}
            <div className="block md:hidden text-center px-6 py-8 rounded-xl
                    bg-card/90 backdrop-blur-md border border-border shadow-xl mx-4 text-card-foreground">
              <h2 className="text-xl sm:text-4xl font-bold mb-6">Gamebook Creator</h2>
              <p className="mb-6 sm:text-lg text-muted-foreground">
                Za pomocą naszego kreatora gier paragrafowych stwórz interaktywne książki przygodowe, które angażują graczy w pełni dynamiczne historie.
              </p>
              <div className="flex justify-center">
                <a
                  className="sm:text-lg px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-lg shadow-accent/20 transition-transform transform hover:scale-105 duration-300 flex items-center justify-center space-x-2"
                  href='https://zesp11.netlify.app'
                >
                  <span>Twórz teraz</span>
                  <FaWandSparkles size={24} />
                </a>
              </div>
            </div>

            {/* Desktop Section */}
            <div className="hidden md:grid lg:grid-cols-2 gap-8 max-w-7xl px-4 items-center">
              {/* Text content with a subtle background overlay */}
              <div className="space-y-6 text-card-foreground p-8 rounded-xl
                     bg-card/80 backdrop-blur-md border border-border shadow-xl">
                <h2 className="text-4xl font-bold">
                  <span className="text-accent">Twórz</span> Niezwykłe Historie
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Za pomocą naszego kreatora gier paragrafowych stwórz interaktywne książki przygodowe, które angażują graczy w pełni dynamiczne historie.
                </p>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-accent" />
                    Intuicyjny edytor wizualny
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-accent" />
                    Integracja multimediów
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-accent" />
                    Asystent AI wspomagający Twoją twórczość
                  </li>
                  <li className="flex items-center gap-3">
                    <FaCheckCircle className="text-accent" />
                    Tryb wieloosobowy dla wspólnej zabawy
                  </li>
                </ul>

                <div className="flex justify-center pt-6">
                  <a
                    className="sm:text-lg px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-lg shadow-accent/20 transition-all transform hover:scale-105 duration-300 flex items-center justify-center space-x-2"
                    href="https://zesp11.netlify.app"
                  >
                    <span>Twórz teraz</span>
                    <FaWandSparkles size={24} />
                  </a>
                </div>
              </div>
            </div>


            <ScrollIndicatorCentered onClick={() => handleScrollToNext(2)} />
          </div>
        </ParallaxLayer>

        {/* Mobile App Section */}

        <ParallaxLayer
          offset={2}
          speed={0.8}
          factor={1.5}
          className="relative grid place-content-center 
    bg-[linear-gradient(11deg,hsl(var(--background))_28%,#9C8B73_50%,#9C8B73_50%,hsl(var(--background))_67%)]
    dark:bg-[linear-gradient(11deg,hsl(var(--background))_28%,#21262d_50%,#21262d_50%,hsl(var(--background))_67%)]"
        />
        <ParallaxLayer
          offset={2}
          speed={0.5}
          className='relative hidden sm:block'
        >
          <div className="text-accent absolute top-1/3 right-28">
            <TbTopologyStarRing size={64} />
          </div>
          <div className="text-accent absolute top-10 right-1/4">
            <TbTopologyComplex size={72} />
          </div>
          <div className="text-accent absolute top-20 left-1/2">
            <TbTopologyRing3 size={96} />
          </div>
          <div className="text-accent absolute bottom-1/3 left-1/3">
            <TbTopologyRing2 size={72} />
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={0.2}
          className='relative hidden sm:block'
        >
          <div className="text-accent absolute bottom-1/4 right-1/4">
            <TbTopologyRing2 size={64} />
          </div>
          <div className="text-accent absolute top-1/4 right-1/4">
            <TbTopologyComplex size={48} />
          </div>
          <div className="text-accent absolute top-1/3 left-1/3">
            <TbTopologyRing3 size={48} />
          </div>
          <div className="text-accent absolute top-1/4 right-3/4">
            <TbTopologyStarRing2 size={88} />
          </div>
          <div className="text-accent absolute top-1/2 left-1/4">
            <TbTopologyStarRing size={32} />
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={0.8}
          className='relative'
        >
          <div className="text-accent absolute bottom-8 right-1/3">
            <TbTopologyComplex size={54} />
          </div>
          <div className="text-accent absolute top-4 left-4">
            <TbTopologyStarRing size={64} />
          </div>
          <div className="text-accent absolute bottom-1/4 left-[10%]">
            <TbTopologyStarRing size={108} />
          </div>
          <div className="text-accent absolute bottom-1/4 right-10">
            <TbTopologyStarRing size={64} />
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={1.1}
          className='relative flex justify-end md:block items-center pr-8'
        >
          <Image
            src={'phone.png'}
            alt=''
            width={400}
            height={300}
            className='h-auto w-80 sm:w-96 md:left-16 md:top-1/4 lg:w-96 lg:left-[15%] sm:absolute sm:top-1/5 lg:top-[20%] sm:left-1/4 sm:h-auto animate-floating'
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2}
          speed={0.3}
          className="text-white py-20 grid place-content-center"
        >
          <div className='w-full'>
            <div className="block md:grid md:grid-cols-[1fr_2fr] lg:grid-cols-2 gap-12 max-w-7xl md:px-4 items-center">
              <div />
              <div
                className="space-y-6 text-card-foreground px-8 py-8 rounded-xl
                     bg-card/80 backdrop-blur-md border border-border shadow-xl">
                <h2 className="text-xl text-center sm:text-left lg:text-4xl sm:text-2xl font-bold">
                  Twoja Przygoda w<span className="text-accent"> Każdej Kieszeni</span>
                </h2>
                <p className="text-lg sm:leading-relaxed text-muted-foreground">
                  Zawsze miej swoje książki przygodowe pod ręką dzięki naszej aplikacji
                  mobilnej
                </p>

                <div className="hidden sm:grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <TbDeviceMobile className="text-3xl text-accent mb-2" />
                    <h3 className="font-semibold text-foreground">Mobilność</h3>
                    <p className="text-sm text-muted-foreground">urządzenia z systemem Android</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-border">
                    <TbCloud className="text-3xl text-accent mb-2" />
                    <h3 className="font-semibold text-foreground">Synchronizacja</h3>
                    <p className="text-sm text-muted-foreground">Dane zawsze aktualne</p>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <div className="relative group">
                    <a
                      href="/gotale.apk"
                      download
                      className="sm:text-lg px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-lg shadow-accent/20 transition-all transform hover:scale-105 duration-300 flex items-center justify-center space-x-2"
                      onClick={(e) => {
                        e.preventDefault();
                        const notification = document.getElementById('apk-notification');
                        if (notification) {
                          notification.classList.remove('opacity-0');
                          notification.classList.add('opacity-100');
                          setTimeout(() => {
                            notification.classList.remove('opacity-100');
                            notification.classList.add('opacity-0');
                          }, 3000);
                        }
                      }}
                    >
                      <TbDownload className="text-xl" />
                      <span>Pobierz aplikację</span>
                    </a>
                    <div
                      id="apk-notification"
                      className="fixed bottom-4 right-4 bg-popover text-popover-foreground border border-border px-4 py-2 rounded-lg shadow-lg opacity-0 transition-opacity duration-300 z-50 pointer-events-none"
                    >
                      Aplikacja nie jest publicznie dostępna
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <ScrollIndicatorCentered onClick={() => handleScrollToNext(3)} />
        </ParallaxLayer>


        {/* Final Section */}
        <ParallaxLayer
          offset={2.96}
          speed={0.3}
          factor={2.5}
          className='relative flex justify-start sm:justify-end md:block items-center pr-8'
        >
          <Image
            src={theme === 'dark' ? 'moon.png' : "sun.png"}
            alt=''
            width={400}
            height={300}
            className='h-auto left-8 w-32 sm:w-36 top-1/4 md:top-1/4 lg:w-56 md:left-[15%] lg:left-[28%] absolute lg:top-[20%] sm:left-8 sm:h-auto animate-floating'
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={3.26}
          speed={1}
          className='relative hidden justify-end md:block items-center pr-8'
        >
          <Image
            src={"cloud1.png"}
            alt=''
            width={400}
            height={300}
            className='left-4'
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2.98}
          speed={0.25}
          className='relative flex justify-end items-center pr-4 sm:pr-8'
        >
          <Image
            src={"cloud2.png"}
            alt=''
            width={400}
            height={300}
            className='w-52 lg:w-1/4 sm:w-auto sm:right-4 animate-floating'
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={3}
          speed={0.3}
          style={{
            backgroundImage: "url('roofs_and_clouds.png')",
            backgroundSize: "cover",
            backgroundPosition: 'center',
          }}
        />

        <ParallaxLayer
          offset={3}
          speed={0.6}
          style={{
            backgroundImage: "url('city_background.png')",
            backgroundSize: "cover",
            backgroundPosition: 'center',
          }}
        />
        <ParallaxLayer
          offset={3}
          speed={1}
          style={{
            backgroundImage: "url('city_foreground.png')",
            backgroundSize: "cover",
            backgroundPosition: 'center',
          }}
        />
        <ParallaxLayer
          offset={3}
          speed={2}
          style={{
            backgroundImage: "url('waves.png')",
            backgroundSize: "cover",
            backgroundPosition: 'center',
          }}
        />
        <ParallaxLayer
          offset={3}
          speed={0.2}
          className='flex justify-between flex-col relative z-20'
        >
          <div
            className="grid place-content-center h-full py-20"
          >
            <div className="text-center px-8 py-10 text-card-foreground bg-card/90 backdrop-blur-md rounded-xl shadow-2xl border border-border mx-4 max-w-2xl">
              <h2 className="text-xl font-bold mb-4 sm:text-4xl">Gotowy do działania?</h2>
              <p className="mb-8 sm:text-lg text-muted-foreground">
                Dołącz do nas i stwórz swoje interaktywne książki przygodowe!
              </p>

              <div className='flex justify-center'>
                <Link
                  className="sm:text-lg px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg shadow-lg shadow-accent/20 transition-all transform hover:scale-105 duration-300 flex items-center justify-center space-x-2"
                  href="/opis"
                >
                  <span>Rozpocznij teraz</span>
                  <FaFeatherAlt size={24} />
                </Link>
              </div>
            </div>
          </div>

          <div className='absolute bottom-0 w-full'>
            <Footer />
          </div>
        </ParallaxLayer>


      </Parallax>
    </main >
  );
}

function ScrollIndicator({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-8 animate-bounce flex flex-col items-center hover:text-black text-gray-800 dark:text-white/60 dark:hover:text-white transition-colors"
    >
      <span className="text-sm mb-2">Przewiń w dół</span>
      <FaChevronDown className="text-2xl" />
    </button>
  );
}

function ScrollIndicatorCentered({ onClick }: { onClick: () => void }) {
  return (
    <div className='flex justify-center'>
      <ScrollIndicator onClick={onClick} />
    </div>

  );
}