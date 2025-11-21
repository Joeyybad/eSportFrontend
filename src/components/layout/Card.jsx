function Card({
  title,
  subtitle,
  children,
  className = "",
  headerRight,
  compact = false,
  centerHeader = true,
  ...props
}) {
  return (
    <section
      role="region"
      aria-label={title || "Card"}
      className={`bg-white rounded-lg shadow-sm ${
        compact ? "p-3" : "p-6"
      } ${className}`}
      {...props}
    >
      {(title || subtitle || headerRight) && (
        <header
          className={`mb-4 ${
            headerRight
              ? "flex items-start justify-between gap-3"
              : centerHeader
              ? "text-center"
              : ""
          }`}
        >
          <div className={centerHeader && !headerRight ? "w-full" : ""}>
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}

            {subtitle && (
              <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
            )}
          </div>

          {headerRight && <div>{headerRight}</div>}
        </header>
      )}

      <div>{children}</div>
    </section>
  );
}

export default Card;
