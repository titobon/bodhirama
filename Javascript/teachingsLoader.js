document.addEventListener('DOMContentLoaded', function() {
    const teachingsContainer = document.querySelector('.content-section'); // Assuming a content-section in teachings.html

    fetch('Json/teachings.json')
        .then(response => response.json())
        .then(teachings => {
            teachingsContainer.innerHTML = ''; // Clear placeholder content

            teachings.forEach(teaching => {
                const teachingElement = document.createElement('div');
                teachingElement.classList.add('teaching-item');
                teachingElement.innerHTML = `
                    <h3>${teaching.title}</h3>
                    <p><strong>Type:</strong> ${teaching.type}</p>
                    <p><strong>Date:</strong> ${teaching.date}</p>
                    <p><strong>Speaker:</strong> ${teaching.speaker}</p>
                    <p>${teaching.summary}</p>
                    <a href="${teaching.content_url}" class="read-more">Read More</a>
                    <hr>
                `;
                teachingsContainer.appendChild(teachingElement);
            });
        })
        .catch(error => console.error('Error loading teachings:', error));
});
