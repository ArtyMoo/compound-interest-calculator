const context = document.getElementById("data-set").getContext("2d");
let line = new Chart(context, {});

// Values from the form
const intialAmount = document.getElementById("initialamount");
const years = document.getElementById("years");
const regular_deposit = document.getElementById("regularDeposit");
const deposit_frequency = document.getElementById("depositFrequency");
const rates = document.getElementById("rates");
const compound = document.getElementById("compound");

// Results
const initialDepositText = document.getElementById("initial-deposit");
const regularDepositText = document.getElementById("regular-deposit");
const totalInterestText = document.getElementById("total-interest");
const totalSavingsText = document.getElementById("total-savings");

// Update result as you type
jQuery(function($) {
	$('[id="initialamount"]').on('change keyup', calculateGrowth);
	$('[id="years"]').on('change keyup', calculateGrowth);
	$('[id="regularDeposit"]').on('change keyup', calculateGrowth);
	$('[id="depositFrequency"]').on('change keyup', calculateGrowth);
	$('[id="rates"]').on('change keyup', calculateGrowth);
	$('[id="compound"]').on('change keyup', calculateGrowth);
});


const data_total_interest = [];
const data_total_savings = [];
const labels = [];

drawGraph();

function calculateGrowth(e) {

    e.preventDefault();
    data_total_interest.length = 0;
    data_total_savings.length = 0;
    labels.length = 0;
    let growth = 0;
    let savings = 0;
    let total_interest = 0;

    if(rates.value > 20 && !$(rates).is(':focus'))
        rates.value = 20;
    else if(isNaN(rates.value))
        rates.value = 0;

    if(years.value > 100 && !$(rates).is(':focus')) 
        years.value = 100;
    
    if((initialamount.value == '' || isNaN(initialamount.value)) && !$(initialamount).is(':focus'))
        initialamount.value = 0;

    if((regular_deposit.value == '' || isNaN(regular_deposit.value)) && !$(regular_deposit).is(':focus'))
        regular_deposit.value = 0;

    try {
        
        const initial = parseInt(intialAmount.value);
        const period = parseInt(years.value);
        const regularDeposit = parseInt(regular_deposit.value); 
        const depositFrequency = parseInt(deposit_frequency.value); 
        const interest = parseInt(rates.value);
        const comp = parseInt(compound.value);

        for(let i = 1; i <= period; i++) {
            
            savings = initial + regularDeposit*i*depositFrequency;

            if(interest <= 0) {

                if(isNaN(interest))
                    interest = 0;
                
                growth = savings.toFixed(2);
            } else {
                growth = calculateCompoundInterest(initial, interest, i, regularDeposit, depositFrequency, comp);
                total_interest = growth - savings;
            }
            
            data_total_interest.push(growth-savings);
            data_total_savings.push(savings);
            labels.push('Years ' + i);
        }
        
        if(!isNaN(growth) && interest <= 20 && period <= 100) {
            drawGraph();
            initialDepositText.innerHTML = `<b>First deposit</b>: ${Number(initial).toLocaleString('en-GB')}€`;
            regularDepositText.innerHTML = `<b>Regular deposits</b>: ${Number(savings-initial).toLocaleString('en-GB')}€`;
            totalInterestText.innerHTML = `<b>Total interest</b>: ${Number(growth-savings).toLocaleString('en-GB')}€`;
            totalSavingsText.innerHTML = `<b>Total savings</b>: ${Number(growth).toLocaleString('en-GB')}€`;
        }

    } catch (error) {
        console.error(error);
    }
}

// formula
function calculateCompoundInterest(initial, interest, period, regularDeposit, depositFrequency, comp) {
    return (
        initial * Math.pow(1 + interest / 100 / comp, comp * period) +
        (regularDeposit * depositFrequency * (Math.pow(1 + interest / 100 / comp, comp * period) - 1)) / (interest / 100 / comp)
    ).toFixed(2);
}

function drawGraph() {
    line.destroy();
    line = new Chart(context, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: "Years",
                    data: data_total_savings,
                    fill: true,
                    backgroundColor: "#871039",
                    borderWidth: 0
                },
                {
                    label: "Interest",
                    data: data_total_interest,
                    fill: true,
                    backgroundColor: "#982A5042",
                    borderWidth: 0
                },
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            x: {
                stacked: true
            },
            y: {
                beginAtZero: true,
                stacked: true
            }
        }
    });
}