import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-40

        bg-black/20
        backdrop-blur-2xl

        border-b
        border-white/10

        px-6
        py-4

        flex
        items-center
        justify-between
      "
    >
      {/* Logo */}
      <Link
        to="/"
        className="
          flex
          items-center
          gap-3
        "
      >
        <div
          className="
            w-10
            h-10

            rounded-2xl

            bg-gradient-to-br
            from-cyan-400
            via-sky-500
            to-violet-600

            flex
            items-center
            justify-center

            text-white
            font-bold

            shadow-[0_0_25px_rgba(0,229,255,0.25)]
          "
        >
          R
        </div>

        <div>
          <h1
            className="
              text-white
              font-bold
              text-lg
              tracking-tight
            "
          >
            Revision Tracker
          </h1>

          <p
            className="
              text-xs
              text-slate-400
            "
          >
            Smart Revision System
          </p>
        </div>
      </Link>

      {user && (
        <div
          className="
            flex
            items-center
            gap-5
          "
        >
          <Link
            to="/"
            className="
              text-slate-400
              hover:text-cyan-400
              transition-colors
            "
          >
            Dashboard
          </Link>

          <Link
            to="/subjects"
            className="
              text-slate-400
              hover:text-cyan-400
              transition-colors
            "
          >
            Subjects
          </Link>

          <div
            className="
              h-6
              w-px
              bg-white/10
            "
          />

          {/* User Badge */}
          <div
            className="
              hidden
              md:flex
              items-center
              gap-3

              px-3
              py-2

              rounded-2xl

              bg-white/[0.04]

              border
              border-white/10
            "
          >
            <div
              className="
                w-8
                h-8

                rounded-full

                bg-gradient-to-br
                from-cyan-500
                to-violet-600

                flex
                items-center
                justify-center

                text-white
                text-sm
                font-bold
              "
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </div>

            <span
              className="
                text-sm
                text-white
              "
            >
              {user.name}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              px-4
              py-2

              rounded-2xl

              bg-red-500/10

              border
              border-red-500/20

              text-red-400

              hover:bg-red-500/15
              hover:border-red-500/40

              transition-all
              duration-300
            "
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}