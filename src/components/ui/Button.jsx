function Button({
  text,
  color,
  textColor,
  onClick,
  className = "",
  style = {},
  children,
}) {
  return (
    <button
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
