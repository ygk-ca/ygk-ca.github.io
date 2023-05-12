
function formatCurrency(number) {
    return '$' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Read the CSV file
function readCSVFile(filePath) {
    const request = new XMLHttpRequest();
    request.open("GET", filePath, true);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            const contents = request.responseText;
            const lines = contents.split("\n");

            for (let i = 1; i < lines.length; i++) { // Start from index 1 to skip the header row
                const cells = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (cells.length === 7) {
                    const row = document.createElement("tr");

                    for (let j = 0; j < cells.length; j++) {
                        const cell = document.createElement("td");
                        if (j === 5) { // Format the "Revenue (USD)" column
                            cell.textContent = formatCurrency(cells[j]);
                        } 
                        else if (j === 4) { // Create a link for the "URL" column
                            const link = document.createElement("a");
                            link.href = cells[j];
                            link.textContent = cells[j];
                            cell.appendChild(link);
                          }
                        else {
                            cell.textContent = cells[j];
                        }
                        row.appendChild(cell);
                    }

                    document.getElementById("tableBody").appendChild(row);
                }
            }

            // Hide the loading screen and show the table
            document.getElementById("loadingScreen").style.display = "none";
            document.getElementById("mainContent").style.display = "table";
            document.getElementById("mainContent").style.display = "h1";
        }
    };
    request.send();
}
// Sort table by column
function sortTable(columnIndex, ascending) {
const table = document.getElementById("companyTable");
const rows = Array.from(table.querySelectorAll("tbody tr"));

rows.sort((rowA, rowB) => {
const cellA = rowA.cells[columnIndex].textContent;
const cellB = rowB.cells[columnIndex].textContent;

if (columnIndex === 5) { // Sort "Revenue (USD)" column numerically
const revenueA = parseInt(cellA.replace(/[^0-9.-]+/g, ""));
const revenueB = parseInt(cellB.replace(/[^0-9.-]+/g, ""));
return ascending ? revenueA - revenueB : revenueB - revenueA;
} else { // Sort other columns alphabetically
return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
}
});

const tableBody = document.getElementById("tableBody");
rows.forEach(row => {
tableBody.appendChild(row);
});
}

// Initialize column sorting functionality
function initializeSorting() {
const tableHeaders = document.querySelectorAll("#companyTable th[data-column]");
tableHeaders.forEach(header => {
header.addEventListener("click", () => {
  const column = header.getAttribute("data-column");
  const sortArrow = header.querySelector(".sort-arrow");

  // Toggle sort direction
  let ascending = true;
  if (sortArrow.classList.contains("asc")) {
    sortArrow.classList.remove("asc");
    sortArrow.classList.add("desc");
    ascending = false;
  } else {
    sortArrow.classList.remove("desc");
    sortArrow.classList.add("asc");
  }

  // Clear sort arrow from other headers
  tableHeaders.forEach(otherHeader => {
    if (otherHeader !== header) {
      otherHeader.querySelector(".sort-arrow").classList.remove("asc", "desc");
    }
  });

  // Update sort arrow of the clicked header
  if (ascending) {
    sortArrow.classList.remove("desc");
    sortArrow.classList.add("asc");
  } else {
    sortArrow.classList.remove("asc");
    sortArrow.classList.add("desc");
  }

  // Sort the table
  sortTable([...header.parentNode.children].indexOf(header), ascending);
});
});
}

readCSVFile('/top_revenue.csv');
initializeSorting();