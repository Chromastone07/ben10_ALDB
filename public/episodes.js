document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('episodes-grid');
    const searchBar = document.getElementById('search-bar');
    const loadMoreButton = document.getElementById('load-more-episodes');
    const filterNav = document.querySelector('.filter-nav');

    let currentPage = 1;
    let currentSeries = 'All';
    let searchTimeout;

    const fetchAndDisplay = async (series, page, shouldAppend = false) => {
        if (!shouldAppend) {
            grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
        }
        loadMoreButton.style.display = 'none';

        let url = `/api/episodes?page=${page}&limit=12`;
        if (series && series !== 'All') url += `&series=${series}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!shouldAppend) grid.innerHTML = '';
            renderGrid(data.results);
            if (data.hasNextPage) {
                loadMoreButton.style.display = 'block';
            }
        } catch (error) {
            console.error('Failed to fetch episodes:', error);
        }
    };

    const fetchSearchResults = async (term) => {
        grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
        filterNav.style.display = 'none';
        loadMoreButton.style.display = 'none';

        if (!term) {
            filterNav.style.display = 'flex';
            fetchAndDisplay(currentSeries, 1, false);
            return;
        }
        try {
            const response = await fetch(`/api/episodes/search/${term}`);
            const data = await response.json();
            grid.innerHTML = '';
            renderGrid(data.results);
        } catch (error) {
            console.error('Failed to fetch search results:', error);
        }
    };

    const renderGrid = (episodes) => {
        if (episodes.length === 0 && currentPage === 1) {
            grid.innerHTML = '<p style="color: var(--text-light); opacity: 0.7;">No episodes found.</p>';
        }
        episodes.forEach(ep => {
            const card = document.createElement('div');
            card.className = 'episode-card';
            card.innerHTML = `
                <div class="episode-header">
                    <h3>${ep.title}</h3>
                    <p class="episode-meta">Series: ${ep.series} | Season ${ep.season}, Episode ${ep.episode}</p>
                </div>
                <p class="episode-synopsis">${ep.synopsis || 'No synopsis available.'}</p>
                <div class="featured-list">
                    <h4>Featured Aliens:</h4>
                    <ul>${ep.aliens.map(alien => `<li>${alien.name}</li>`).join('') || '<li>None</li>'}</ul>
                </div>
                <div class="featured-list">
                    <h4>Featured Characters:</h4>
                    <ul>${ep.characters.map(char => `<li>${char.name}</li>`).join('') || '<li>None</li>'}</ul>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    searchBar.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            fetchSearchResults(e.target.value.trim());
        }, 300);
    });

    filterNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentSeries = e.target.dataset.series;
            currentPage = 1;
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            fetchAndDisplay(currentSeries, currentPage, false);
        }
    });

    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchAndDisplay(currentSeries, currentPage, true);
    });

    fetchAndDisplay(currentSeries, currentPage);
});