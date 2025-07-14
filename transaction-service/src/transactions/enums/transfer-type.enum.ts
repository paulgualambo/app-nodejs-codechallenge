export enum TransferType {
  DEBITO = 1,
  CREDITO = 2,
}

export const getTransactionTypeName = (typeId: number): string => {
  switch (typeId) {
    case TransferType.DEBITO:
      return 'Débito';
    case TransferType.CREDITO:
      return 'Crédito';
    default:
      return 'Desconocido'; // Un valor por defecto por si acaso
  }
};
