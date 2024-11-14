export function parseStatus(status: string) {
  switch (status) {
    case "pending":
      return "pendiente 🕒";
    case "assigned":
      return "en camino al comercio 🏍️";
    case "arrived":
      return "esperando tu pedido 🍛";
    case "dispatched":
      return "en camino a tu ubicación 🏠";
    case "complete":
      return "completado ✅";
    case "canceled":
      return "cancelado ❌";
    default:
      return status;
  }
}
