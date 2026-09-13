import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-sib-irani.webp'

export default function NavBar() {
  return (
    <nav className="nav-bar glass">
      <NavLink to="/" className="nav-bar__brand">
        <img src={logo} alt="Sib Irani" className="nav-bar__logo" />
      </NavLink>
      <div className="nav-bar__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/view" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          Public View
        </NavLink>
      </div>
    </nav>
  )
}
