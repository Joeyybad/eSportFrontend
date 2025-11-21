import Logo from "../ui/Logo";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    // caché sur mobile/tablette, affiché et fixé en bas sur desktop (lg+)
    <footer className="hidden lg:block lg:fixed lg:bottom-0 lg:left-0 lg:right-0 bg-white shadow-inner z-40">
      {/* Deuxième niveau */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 py-2 md:py-3 text-sm md:text-base">
        {/* Icônes réseaux sociaux */}
        <div className="flex items-center gap-3 mb-2 md:mb-0 text-gray-700">
          <a href="#" className="hover:text-blue-500">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-blue-400">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaInstagram />
          </a>
        </div>

        {/* Logo + copyright */}
        <div className="flex items-center gap-2 text-gray-700">
          <Logo size={30} /> {/* plus petit sur mobile */}
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
