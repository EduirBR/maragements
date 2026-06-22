import { Link } from "react-router";

const NavButton = ({ icon, text, to }) => {
    return (
        <Link to={to || "/"} className="btn btn-ghost btn-sm">
            {icon}
            <span>{text}</span>
        </Link>
    );
};

export default NavButton;
