function initText() {
	document.querySelectorAll('[data-term]').forEach(function(elmt) {
		let type = terms[elmt.getAttribute('data-term')];
		elmt.textContent = type[Math.floor(Math.random() * type.length)];
	});
	document.querySelectorAll('[data-date]').forEach(function(elmt) {
		elmt.textContent = new Date().getFullYear() - Math.floor(Math.random() * 35);
	});
	document.querySelectorAll('[data-note]').forEach(function(elmt) {
		elmt.textContent = Math.floor(Math.random() * 75) + '/' + Math.floor(Math.random() * 26 + 75);
	});
}

initText();

document.getElementById('generate').addEventListener('click', () => {
	initText();
});