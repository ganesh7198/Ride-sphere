import { Link} from "react-router-dom";
import { HiHome, HiGlobeAlt, HiPlusCircle, HiBell } from "react-icons/hi";

function Sidebar() {


  const menu = [
    { name: "Home", path: "/home", icon: <HiHome size={24} /> },
    { name: "Explore", path: "/home/explore", icon: <HiGlobeAlt size={24} /> },
    { name: "Create", path: "/home/create", icon: <HiPlusCircle size={24} /> },
    {
      name: "Notifications",
      path: "/home/notifications",
      icon: <HiBell size={24} />,
    },
  ];

  return (
    <div className="w-48 bg-white border-r h-screen flex flex-col py-8 sticky top-0">
      <div className="flex flex-col gap-4 ">
        {menu.map((item) => {
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-100`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
