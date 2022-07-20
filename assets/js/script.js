function generateText(paragraphes_number) {

	// Sentences version
	document.querySelectorAll('.sentences p').forEach(function(p) {
		if([...p.parentElement.children].indexOf(p)	< paragraphes_number) {
			p.style.display = '';
		} else {
			p.style.display = 'none';
		}
	});

	// Words version
	document.querySelectorAll('.words p:not(:first-of-type)').forEach(function(p) {
		p.parentNode.removeChild(p);
	});
	let firstWordsBlock = document.querySelector('.words p');
	for (let i = 1; i < paragraphes_number; i++) {
		let clone = firstWordsBlock.cloneNode(true);
		firstWordsBlock.after(clone);
	}

	// Fill terms
	document.querySelectorAll('[data-term]').forEach(function(elmt) {
		let type = terms[elmt.getAttribute('data-term')];
		elmt.textContent = type[Math.floor(Math.random() * type.length)];
	});

	// Fill dates
	document.querySelectorAll('[data-date]').forEach(function(elmt) {
		elmt.textContent = new Date().getFullYear() - Math.floor(Math.random() * 35);
	});

	// Fill notes
	document.querySelectorAll('[data-note]').forEach(function(elmt) {
		elmt.textContent = Math.floor(Math.random() * 75) + '/' + Math.floor(Math.random() * 26 + 75);
	});
}

generateText(document.getElementById('paragraphes-number').value);

document.getElementById('generate').addEventListener('click', () => {
	generateText(document.getElementById('paragraphes-number').value);
});

document.querySelectorAll('.js-copy').forEach(function(btn) {
		btn.addEventListener('click', function() {
			console.log(document.querySelector(this.getAttribute('data-target')).textContent.replace(/^\s+/mg, "").replace(new RegExp('\r?\n','g'), '\n\n'));
		});
	});