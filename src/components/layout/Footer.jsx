import Logo from "../ui/Logo";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    // On garde le comportement : caché mobile/tablette, fixé en bas sur desktop
    <footer className="hidden lg:block lg:fixed lg:bottom-0 lg:left-0 lg:right-0 bg-slate-950/90 backdrop-blur-md border-t border-purple-500/20 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 py-3 text-sm">
        {/* Icônes réseaux sociaux avec effet Glow au survol */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition-all transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="https://x.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-all transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
            aria-label="Twitter / X"
          >
            <FaTwitter size={18} />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-pink-500 transition-all transform hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
            aria-label="Instagram"
          >
            <FaInstagram size={18} />
          </a>
        </div>

        {/* Logo + copyright */}
        <div className="flex items-center gap-3 text-gray-400 font-medium">
          <span className="opacity-75">© {new Date().getFullYear()}</span>
          <span className="text-purple-500 font-bold tracking-wider">
            ESPORT EVO
          </span>

          <div className="relative group cursor-pointer">
            {/* Petit effet glow derrière le logo */}
            <div className="absolute inset-0 bg-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative">
              <Logo size={24} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
