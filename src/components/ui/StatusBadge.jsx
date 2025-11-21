function StatusBadge({ status }) {
  const colors = {
    scheduled: "bg-blue-500",
    live: "bg-green-500",
    completed: "bg-gray-500",
    cancelled: "bg-red-600",
  };

  return (
    <span
      className={`${colors[status]} text-white px-3 py-1 rounded-full text-xs font-semibold`}
    >
      {status === "scheduled" && "Prévu"}
      {status === "live" && "En cours"}
      {status === "completed" && "Terminé"}
      {status === "cancelled" && "Annulé"}
    </span>
  );
}

export default StatusBadge;
