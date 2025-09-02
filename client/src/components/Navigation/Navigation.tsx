// import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import './navigation.css';

export function Navigation() {
    return (
        <nav className="navigation">
            {/* <div> */}
            {/*    <Link to="/" className="go-to-menu">Zpět na menu</Link> */}
            {/* </div> */}
            <div className="links">
                <NavLink to="/events" className={({ isActive }) => isActive ? 'active' : undefined}>Seznam událostí</NavLink>
                <NavLink to="/events/new" className={({ isActive }) => isActive ? 'active' : undefined}>Nová událost</NavLink>
            </div>
        </nav>
    );
}
