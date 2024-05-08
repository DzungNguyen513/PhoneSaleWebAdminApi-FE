
import api from '../Base-url/Url.js';

const apiUrl = api;



// Lấy dữ liệu từ API và vẽ biểu đồ
const fetchDataAndDrawCharts = async () => {
  try {
    const response = await fetch(`${apiUrl}Bill`);
    const data = await response.json();

    // Xử lý dữ liệu để nhóm hóa đơn theo ngày và tính tổng giá trị hóa đơn
    const groupedByCustomer = {};
    const groupedByDate = {};
    data.forEach(item => {
      const date = item.dateBill.split('T')[0];
      const customerId = item.customerId;
      if (!groupedByCustomer[customerId]) {
        groupedByCustomer[customerId] = 0;
      }
      groupedByCustomer[customerId] += item.totalBill;
      if (!groupedByDate[date]) {
        groupedByDate[date] = 0;
      }
      groupedByDate[date] += item.totalBill;
    });

    // Chuẩn bị dữ liệu cho biểu đồ cột
    const customerLabels = Object.keys(groupedByCustomer);
    const customerValues = Object.values(groupedByCustomer);

    // Chuẩn bị dữ liệu cho biểu đồ cột thể hiện tổng giá trị hóa đơn theo ngày
    const dateLabels = Object.keys(groupedByDate);
    const dateValues = Object.values(groupedByDate);

    // Vẽ biểu đồ cột tổng giá trị hóa đơn theo khách hàng
    drawBarChart('barChart', customerLabels, customerValues, 'rgba(255, 99, 132, 0.5)', 'rgba(255, 99, 132, 1)');

    // Vẽ biểu đồ cột tổng giá trị hóa đơn theo ngày
    drawBarChart('lineChart', dateLabels, dateValues, 'rgba(54, 162, 235, 0.5)', 'rgba(54, 162, 235, 1)');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Hàm vẽ biểu đồ cột
const drawBarChart = (canvasId, labels, values, backgroundColor, borderColor) => {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Tổng giá trị hóa đơn',
        data: values,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
};

// Gọi hàm để lấy dữ liệu từ API và vẽ biểu đồ
fetchDataAndDrawCharts();

// Hàm fetch dữ liệu từ API và vẽ biểu đồ tròn
const fetchPieChartDataAndDraw = async () => {
  try {
    const response = await fetch(`${apiUrl}BillDetail`);
    const data = await response.json();

    // Tạo đối tượng để lưu tổng doanh số của từng sản phẩm
    const salesByProduct = {};

    // Tính tổng doanh số của từng sản phẩm
    data.forEach(item => {
      const productName = item.productId;
      if (!salesByProduct[productName]) {
        salesByProduct[productName] = 0;
      }
      salesByProduct[productName] += item.total;
    });

    // Chuẩn bị dữ liệu cho biểu đồ tròn
    const labels = Object.keys(salesByProduct);
    const dataValues = Object.values(salesByProduct);

    // Tạo mảng màu sắc ngẫu nhiên cho biểu đồ tròn
    const backgroundColors = generateRandomColors(labels.length);

    // Vẽ biểu đồ tròn
    drawPieChart('areaChart', labels, dataValues, backgroundColors);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Hàm vẽ biểu đồ tròn
const drawPieChart = (canvasId, labels, dataValues, backgroundColors) => {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: backgroundColors
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Biểu đồ tròn thể hiện tổng giá trị doanh số của các sản phẩm được bán ra'
      }
    }
  });
};

// Hàm sinh màu sắc ngẫu nhiên
const generateRandomColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(getRandomColor());
  }
  return colors;
};

// Hàm sinh màu sắc ngẫu nhiên
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Gọi hàm để fetch dữ liệu và vẽ biểu đồ tròn
fetchPieChartDataAndDraw();


// Lắng nghe sự kiện thay đổi của select box
document.getElementById('filter').addEventListener('change', function(event) {
  const selectedFilter = document.getElementById('filter').value
  console.log(selectedFilter)
  // Lọc dữ liệu và vẽ biểu đồ tương ứng
  filterAndDrawChart(selectedFilter);
});

// Hàm lọc dữ liệu và vẽ biểu đồ tương ứng
const filterAndDrawChart = (selectedFilter) => {
  // Lấy dữ liệu hóa đơn từ API
  fetch(`${apiUrl}Bill`)
  .then(response => response.json())
  .then(data => {
      // Xử lý dữ liệu hóa đơn dựa trên lựa chọn của người dùng
      let groupedData = {};
      switch(selectedFilter) {
          case 'Ngày':
              groupedData = groupDataByDay(data);
              break;
          case 'Tháng':
              groupedData = groupDataByMonth(data);
              break;
          case 'Năm':
              groupedData = groupDataByYear(data);
              break;
          default:
              console.error('Invalid filter selected');
              return;
      }
      // Lấy nhãn và giá trị từ dữ liệu đã nhóm
      const labels = Object.keys(groupedData);
      const values = Object.values(groupedData);
      // Vẽ biểu đồ với dữ liệu đã lọc
      drawBarChart('lineChart', labels, values, 'rgba(54, 162, 235, 0.5)', 'rgba(54, 162, 235, 1)');
  })
  .catch(error => {
      console.error('Error fetching or processing data:', error);
  });
};

// Hàm nhóm dữ liệu theo ngày
const groupDataByDay = (data) => {
  const groupedData = {};
  data.forEach(item => {
      const date = item.dateBill.split('T')[0]; // Lấy ngày từ đối tượng dateBill
      if (!groupedData[date]) {
          groupedData[date] = 0;
      }
      groupedData[date] += item.totalBill;
  });
  return groupedData;
};

// Hàm nhóm dữ liệu theo tháng
const groupDataByMonth = (data) => {
  const groupedData = {};
  data.forEach(item => {
      const month = item.dateBill.split('-')[1]; // Lấy tháng từ đối tượng dateBill
      if (!groupedData[month]) {
          groupedData[month] = 0;
      }
      groupedData[month] += item.totalBill;
  });
  return groupedData;
};

// Hàm nhóm dữ liệu theo năm
const groupDataByYear = (data) => {
  const groupedData = {};
  data.forEach(item => {
      const year = item.dateBill.split('-')[0]; // Lấy năm từ đối tượng dateBill
      if (!groupedData[year]) {
          groupedData[year] = 0;
      }
      groupedData[year] += item.totalBill;
  });
  return groupedData;
};

// Gọi hàm để vẽ biểu đồ ban đầu
fetchDataAndDrawCharts();
