export function transformStatus(status: string): string {
    switch (status) {
      case "WAITING":
      case "PICKN_UP":
        return "pending";
      case "DONE":
        return "done";
      default:
        return status;
    }
  }


  export function statusEdit(status: string): string {
    switch (status) {
      case "WAITING":
        return "aguardando";
      case "PICKN_UP":
        return "retirado";
      case "DONE":
        return "entregue";
      default:
        return status;
    }
  }