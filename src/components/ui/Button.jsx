function Button({ text, color, onClick, className = "", style = {} }) {
  return (
    <button
      onClick={onClick}
      className={` rounded-md font-medium transition ${className}`}
      style={{
        backgroundColor: color,
        color: "black",
        ...style, //  passe des styles additionnels si besoin
      }}
    >
      {text}
    </button>
  );
}

export default Button;
