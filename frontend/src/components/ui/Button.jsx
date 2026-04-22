export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  style,
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      type={type}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}