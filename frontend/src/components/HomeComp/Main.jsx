import React from 'react'

export const Main = () => {
  return (
     <div className="text-center pt-24">
      {/* Header */}
      <h1 className="text-2xl font-semibold">
        Plan your <span className="text-red-500">Perfect Trip</span> to Nepal <span className="text-orange-400">Effortlessly!</span>
      </h1>

      {/* Prompt Input */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Type your prompt here"
          className="w-1/2 p-3 border rounded-xl"
        />
      </div>

      {/* Recently Shared Section */}
      <div className="mt-10">
        <p className="mb-4 text-gray-500 text-center">Recently shared</p>
        <div className="flex gap-6 justify-center flex-wrap px-4">
          <div
            className="w-60 h-40 bg-cover bg-center rounded-xl text-white p-3"
            style={{ backgroundImage: "url('/path/to/img1.jpg')" }}
          >
            <p>5 days adventure trip to Pokhara</p>
          </div>
          <div
            className="w-60 h-40 bg-cover bg-center rounded-xl text-white p-3"
            style={{ backgroundImage: "url('/path/to/img2.jpg')" }}
          >
            <p>7 days trek to Paanchpokhari</p>
          </div>
          <div
            className="w-60 h-40 bg-cover bg-center rounded-xl text-white p-3"
            style={{ backgroundImage: "url('/path/to/img3.jpg')" }}
          >
            <p>10 days safari trip to Nepal</p>
          </div>
        </div>

        {/* Explore More Button */}
        <div className="text-center mt-8">
          <button className="px-4 py-2 border rounded-full hover:bg-gray-200">
            Explore more
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 text-sm text-center text-gray-500">
        By messaging HolidayNepal, you agree to our{' '}
        <a href="#" className="underline">Terms</a> and have read our{' '}
        <a href="#" className="underline">Privacy Policy</a>.
      </footer>
    </div>
  )
}
