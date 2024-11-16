let pieChart;

// funkcja aktualizująca wkład własny na podstawie kapitału i procentu
function updateDownpayment() {
	const principal = parseFloat(document.getElementById("principal").value);
	const percentage =
		parseFloat(document.getElementById("downpayment-percentage").value) || 0;

	if (principal && percentage >= 0 && percentage < 100) {
		const downpayment = (percentage / 100) * principal;
		document.getElementById("downpayment").value = downpayment.toFixed(2);
	} else {
		// zresetuj, jeśli wartość jest nieprawidłowa
		document.getElementById("downpayment").value = "";
		if (percentage === 100) {
			alert("Wkład własny nie może stanowić 100% kwoty kredytu.");
		}
	}
}

// funkcja aktualizująca procent % na podstawie wkładu własnego
function updatePercentage() {
	const principal = parseFloat(document.getElementById("principal").value);
	const downpayment =
		parseFloat(document.getElementById("downpayment").value) || 0;

	if (principal && downpayment >= 0) {
		const percentage = (downpayment / principal) * 100;
		document.getElementById("downpayment-percentage").value =
			percentage.toFixed(2);
	} else {
		document.getElementById("downpayment-percentage").value = "";
	}
}

// funkcja obliczająca kredyt hipoteczny
function calculateMortgage() {
	const principal = parseFloat(document.getElementById("principal").value);
	const downpayment =
		parseFloat(document.getElementById("downpayment").value) || 0;
	const interestRate = parseFloat(document.getElementById("interest").value);
	const years = parseInt(document.getElementById("years").value);
	const extraPayment =
		parseFloat(document.getElementById("extra-payment").value) || 0;

	//walidacja inputów
	if (!principal || !interestRate || !years) {
		alert("Wypełnij wszystkie pola prawidłowymi liczbami.");
		return;
	}
	if (downpayment >= principal) {
		alert("Wkład własny nie może być większy ani równy kwocie kredytu.");
		return;
	}
	if (extraPayment >= principal - downpayment) {
		alert(
			"Dodatkowa płatność nie może być większa ani równa pozostałej kwocie kredytu."
		);
		return;
	}
	if (interestRate <= 0 || interestRate >= 100) {
		alert("Stopa procentowa musi być większa od 0 i mniejsza od 100.");
		return;
	}

	// formuła do obliczania odsetek
	const monthlyInterestRate = interestRate / 100 / 12;
	const loanAmount = principal - downpayment;

	let remainingBalance = loanAmount;

	const monthlyPayments = years * 12;

	let monthlyPayment =
		(loanAmount * monthlyInterestRate) /
		(1 - Math.pow(1 + monthlyInterestRate, -monthlyPayments));

	let totalInterest = 0;
	let totalMonths = 0;

	while (remainingBalance > 0 && totalMonths < monthlyPayments) {
		totalMonths++;
		const interestPayment = remainingBalance * monthlyInterestRate;

		let principalPayment = monthlyPayment - interestPayment;

		// dla pewności, że ostateczna płatność wyzeruje pozostałe saldo
		if (remainingBalance < principalPayment + extraPayment) {
			principalPayment = remainingBalance;
			remainingBalance = 0;
		} else {
			remainingBalance -= principalPayment + extraPayment;
		}

		totalInterest += interestPayment;
	}

	// rezultat po stronie wynikowej
	document.getElementById("monthly-payment").innerText = (
		monthlyPayment + extraPayment
	).toFixed(2);
	document.getElementById("total-emi").innerText = totalMonths;
	document.getElementById("total-principal").innerText = loanAmount.toFixed(2);
	document.getElementById("total-interest").innerText =
		totalInterest.toFixed(2);

	// zapis w pamięci lokalnej
	const mortgageData = {
		principal: loanAmount,
		numPayments: totalMonths,
		monthlyPayment: monthlyPayment,
		monthlyInterestRate: monthlyInterestRate,
		extraPayment: extraPayment,
	};
	localStorage.setItem("mortgageData", JSON.stringify(mortgageData));

	// włączenie przycisku
	document.getElementById("amortization-button").disabled = false;

	drawPieChart(totalInterest, loanAmount);
}

// funkcja do rysowania wykresu kołowego
function drawPieChart(totalInterest, totalPrincipal) {
	const ctx = document.getElementById("pie-chart").getContext("2d");

	if (pieChart) {
		pieChart.destroy();
	}

	pieChart = new Chart(ctx, {
		type: "pie",
		data: {
			labels: ["kapitał", "odsetki"],
			datasets: [
				{
					label: "Podział kredytu hipotecznego",
					data: [totalPrincipal, totalInterest],
					backgroundColor: ["#9EDDFF", "#6499E9"],
					borderColor: "#fff",
					borderWidth: 1,
				},
			],
		},

		options: {
			responsive: true,
			maintainAspectRatio: false,
		},
	});
}

// funkcja resetująca inputy
function clearFields() {
	document.getElementById("principal").value = "";
	document.getElementById("downpayment").value = "";
	document.getElementById("downpayment-percentage").value = "";
	document.getElementById("interest").value = "";
	document.getElementById("years").value = 30;
	document.getElementById("extra-payment").value = "";
	document.getElementById("monthly-payment").innerText = "0.00";
	document.getElementById("total-emi").innerText = "0.00";
	document.getElementById("total-principal").innerText = "0.00";
	document.getElementById("total-interest").innerText = "0.00";
	document.getElementById("pie-chart").disabled = true;

	// do resetowania wykresu kołowego
	if (pieChart) {
		pieChart.destroy();
	}

	const ctx = document.getElementById("pie-chart").getContext("2d");
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.hight);
}

// funkcja nasłuchująca zmianę kwoty kredytu
document.addEventListener("DOMContentLoaded", function () {
	document.getElementById("principal").addEventListener("input", function () {
		const principal = parseFloat(this.value);
		const downpayment =
			parseFloat(document.getElementById("downpayment").value) || 0;
		const percentage =
			parseFloat(document.getElementById("downpayment-percentage").value) || 0;

		if (principal && downpayment && percentage >= 0 && percentage < 100) {
			const newDownpayment = (percentage / 100) * principal;
			document.getElementById("downpayment").value = newDownpayment.toFixed(2);
		}
	});

	document
		.getElementById("downpayment-percentage")
		.addEventListener("input", updateDownpayment);

	const inputs = document.querySelectorAll('input [type="number"]');
	inputs.forEach(input => {
		input.addEventListener("input", function () {
			const allFilled = Array.from(input).every(
				input => input.value.trim() !== ""
			);
			document.getElementById("amortization-button").disabled = !allFilled;
		});
	});
});

// funkcja wyświetlająca harmonogram amortyzacji
function viewAmortizationPage() {
	window.location.href = "amortization.html";
}

// po załadowaniu strony amortyzacji
if (window.location.pathname.endsWith("amortization.html")) {
	document.addEventListener("DOMContentLoaded", function () {
		const mortgageData = JSON.parse(localStorage.getItem("mortgageData"));

		if (!mortgageData) {
			alert(
				"Brak dostępnych danych o kredytach hipotecznych. Proszę wrócić do strony głównej."
			);
			window.location.href = "index.html";
		}

		const amortizationTable = document.getElementById("amortization-table");
		amortizationTable.innerHTML = "";

		const headerRow = document.createElement("tr");
		headerRow.innerHTML = `
		<th>Miesiąc</th>
		<th>Wysokość Raty</th>
		<th>Odsetki</th>
		<th>Kapitał</th>
		<th>Dodatkowa Płatność</th>
		<th>Saldo</th>
		`;
		amortizationTable.appendChild(headerRow);

		let remainingBalance = mortgageData.principal;

		const totalPayments = mortgageData.numPayments;

		for (let i = 1; i <= totalPayments; i++) {
			const interestPayment =
				remainingBalance * mortgageData.monthlyInterestRate;

			let principalPayment = mortgageData.monthlyPayment - interestPayment;

			let extraPayment = mortgageData.extraPayment;

			if (remainingBalance < principalPayment + extraPayment) {
				principalPayment = remainingBalance;
				extraPayment = 0;
				remainingBalance = 0;
			} else {
				remainingBalance -= principalPayment + extraPayment;
			}

			const row = document.createElement("tr");
			row.innerHTML = `
			<td>${i}</td>
			<td>${(principalPayment + interestPayment + extraPayment).toFixed(2)}</td>
			<td>${interestPayment.toFixed(2)}</td>
			<td>${principalPayment.toFixed(2)}</td>
			<td>${extraPayment.toFixed(2)}</td>
			<td>${remainingBalance.toFixed(2)}</td>
			`;
			amortizationTable.appendChild(row);

			if (remainingBalance <= 0) break;
		}
	});
}
