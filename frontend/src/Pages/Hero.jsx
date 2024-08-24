import React from 'react';

function Header() {
  return (
    <header className="bg-white shadow-md py-4">
      <nav className="container mx-auto p-4 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-gray-800">
          Eka
        </a>
        <ul className="flex items-center">
          <li className="mr-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
          </li>
          <li className="mr-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
          </li>
          <li className="mr-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="bg-cover bg-center h-screen" style={{ backgroundImage: 'url(https://www.eka.care/static/media/hero-bg.6a5a5a5f.jpg)' }}>
      <div className="container mx-auto p-4 text-white">
        <h1 className="text-4xl font-bold mb-4">Take control of your health records</h1>
        <p className="text-lg mb-8">Eka's integrated approach allows you to fetch medical records from hospitals, labs, doctors and even your email!</p>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <ul className="flex flex-wrap justify-center">
          <li className="w-full md:w-1/2 xl:w-1/3 p-4">
            <div className="bg-white shadow-md p-4 rounded">
              <h3 className="text-lg font-bold mb-2">Medical Records</h3>
              <p className="text-gray-600">Fetch medical records from hospitals, labs, and doctors.</p>
            </div>
          </li>
          <li className="w-full md:w-1/2 xl:w-1/3 p-4">
            <div className="bg-white shadow-md p-4 rounded">
              <h3 className="text-lg font-bold mb-2">Medication Management</h3>
              <p className="text-gray-600">Track your medications and receive reminders.</p>
            </div>
          </li>
          <li className="w-full md:w-1/2 xl:w-1/3 p-4">
            <div className="bg-white shadow-md p-4 rounded">
              <h3 className="text-lg font-bold mb-2">Appointment Scheduling</h3>
              <p className="text-gray-600">Schedule appointments with your healthcare providers.</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

export const Hero =()=>{
    return (
        <div>
            <Header />
            <HeroSection />
            <FeaturesSection />
        </div>
    );
}