import { NavLink } from "react-router-dom";

export default function NavBar() {
    return (
        <div className="z-50 mr-2">
        <ul className="flex flex-row space-x-4 gap-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-black dark:text-white underline"
                  : "hover:text-perejil-100 transition-colors"
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/menu"
              className={({ isActive }) =>
                isActive
                  ? "text-black dark:text-white underline"
                  : "hover:text-perejil-100 transition-colors"
              }
            >
              Menu
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-black dark:text-white underline"
                  : "hover:text-perejil-100 transition-colors"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                isActive
                  ? "text-black dark:text-white underline"
                  : "hover:text-perejil-100 transition-colors"
              }
            >
              Contacto
            </NavLink>
          </li>
        </ul>
        </div>
)}