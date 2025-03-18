fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));