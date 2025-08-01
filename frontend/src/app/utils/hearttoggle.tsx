import { useState } from "react";
import clsx from "clsx";

type HeartToggleProps = {
  size?: number;
  initial?: boolean;
  onChange?: (liked: boolean) => void; // for like/unlike semantics
  onClick?: React.MouseEventHandler; // additional side-effects if needed
};

const HeartToggle: React.FC<HeartToggleProps> = ({
  size = 24,
  initial = false,
  onChange,
  onClick,
}) => {
  const [liked, setLiked] = useState(initial);

  const handleClick: React.MouseEventHandler = (e) => {
    setLiked((prev) => {
      const next = !prev;
      onChange?.(next);
      return next;
    });
    onClick?.(e);
  };

  return (
    <button
      type="button"
      aria-label={liked ? "Unlike" : "Like"}
      aria-pressed={liked}
      onClick={handleClick}
      className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-transform active:scale-95"
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx(
          "cursor-pointer transition-colors duration-200",
          liked
            ? "fill-red-600 text-red-600"
            : "text-white hover:text-gray-400"
        )}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 
  7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default HeartToggle;
