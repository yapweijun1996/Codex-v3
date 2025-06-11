export function initReportChart(canvas, rangeSelect) {
  if (!canvas || !window.Chart) return;
  const chart = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'Visitors',
        backgroundColor: '#3498db',
        data: [3, 7, 4, 6]
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
  if (rangeSelect) {
    rangeSelect.addEventListener('change', () => {
      const value = rangeSelect.value;
      if (value === 'week') {
        chart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        chart.data.datasets[0].data = [1, 2, 1, 3, 2, 4, 2];
      } else if (value === 'year') {
        chart.data.labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        chart.data.datasets[0].data = [30, 45, 28, 40];
      } else {
        chart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr'];
        chart.data.datasets[0].data = [3, 7, 4, 6];
      }
      chart.update();
    });
  }
}

let visitorsChart, sourceChart;
export function initAnalyticsCharts(visitorsCanvas, sourceCanvas) {
  if (!visitorsCanvas || !sourceCanvas || !window.Chart) return;
  visitorsChart = new Chart(visitorsCanvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Visitors',
        borderColor: '#3498db',
        fill: false,
        data: [5, 7, 6, 4, 3, 2, 8]
      }]
    },
    options: { responsive: true }
  });
  sourceChart = new Chart(sourceCanvas.getContext('2d'), {
    type: 'pie',
    data: {
      labels: ['Direct', 'Referral', 'Social'],
      datasets: [{
        backgroundColor: ['#3498db', '#9b59b6', '#e74c3c'],
        data: [50, 30, 20]
      }]
    },
    options: { responsive: true }
  });
}

export function updateAnalyticsCharts(startInput, endInput) {
  if (!visitorsChart || !sourceChart) return;
  const start = startInput.value ? new Date(startInput.value) : null;
  const end = endInput.value ? new Date(endInput.value) : null;
  const diff = start && end ? Math.floor((end - start) / 86400000) : 0;
  if (diff >= 30) {
    visitorsChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    visitorsChart.data.datasets[0].data = [10, 12, 8, 15];
    sourceChart.data.datasets[0].data = [40, 35, 25];
  } else {
    visitorsChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    visitorsChart.data.datasets[0].data = [5, 7, 6, 4, 3, 2, 8];
    sourceChart.data.datasets[0].data = [50, 30, 20];
  }
  visitorsChart.update();
  sourceChart.update();
}

let dashboardUserChart;
export function initDashboardCharts(usersCanvas, activityCanvas) {
  if (usersCanvas && window.Chart) {
    dashboardUserChart = new Chart(usersCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Active', 'Suspended'],
        datasets: [{
          backgroundColor: ['#3498db', '#e74c3c'],
          data: [8, 2]
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }
  if (activityCanvas && window.Chart) {
    new Chart(activityCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Logins',
          borderColor: '#9b59b6',
          fill: false,
          data: [3, 5, 4, 6, 3, 2, 7]
        }]
      },
      options: { responsive: true }
    });
  }
}

export function updateDashboardUserChart(active, suspended) {
  if (!dashboardUserChart) return;
  dashboardUserChart.data.datasets[0].data = [active, suspended];
  dashboardUserChart.update();
}
