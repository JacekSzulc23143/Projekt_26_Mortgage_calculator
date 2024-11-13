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
			alert("Wkład własny nie może stanowić 100% kwoty kredytu");
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
