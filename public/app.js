document.addEventListener('DOMContentLoaded', () => {
    
    fetch('/api/projects')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const grid = document.getElementById('projects-grid');
            grid.innerHTML = ''; 

            
            data.forEach(project => {
                const card = document.createElement('div');
                card.className = 'card';

                card.innerHTML = `
                    <h3>${project.title}</h3>
                    <span class="tech">${project.tech}</span>
                    <p>${project.description}</p>
                    <a href="${project.github}" target="_blank">View on GitHub</a>
                `;
                grid.appendChild(card);
            });
        })
        .catch(error => console.error('Error fetching project data:', error));
});