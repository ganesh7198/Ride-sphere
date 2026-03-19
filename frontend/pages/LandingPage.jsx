import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <>
      <style>{`
        body {
          background-color: #faf6ed;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          margin: 0;
        }
      `}</style>

      {/* MAIN CONTAINER — full screen */}
      <div className="w-full h-screen flex flex-col bg-[#faf6ed]">
        {/* NAVBAR — fixed at the top */}
        <div className="flex items-center justify-between px-6 py-4 md:px-10 lg:px-16 border-b border-stone-200/70">
          <h1 className="text-2xl font-light tracking-wide text-stone-700">
            Ride<span className="font-medium text-amber-700">Sphere</span>
          </h1>
          <div className="flex gap-3 text-sm">
            <button className="px-4 py-2 text-stone-600 hover:text-stone-900 transition">
              <Link to={"/login"}>Login</Link>
            </button>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition shadow-sm">
              <Link to={"/sign"}>Sign up</Link>
            </button>
          </div>
        </div>

        {/* CONTENT ROW — image left (reduced), text right */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* LEFT SIDE — IMAGE (smaller) */}
          <div className="md:w-2/5 h-64 md:h-full flex items-center justify-center p-4 md:p-6 lg:p-8">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-md">
              <img
                src="https://i.pinimg.com/1200x/fa/09/ab/fa09ab612510c5d95f9dc645fe3c1bf0.jpg"
                alt="motorcycle ride"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT SIDE — TEXT CONTENT (takes remaining space) */}
          <div className="md:w-3/5 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-6 md:py-0">
            {/* MAIN HEADLINE */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-800 leading-tight">
              Your Next Adventure Awaits
            </h2>
            <p className="text-lg text-stone-600 mt-4 max-w-md">
              Discover riders, create unforgettable journeys, and track your
              rides in real‑time with RideSphere.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col md:flex-row-reverse">
        {/* IMAGE — now on RIGHT */}
        <div className="md:w-2/5 h-64 md:h-full flex items-center justify-center p-4 md:p-6 lg:p-8">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-md">
            <img
              src="https://i.pinimg.com/1200x/c3/13/6a/c3136a7dad00e6ba319714695cde0bdb.jpg"
              alt="post "
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* TEXT — now on LEFT */}
        <div className="md:w-3/5 flex flex-col justify-center px-6 md:px-10 lg:px-16 py-6 md:py-0">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-800 leading-tight">
            “Document your rides and let others ride along with you.”
          </h2>
          <p className="text-lg text-stone-600 mt-4 max-w-md">
            Upload photos, add details, and let your adventures speak for
            themselves
          </p>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
