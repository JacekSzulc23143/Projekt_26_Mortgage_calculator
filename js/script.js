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
			"Dodatkowa płatność nie może być większa ani równa pozostałęj kwocie kredytu."
		);
		return;
	}
	if (interestRate <= 0 && interestRate >= 100) {
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
}
