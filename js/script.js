
let investment = document.getElementById("investment");
let invest_range = document.getElementById("invest_range");
let rate = document.getElementById("rate");
let rate_range = document.getElementById("rate_range");
let time = document.getElementById("time");
let time_range = document.getElementById("time_range");
let invest_amount = document.getElementById("invest_amount");
let est_return = document.getElementById("est_return");
let total_interest = document.getElementById("total_interest");
let sipChart;


(() => {
    invest_range.value = investment.value;
    rate_range.value = rate.value;
    time_range.value = time.value;
    handleChange(); 
})();


function formatINR(number) {
    return "₹ " + number.toLocaleString("en-IN");
}


function calculateSIP(p, r, t) {
    let monthlyRate = r / 100 / 12;
    let months = t * 12;
    let investedAmount = p * months;
    let futureValue = p * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    let estimatedReturn = futureValue - investedAmount;

    return {
        investedAmount: Math.round(investedAmount),
        estimatedReturn: Math.round(estimatedReturn),
        totalValue: Math.round(futureValue)
    };
}


function handleChange() {
  
    invest_range.value = investment.value;
    rate_range.value = rate.value;
    time_range.value = time.value;

    let p = parseFloat(investment.value);
    let r = parseFloat(rate.value);
    let t = parseFloat(time.value);

    if (p <= 0 || r <= 0 || t <= 0 || isNaN(p) || isNaN(r) || isNaN(t)) {
        alert("Please enter valid input values.");
        investment.value = 500;
        rate.value = 12;
        time.value = 10 ;
        return;
    }

    const results = calculateSIP(p, r, t);

    invest_amount.innerHTML = formatINR(results.investedAmount);
    est_return.innerHTML = formatINR(results.estimatedReturn);
    total_interest.innerHTML = formatINR(results.totalValue);

    updateChart(results.investedAmount, results.estimatedReturn);
}

function updateChart(invested, returns) {
    const ctx = document.getElementById('sipChart').getContext('2d'); 
    const data = {
        labels: ['Invested Amount', 'Est. Returns'],
        datasets: [{
            data: [invested, returns],
            backgroundColor: ['#EEF0FF', '#5367FF'],
            borderWidth: 1
        }]
    };

    if (sipChart) {
        sipChart.data.datasets[0].data = [invested, returns];
        sipChart.update();
    } else {
        sipChart = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return formatINR(context.parsed);
                            }
                        }
                    }
                }
            }
        });
    }
}

invest_range.addEventListener("input", () => {
    investment.value = invest_range.value;
    handleChange();
});

rate_range.addEventListener("input", () => {
    rate.value = rate_range.value;
    handleChange();
});

time_range.addEventListener("input", () => {
    time.value = time_range.value;
    handleChange();
});

investment.addEventListener("input", handleChange);
rate.addEventListener("input", handleChange);
time.addEventListener("input", handleChange);
