// components/self/FloatingInput.tsx

import React from "react";

interface FloatingInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  autoComplete?: string;
  children?: React.ReactNode; // 👈 Add this
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  minLength,
  placeholder = label,
  children,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="peer w-full px-3 pt-5 pb-2 pr-10 text-sm bg-zinc-900 border border-zinc-700 rounded focus:outline-none focus:border-blue-500 placeholder-transparent text-white"
      />
      <label
        htmlFor={name}
        className="absolute left-3 top-1 text-zinc-500 text-xs transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-zinc-400 peer-focus:top-1 peer-focus:text-xs"
      >
        {label}
      </label>
      {/* Icon or anything passed */}
      {children && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-400">
          {children}
        </div>
      )}
    </div>
  );
};

export default FloatingInput;
