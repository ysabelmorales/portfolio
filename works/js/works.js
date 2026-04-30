// ========= FILTER LOGIC =========

const filterBtns = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('.project');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedFilter = btn.dataset.filter;

        projects.forEach(project => {
            if (selectedFilter === 'all') {
                project.classList.remove('hidden');
            } else {
                const tags = project.dataset.tags.split(',');
                if (tags.includes(selectedFilter)) {
                    project.classList.remove('hidden');
                } else {
                    project.classList.add('hidden');
                }
            }
        });
    });
});

// ========= URL FILTER ON LOAD =========

const params = new URLSearchParams(window.location.search);
const urlFilter = params.get('filter');

if (urlFilter) {
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === urlFilter) {
            btn.classList.add('active');
        }
    });

    projects.forEach(project => {
        const tags = project.dataset.tags.split(',');
        if (tags.includes(urlFilter)) {
            project.classList.remove('hidden');
        } else {
            project.classList.add('hidden');
        }
    });
}