document.addEventListener('DOMContentLoaded', function(){
	const search = document.getElementById('search');
	const cardsContainer = document.getElementById('bookmarks');
	const cards = Array.from(cardsContainer.querySelectorAll('.card'));
	const themeToggle = document.getElementById('themeToggle');

	// Theme handling
	function setTheme(name){
		if(name === 'light') document.body.setAttribute('data-theme','light');
		else document.body.removeAttribute('data-theme');
		localStorage.setItem('bm-theme', name);
		if(themeToggle) themeToggle.textContent = name === 'light' ? '🌞' : '🌗';
	}

	const saved = localStorage.getItem('bm-theme') || 'dark';
	setTheme(saved);

	if(themeToggle){
		themeToggle.addEventListener('click', () => {
			const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
			setTheme(current === 'light' ? 'dark' : 'light');
		});
	}

	const resultsCount = document.getElementById('resultsCount');

	function filter(term){
		const q = term.trim().toLowerCase();
		let visible = 0;
		cards.forEach(card => {
			const title = (card.dataset.title || card.querySelector('h3')?.textContent || '').toLowerCase();
			const desc = (card.querySelector('p')?.textContent || '').toLowerCase();
			const match = q === '' || title.includes(q) || desc.includes(q);
			card.classList.toggle('hidden', !match);
			if(match) visible++;
		});
		if(resultsCount) resultsCount.textContent = visible === 0 ? 'No bookmarks found' : `${visible} bookmark${visible>1?'s':''} shown`;
	}

	search.addEventListener('input', e => filter(e.target.value));

	// keyboard: open first visible card with Enter while focused on search
	search.addEventListener('keydown', e => {
		if(e.key === 'Enter'){
			const first = cards.find(c => c.style.display !== 'none');
			const link = first?.querySelector('a');
			if(link) link.click();
		}
	});

	// Make cards clickable and keyboard actionable (Enter)
	cards.forEach(card => {
		const href = card.dataset.href || card.querySelector('a')?.href;
		if(href){
			card.addEventListener('click', (e) => {
				// allow clicking inside the link to behave normally
				const targetIsLink = e.target.closest('a');
				if(targetIsLink) return;
				window.open(href, '_blank');
			});
			card.addEventListener('keydown', (e) => {
				if(e.key === 'Enter') window.open(href, '_blank');
			});
		}
	});
});