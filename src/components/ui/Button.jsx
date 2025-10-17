function Button({ text, color, onClick }) {
  return (
    <button
      onClick={onClick} //
      style={{
        backgroundColor: color,
        padding: "10px 20px",
        borderRadius: "8px",
        color: "black",
      }}
    >
      {text}
    </button>
  );
}

export default Button;
