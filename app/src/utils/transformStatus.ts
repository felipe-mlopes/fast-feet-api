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