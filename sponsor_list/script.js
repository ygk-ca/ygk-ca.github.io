handleFile()
const excludedHeadings = ['City', 'State Or Province', 'Country/Region', 'Fax', 'Ownership Type', 'Tradestyle', 'Pre Tax Profit (USD)', 'Assets (USD)', 'Liabilities (USD)', 'Entity Type', 'Ticker', 'Address Line 2', 'Address Line 3', 'Company Email', 'D-U-N-S® Number', 'Employees (Single Site)', 'Is Headquarters', 'Parent Country/Region', 'Direct Marketing Status', 'Source', 'Key ID', 'TPS Flag', 'ANZSIC 2006 Description', 'ANZSIC 2006 Code', 'NACE Rev 2 Description', 'NACE Rev 2 Code', 'ISIC Rev 4 Description', 'Global Ultimate Country/Region',    'D&B Hoovers Industry',    'US 8-Digit SIC Code',    'US 8-Digit SIC Description',    'US SIC 1987 Code',    'US SIC 1987 Description',    'NAICS 2022 Code',    'NAICS 2022 Description',   'UK SIC 2007 Code',    'UK SIC 2007 Description',    'ISIC Rev 4 Code', 'Global Ultimate Company'];
function handleFile() {
  //const fileInput = document.getElementById('csvFile');
  //const file = fileInput.files[0];

//   if (file) {
//     const reader = new FileReader();
//     reader.onload = function (event) {
//       const contents = event.target.result;
//       const table = createTableFromCSV(contents);
//       displayTable(table);
//     };
//     reader.readAsText(file);
//   } else {
    fetchDefaultCSVFile()
      .then((response) => response.text())
      .then((contents) => {
        const table = createTableFromCSV(contents);
        displayTable(table);
      })
    //   .catch((error) => console.error('Error loading default CSV file:', error));
//   }
}

function createTableFromCSV(csvData) {
const rows = csvData.split('\n');
const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');
tbody.id = "myTable";
table.classList.add('table', 'table-bordered', 'table-striped');


const headings = parseCSVRow(rows[0]);
const filteredHeadings = headings.filter(
(heading) => !excludedHeadings.includes(heading)
);

const headerRow = document.createElement('tr');
for (let i = 0; i < filteredHeadings.length; i++) {
const cell = document.createElement('th');
const heading = filteredHeadings[i];
if (heading === 'Sales (USD)') {
cell.textContent = formatSalesHeading(heading);
} else if (heading === 'URL') {
cell.textContent = formatURLHeading(heading);
}
else {
cell.textContent = heading;
}
headerRow.appendChild(cell);
}
thead.appendChild(headerRow);

for (let i = 1; i < rows.length; i++) {
const cells = parseCSVRow(rows[i]);
const filteredCells = cells.filter(
(_, index) => !excludedHeadings.includes(headings[index])
);

if (filteredCells.length === 0) continue; // Skip empty rows

const row = document.createElement('tr');
for (let j = 0; j < filteredCells.length; j++) {
const cell = document.createElement('td');
if (filteredHeadings[j] === 'Sales (USD)') {
cell.textContent = formatSalesValue(filteredCells[j]);
} 
else if (filteredHeadings[j] === 'URL') {
cell.innerHTML = createLinkElement(filteredCells[j]);
}
else if (filteredHeadings[j] === 'D&B Legal Status Type') {
  if (filteredCells[j] === 'Corporation') {
    cell.textContent = 'D&B Corporation (DBC)';
  }
  else {
    cell.textContent = formatLegalStatus(filteredCells[j]);
  }
}
else {
cell.textContent = filteredCells[j];
}
row.appendChild(cell);
}
tbody.appendChild(row);
}

table.appendChild(thead);
table.appendChild(tbody);
return table;
}

function formatLegalStatus(heading) {
  const emptyValueText = 'D&B Non-Listed (DBN)';
  return emptyValueText;
}

function formatURLHeading(heading) {
return heading;
}

function formatSalesHeading(heading) {
return heading;
}

function createLinkElement(url) {
const link = document.createElement('a');
link.href = url;
link.target = '_blank';
link.textContent = url;
return link.outerHTML;
}

function formatSalesValue(value) {
const parsedValue = parseFloat(value);
if (isNaN(parsedValue)) {
return 'Unknown';
}
const formattedValue = parsedValue.toFixed(2);
return '$' + formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}



function parseCSVRow(row) {
  let insideQuotes = false;
  const cells = [];
  let currentCell = '';

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      cells.push(currentCell.trim());
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  cells.push(currentCell.trim());
  return cells;
}

function displayTable(table) {
  const oldTable = document.getElementById('dataTable');
  oldTable.parentNode.replaceChild(table, oldTable);
}

function fetchDefaultCSVFile() {
  const defaultCSVFile = 'default.csv';
  return fetch(defaultCSVFile);
}
$(document).ready(function(){
    $("#myInput").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#myTable tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });