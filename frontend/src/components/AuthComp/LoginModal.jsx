import React, { useEffect, useRef } from 'react';
import LoginCard from "../AuthComp/LoginCard";

export const LoginModal = ({ isOpen, onClose }) => {

   const modalRef = useRef(null);

  // Handle outside click and escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Add event listeners
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Cleanup event listeners
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      // Restore body scroll
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex mt-15 justify-end p-1 z-50 pointer-events-none">
      <div ref={modalRef}  className="pointer-events-auto">
        <LoginCard onClose={onClose} showCloseButton={true} />
      </div>
    </div>
  );
};