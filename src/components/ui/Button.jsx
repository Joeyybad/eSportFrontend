function Button({
  text,
  color,
  textColor,
  onClick,
  className = "",
  style = {},
  children,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={` rounded-md font-medium transition ${className}`}
      style={{
        backgroundColor: color,
        color: textColor,
        ...style,
      }}
    >
      {children || text}
    </button>
  );
}

export default Button;
