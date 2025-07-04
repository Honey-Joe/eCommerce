import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000038] flex justify-center items-center z-50 overflow-y-auto ">
      {/* 
        Added max-h-screen and overflow-y-auto to make modal content scrollable 
        if it exceeds viewport height.
        Also added 'my-10' to allow some spacing on small screens.
      */}
      <div className="bg-white h-[90%] p-6 rounded-lg shadow-lg max-w-md relative my-10  overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
