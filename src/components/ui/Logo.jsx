import logoImg from "../../assets/images/06052312.jpg";
function Logo({ size = 100 }) {
  return (
    <img
      src={logoImg}
      alt="Logo"
      style={{ width: size, height: size, borderRadius: "50%" }}
      className="object-cover"
    />
  );
}
export default Logo;
