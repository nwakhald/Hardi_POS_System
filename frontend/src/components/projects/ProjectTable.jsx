export default function Table({ columns, data, renderActions, detailMode }) {
  if (detailMode) {
    return (
      <div className="table-container">
        <table className="custom-table">
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <th>{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {renderActions && <td>{renderActions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)}>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}