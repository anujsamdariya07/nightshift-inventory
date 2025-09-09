(async function ImportStockData() {
      const url = "https://stockanalysis.com/api/screener/s/i";

      try {
        const response = await fetch(url);
        const json = await response.json();

        const stockData = json.data.data;
        const tbody = document.querySelector("#stockTable tbody");

        console.log(stockData)

        stockData.forEach(item => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.s}</td>
            <td>${item.n}</td>
            <td>${item.marketCap}</td>
            <td>${item.price}</td>
            <td>${item.change}</td>
            <td>${item.industry}</td>
            <td>${item.volume}</td>
            <td>${item.peRatio}</td>
          `;
          tbody.appendChild(row);
        });
      } catch (err) {
        console.error("Error fetching stock data:", err);
      }
    })()