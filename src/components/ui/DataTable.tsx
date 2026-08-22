interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  getRowKey,
}: Readonly<DataTableProps<T>>) {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row) => (
            <tr
              key={getRowKey(row)}
              className="text-gray-900 dark:text-gray-100"
            >
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-3">
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
