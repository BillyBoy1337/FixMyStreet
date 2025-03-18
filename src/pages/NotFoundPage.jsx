import React from 'react';

const NotFoundPage = () => {
  return (
    <div className=" fixed  top-0 left-0 w-screen h-screen bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden">
      <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-5 lg:p-10 text-gray-800 relative md:flex items-center text-center md:text-left">
        <div className="w-full md:w-1/2">
          <div className="mb-10 lg:mb-20">
            <svg
              id="logoipsum"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="15 30 147.778 40"
              className="w-48"
            >
              {/* SVG Paths */}
            </svg>
          </div>
          <div className="mb-10 md:mb-20 text-gray-600 font-light">
            <h1 className="font-black uppercase text-2xl lg:text-5xl text-yellow-500 mb-10">
            Looks like some wires got crossed... and a sneaky snake made a mess of things! 🐍⚡
            </h1>
            <p className='text-lg text-gray-600 '>Don't worry, though—our engineers are untangling the chaos.</p>
            <p className='mt-2'><ul>
            Meanwhile, you can:
                <li>        
🔹 Go back to where you came from
                </li>
                <li>🔹 Check the URL for typos
                </li>
                <li>🔹 Return to the homepage and start fresh</li>
                </ul></p>
          </div>
          <div className="mb-10 md:mb-0">
            <button className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-white py-2 px-3 rounded-md bg-blue-500 ">
              <i className="mdi mdi-arrow-left"></i><a href='/'>Go Back</a>
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 text-center flex justify-center items-center">
        <img src='/404.png' alt="404" className="w-96 md:w-[450px] mt-10" />
        </div>
      </div>
      <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
      <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
    </div>
  );
};

export default NotFoundPage;