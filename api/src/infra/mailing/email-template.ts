interface emailTemplateProps {
  recipientName?: string;
  orderStatus?: string;
}

export function emailTemplate({
  recipientName,
  orderStatus,
}: emailTemplateProps) {
  function statusEdit(status: unknown) {
    if (status === 'PICKN_UP') {
      return 'Retirado';
    }

    if (status === 'DONE') {
      return 'Entregue';
    }

    return 'Aguardando';
  }

  return `Olá ${recipientName}! Seu pedido mudou de status para ${statusEdit(orderStatus)}`;
}
