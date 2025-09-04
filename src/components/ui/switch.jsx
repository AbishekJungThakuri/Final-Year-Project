
import React, { useState } from "react";

export const Switch = ({ checked, onCheckedChange }) => {
  return (
    <button
      type="button"
      className={`
        relative cursor-pointer inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none 
        ${checked ? 'bg-primary' : 'bg-gray-300'}
      `}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};