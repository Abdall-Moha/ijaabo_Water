import { Link } from "react-router-dom";

export default function Brand({ light = false }) {
  return (
    <Link
      className={light ? "block w-40 rounded bg-white p-1 sm:w-44" : "block w-36 sm:w-40"}
      to="/"
      aria-label="Ijaabo Water home"
    >
      <img className="block h-auto w-full object-contain" src="/Ijaabo Logo.webp" alt="Ijaabo Water" />
    </Link>
  );
}
