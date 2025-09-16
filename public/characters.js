document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('character-grid');
    const searchBar = document.getElementById('search-bar');
    const loadMoreButton = document.getElementById('load-more-characters');
    const filterNav = document.querySelector('.filter-nav');
    const modal = document.getElementById('modal');
    const closeButton = modal.querySelector('.close-button');

    let currentPage = 1;
    let currentCategory = 'All';
    let searchTimeout;

const fetchAndDisplay = async (category, page, shouldAppend = false) => {
    if (!shouldAppend) {
        grid.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
    }
    loadMoreButton.style.display = 'none';
    
    let url = `/api/characters?page=${page}&limit=12`;
    if (category && category !== 'All') url += `&category=${category}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!shouldAppend) grid.innerHTML = '';
        renderGrid(data.results);
        if (data.hasNextPage) {
            loadMoreButton.style.display = 'block';
        }
    } catch (error) { console.error('Failed to fetch characters:', error); }
};

const fetchSearchResults = async (term) => {
    grid.innerHTML = `<div class="loader-container"><div class="loader"></div></div>`;
    filterNav.style.display = 'none';
    loadMoreButton.style.display = 'none';

    if (!term) {
        filterNav.style.display = 'flex';
        fetchAndDisplay(currentCategory, 1, false);
        return;
    }
    try {
        const response = await fetch(`/api/characters/search/${term}`);
        const data = await response.json();
        grid.innerHTML = '';
        renderGrid(data.results);
    } catch (error) { console.error('Failed to fetch search results:', error); }
};

    const renderGrid = (characters) => {
        if (characters.length === 0 && currentPage === 1) {
            grid.innerHTML = `<p style="color: var(--text-light); opacity: 0.7;">No characters found.</p>`;
        }
        characters.forEach(char => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.innerHTML = `
                <div class="character-card-image-wrapper"><img src="${char.image || 'images/placeholder.png'}" alt="${char.name}"></div>
                <div class="character-card-info"><h3>${char.name.toUpperCase()}</h3></div>`;
            card.addEventListener('click', () => openModal(char));
            grid.appendChild(card);
        });
    };

    searchBar.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => { fetchSearchResults(e.target.value.trim()); }, 300);
    });

    filterNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentCategory = e.target.dataset.category;
            currentPage = 1;
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            fetchAndDisplay(currentCategory, currentPage, false);
        }
    });

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchAndDisplay(currentCategory, currentPage, true);
    });






const openModal = (char) => {
    document.getElementById('modal-image').src = char.image || 'images/placeholder.png';
    document.getElementById('modal-name').textContent = char.name.toUpperCase();
    document.getElementById('modal-species').textContent = char.species || 'Unknown';
    document.getElementById('tab-personality').textContent = char.personality || 'No information available.';
    document.getElementById('tab-appearance').textContent = char.appearance || 'No information available.';
    document.getElementById('tab-powers').textContent = char.powersAndAbilities || 'No information available.';
    document.getElementById('tab-history').textContent = char.history || 'No information available.';
    document.getElementById('tab-relationships').textContent = char.relationships || 'No information available.';

    modal.classList.add('active');

    const tabNav = modal.querySelector('.tab-nav');
    if (tabNav) {
        const tabPanes = modal.querySelectorAll('.tab-pane');
        const onTabClick = (e) => {
            if (e.target.tagName === 'BUTTON') {
                const currentActiveButton = tabNav.querySelector('.active');
                if (currentActiveButton) currentActiveButton.classList.remove('active');
                e.target.classList.add('active');
                tabPanes.forEach(pane => pane.classList.remove('active'));
                modal.querySelector(`#${e.target.dataset.tab}`).classList.add('active');
            }
        };
        const newTabNav = tabNav.cloneNode(true);
        tabNav.parentNode.replaceChild(newTabNav, tabNav);
        newTabNav.addEventListener('click', onTabClick);
        if (newTabNav.querySelector('button')) {
            newTabNav.querySelector('button').click();
        }
    }

    const detailCard = modal.querySelector('.detail-card');
    const knowMoreBtn = modal.querySelector('.know-more-btn');
    const aiContentDiv = modal.querySelector('.ai-details-content');
    const backBtn = modal.querySelector('.back-button');

    if (detailCard) detailCard.classList.remove('ai-view');
    if (aiContentDiv) aiContentDiv.innerHTML = '';
    if (knowMoreBtn) knowMoreBtn.style.display = 'block';
    if (backBtn) {
        backBtn.style.opacity = 0;
        backBtn.style.pointerEvents = 'none';
    }

    const fetchAiDetails = async () => {
        if (detailCard) detailCard.classList.add('ai-view');
        if (aiContentDiv) aiContentDiv.innerHTML = '<div class="loading-spinner"></div>';
        if (knowMoreBtn) knowMoreBtn.style.display = 'none';
        if (backBtn) {
            backBtn.style.opacity = 0.7;
            backBtn.style.pointerEvents = 'auto';
        }
        try {
            const response = await fetch(`/api/ai/details/character/${encodeURIComponent(char.name)}`);

            const htmlContent = await response.text();
            if (aiContentDiv) aiContentDiv.innerHTML = htmlContent;
        } catch (err) {
            if (aiContentDiv) aiContentDiv.innerHTML = '<p>Could not load additional details.</p>';
            console.error(err);
        }
    };

    const handleBack = () => {
        if (detailCard) detailCard.classList.remove('ai-view');
        if (aiContentDiv) aiContentDiv.innerHTML = '';
        if (knowMoreBtn) knowMoreBtn.style.display = 'block';
        if (backBtn) {
            backBtn.style.opacity = 0;
            backBtn.style.pointerEvents = 'none';
        }
    };

    if (knowMoreBtn) knowMoreBtn.onclick = fetchAiDetails;
    if (backBtn) backBtn.onclick = handleBack;
};












    
    const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
        const detailCard = modal.querySelector('.detail-card');
        if (detailCard) {
            detailCard.classList.remove('ai-view');
        }
    }, 400); 
};
    
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    fetchAndDisplay(currentCategory, currentPage);
});
