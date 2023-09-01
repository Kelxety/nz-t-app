export type WarehouseObjectParams = {
  data: string;
  page: number;
  pageSize: number;
  pagination: boolean;
  order: [
    {
      sortColumn: string;
      sortDirection: 'asc' | 'desc';
    },
  ];
};
