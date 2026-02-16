import { SpellerMachine } from "./components/SpellerMachine";

const displayId = 8;

const Display8 = () => {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      {/* CUSTOM RATIO WRAPPER */}
      <div className="aspect-[1/4] w-full max-w-screen overflow-hidden">
          <div className="min-h-full bg-[#0A1A2A] text-white">
            <div className="container mx-auto py-4 sm:py-6 lg:py-8">
              <header className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Periodic Speller
                </h1>
                <p className="text-lg sm:text-xl opacity-90">
                  Discover the elements in your words!
                </p>
              </header>

              <main>
                <SpellerMachine displayId={displayId} />
              </main>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Display8;
