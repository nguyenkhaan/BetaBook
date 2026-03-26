import React from 'react';
import BookstoreMegaMenu from '../components/layout/BookstoreMegaMenu';

export const BookstoreDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <BookstoreMegaMenu />
      
      {/* Content Placeholder */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-100 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to our Online Bookstore</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            This demo showcases the high-fidelity desktop navigation menu with a comprehensive mega menu system, 
            organized categories, and a 12-column grid layout.
          </p>
          
          <div className="grid grid-cols-3 gap-8 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400">
                Book Cover {i}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookstoreDemoPage;
