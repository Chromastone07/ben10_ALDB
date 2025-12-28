document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('episodes-grid');
    const searchBar = document.getElementById('search-bar');
    const filterNav = document.querySelector('.filter-nav');
    
    const sentinel = document.getElementById('scroll-sentinel');
    const sentinelLoader = sentinel.querySelector('.loader');

    let currentPage = 1;
    let currentSeries = 'All';
    let searchTimeout;
    let isLoading = false; 
    let hasMoreData = true; 

    const fetchAndDisplay = async (series, page, shouldAppend = false) => {
        if (isLoading) return;
        isLoading = true;

        if (!shouldAppend) {
            grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
            sentinelLoader.style.display = 'none';
        } else {
            sentinelLoader.style.display = 'block';
        }

        let url = `/api/episodes?page=${page}&limit=12`;
        if (series && series !== 'All') url += `&series=${series}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!shouldAppend) grid.innerHTML = '';
            
            renderGrid(data.results);
            
            hasMoreData = data.hasNextPage;
            
            if (hasMoreData) {
                observer.observe(sentinel);
            } else {
                observer.unobserve(sentinel);
                sentinelLoader.style.display = 'none';
            }

        } catch (error) {
            console.error('Failed to fetch episodes:', error);
        } finally {
            isLoading = false;
            if (shouldAppend) sentinelLoader.style.display = 'none';
        }
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMoreData) {
            currentPage++;
            fetchAndDisplay(currentSeries, currentPage, true);
        }
    }, { rootMargin: '100px' });

    const fetchSearchResults = async (term) => {
        observer.unobserve(sentinel);
        sentinelLoader.style.display = 'none';
        
        grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';
        filterNav.style.display = 'none';

        if (!term) {
            filterNav.style.display = 'flex';
            currentPage = 1;
            hasMoreData = true;
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
            return;
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
            hasMoreData = true;
            document.querySelector('.filter-btn.active').classList.remove('active');
            e.target.classList.add('active');
            fetchAndDisplay(currentSeries, currentPage, false);
        }
    });

    fetchAndDisplay(currentSeries, currentPage);
});