type Props = {
  name: "copy" | "x" | "info";
  size?: number;
};

export default function Icon({ name, size = 18 }: Props) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const };

  if (name === "copy") {
    return (
      <svg {...common}>
        <path
          fill="currentColor"
          d="M8 7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3V7Zm3-1a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-7Z"
        />
        <path
          fill="currentColor"
          d="M4 8a3 3 0 0 1 3-3h1a1 1 0 1 1 0 2H7a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8Z"
        />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...common}>
        <path
          fill="currentColor"
          d="M18.3 5.7a1 1 0 0 1 0 1.4L13.4 12l4.9 4.9a1 1 0 1 1-1.4 1.4L12 13.4l-4.9 4.9a1 1 0 0 1-1.4-1.4l4.9-4.9-4.9-4.9a1 1 0 0 1 1.4-1.4l4.9 4.9 4.9-4.9a1 1 0 0 1 1.4 0Z"
        />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path
        fill="currentColor"
        d="M12 22a10 10 0 1 1 0-20a10 10 0 0 1 0 20Zm0-18a8 8 0 1 0 0 16a8 8 0 0 0 0-16Zm0 4a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 12 8Zm-1 4a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0v-5Z"
      />
    </svg>
  );
}