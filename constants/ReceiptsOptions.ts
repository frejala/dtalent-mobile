export const sortingList = [
  {
    key: "date_asc",
    label: "Más antiguo",
  },
  {
    key: "date_desc",
    label: "Más reciente",
  },
];

export const filterList = [
  {
    key: "isSended",
    label: "Enviado",
    values: [
      {
        key: "true",
        label: "Sí",
        isSelected: false,
      },
      {
        key: "false",
        label: "No",
        isSelected: false,
      },
    ],
  },
  {
    key: "isReaded",
    label: "Leído",
    values: [
      {
        key: "true",
        label: "Sí",
        isSelected: false,
      },
      {
        key: "false",
        label: "No",
        isSelected: false,
      },
    ],
  },
  {
    key: "isSigned",
    label: "Firmado",
    values: [
      {
        key: "true",
        label: "Sí",
        isSelected: false,
      },
      {
        key: "false",
        label: "No",
        isSelected: false,
      },
    ],
  },
];
