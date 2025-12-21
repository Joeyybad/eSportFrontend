function Card({
  title,
  subtitle,
  children,
  className = "",
  headerRight,
  compact = false,
  centerHeader = true,
  // Nouveau prop pour l'effet de brillance (glow)
  glow = "none", // 'none', 'green', 'blue', 'purple'
  ...props
}) {
  // Gestion des bordures brillantes
  const glowStyles = {
    none: "border-slate-800 hover:border-slate-700",
    green:
      "border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] animate-pulse-slow",
    blue: "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    purple: "border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]",
  };

  return (
    <section
      className={`
        bg-slate-900/50 backdrop-blur-sm border rounded-xl 
        transition-all duration-300
        ${glowStyles[glow] || glowStyles.none}
        ${compact ? "p-4" : "p-6"} 
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerRight) && (
        <header
          className={`mb-5 ${
            headerRight
              ? "flex items-start justify-between gap-3"
              : centerHeader
              ? "text-center"
              : ""
          }`}
        >
          <div className={centerHeader && !headerRight ? "w-full" : ""}>
            {title && (
              <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                {title}
              </h2>
            )}

            {subtitle && (
              <div className="text-sm text-gray-400 mt-1 font-medium">
                {subtitle}
              </div>
            )}
          </div>

          {headerRight && <div>{headerRight}</div>}
        </header>
      )}

      <div className="text-gray-300">{children}</div>
    </section>
  );
}

export default Card;
