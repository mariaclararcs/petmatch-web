'use client';

import { useState } from 'react';

export default function NavbarAdministrative() {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold">PetMatch!</span>
          </div>

          <div className="flex space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsOpen1(!isOpen1)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Usuários
              </button>
              
              {isOpen1 && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Gerenciar Usuários
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsOpen2(!isOpen2)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Animais
              </button>
              
              {isOpen2 && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu">
                    <a
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Gerenciar Animais
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}