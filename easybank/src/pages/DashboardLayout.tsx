import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { FaWallet } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";


import '../styles/Dashboard/DashboardLayout.css';
import { Fade } from "react-awesome-reveal";
import { useEasyBankStore } from "../store/userStore";

export const DashboardLayout = () => {

  const logout = useEasyBankStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen lateral-dash">
      <Fade direction="left" className="w-25 h-ful p-4 flex flex-col justify-between">
        <aside className="lateral">
          <ul className="space-y-4">

            <div>
              <img className="icon-lat" src="/logo-icon.png" alt="logo-icon" />
            </div>

            <li>
              <NavLink
                to="."
                end
                className={({ isActive }) =>
                  `block lateral-link text-xs ${isActive ? 'text-green-500' : 'text-gray-300'}`
                }
              >
                <MdSpaceDashboard />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="wallet"
                className={({ isActive }) =>
                  `block lateral-link text-xl ${isActive ? 'text-green-500' : 'text-gray-300'}`
                }
              >
                <FaWallet />
              </NavLink>
            </li>

            <li>
              <NavLink
                to="transfer"
                end
                className={({ isActive }) =>
                  `block lateral-link text-xs ${isActive ? 'text-green-500' : 'text-gray-300'}`
                }
              >
                <FaMoneyBillTransfer />
              </NavLink>
            </li>
          </ul>

          <ul className="space-y-4">
            <li>
              <button
                onClick={handleLogout}
                className="block lateral-link text-xl out cursor-pointer"
              >
                <IoLogOut />
              </button>
            </li>
          </ul>
        </aside>
      </Fade>

      <main className="flex-1 p-6 main-dash overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
