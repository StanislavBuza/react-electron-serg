import React from 'react'
import ReactToExcel from 'react-html-table-to-excel'

export const TableViewer = ({ sheets }) => {
  let user;
  let labor;
  let storesTickets = {};
  let resultTable = {};

  if (sheets.hasOwnProperty('Users')) {
    user = sheets['Users'].filter(user => user['last_name'] === 'Podcaura')[0];
    labor = sheets['Labors'].filter(job => job['user_id'] === user['user_id']);
    sheets['Tickets to Custom Attributes'].forEach(ticket => {
      if (ticket.value !== 'N/A') {
        if (storesTickets[ticket.value]) {
          storesTickets[ticket.value].push(ticket['ticket_id']);
        } else {
          storesTickets[ticket.value ? ticket.value : 'NoName'] = [ticket['ticket_id']];
        }
      }
    });

    labor.forEach(lab => {
      for (let store in storesTickets) {
        if (storesTickets[store].includes(lab['ticket_id'])) {
          if (resultTable.hasOwnProperty(store)) {
            resultTable[store] += +lab['duration'];
          } else {
            resultTable[store] = lab['duration'];
          }
        }
      }
    });
  }

  console.log('sheets in viewer user', user);
  console.log('sheets in viewer resultTable', resultTable);
  return (
    <>
      <table className="table" id="table-to-xls">
        <thead>
        <tr>
          <th scope="col">UserId</th>
          <th scope="col">Name</th>
          <th scope="col">Duration</th>
          <th scope="col">Location</th>
        </tr>
        </thead>
        <tbody>
        {Object.entries(resultTable).map((el) => (
          <tr key={el}>
            <td>
              {user['user_id']}
            </td>
            <td>
              {user['first_name'] + ' ' + user['last_name']}
            </td>
            <td>
              <span>{el[1]}</span>
            </td>
            <td>
              <span>{el[0]}</span>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      <ReactToExcel
        className="float-end mb-2"
        table="table-to-xls"
        filename="exportedExcelTable"
        sheet="sheet 1"
        buttonText="Export to Excel"
      />
    </>
  )
}
