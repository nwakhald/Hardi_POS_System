import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Upcoming Works", path: "/projects/upcoming" },
    { name: "Working Progress", path: "/projects/in-progress" },
    { name: "Payments Due", path: "/projects/payments-due" },
    { name: "History", path: "/projects/history" },
    { name: "Team Members", path: "/team-members" },
    { name: "Profit", path: "/profit" },
    
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">Camera Manager</h2>

      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}