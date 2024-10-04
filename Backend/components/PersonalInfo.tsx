import React from 'react';
import Image from 'next/image';

const PersonalInfo: React.FC = () => {
  return (
    <div className="bg-[#1e2329] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">PERSONAL INFO</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm text-gray-400 mb-1">First Name</label>
          <input type="text" value="Arthur" className="w-full bg-[#2c3035] p-2 rounded" readOnly />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Last Name</label>
          <input type="text" value="Breck" className="w-full bg-[#2c3035] p-2 rounded" readOnly />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">E-mail</label>
          <input type="email" value="arthurbreck417@gmail.com" className="w-full bg-[#2c3035] p-2 rounded" readOnly />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone number</label>
          <input type="tel" value="+25475734432" className="w-full bg-[#2c3035] p-2 rounded" readOnly />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Country</label>
          <input type="text" value="Kenya" className="w-full bg-[#2c3035] p-2 rounded" readOnly />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Address</label>
          <input type="text" value="" className="w-full bg-[#2c3035] p-2 rounded" readOnly />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">PROFILE PHOTO</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#2c3035] p-4 rounded">
          <div className="w-32 h-32 mx-auto bg-[#1e2329] rounded-full flex items-center justify-center">
            <Image src="/images/placeholder-avatar.png" alt="Profile" width={100} height={100} className="rounded-full" />
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">Drop a file on the circle above to upload</p>
        </div>
        <div className="bg-[#2c3035] p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">It is not allowed to publish:</h3>
          <ul className="list-disc list-inside text-sm text-gray-400">
            <li>Photos of an explicitly sexual or pornographic nature</li>
            <li>Images aimed at inciting ethnic or racial hatred or aggression</li>
            <li>Photos involving persons under 18 years of age</li>
            <li>Third-party copyright protected photos</li>
            <li>Images larger than 5 MB and in a format other than JPG, GIF or PNG</li>
          </ul>
          <p className="text-sm text-gray-400 mt-4">Your face must be clearly visible on the photo. All photos and images are moderated.</p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;