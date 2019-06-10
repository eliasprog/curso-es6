import api from './api';

class App {

     /**
     * constructor of the class
     */
    constructor() {
        this.repositories = [];
        this.fromEl = document.getElementById('repo-form');
        this.listEl = document.getElementById('repo-list');
        this.inputUserEl = document.querySelector('input[name=user]');
        this.inputRepoEl = document.querySelector('input[name=repository]');

        this.registerHendelers();
    }

    /**
     * call the addrepository function when button of
     * formEl id clicked
     */
    registerHendelers() {
        this.fromEl.onsubmit = event => this.addRepository(event);
    }

    /**
     * function to add a new repository on the listEl
     */
    async addRepository(event) {
        event.preventDefault();

        const userInput = this.inputUserEl.value;
        const repoInput = this.inputRepoEl.value;

        if (repoInput.length === 0 || userInput.length === 0){
            alert('User/Repository fields must be filled!');
            return;
        }
            

        this.setLoading();

        try {
            const response = await api.get(`/repos/${userInput}/${repoInput}`);
            //console.log(response);
            const { name, description, html_url, owner: { avatar_url }} = response.data;

            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            });

            this.inputUserEl.value = '';
            this.inputRepoEl.value = '';

            this.render();
        } catch (error) {
            alert('The repository/usur does not exist!');
        }

        this.setLoading(false);
        
    }

    /**
     * function to show up a message of loading...
     */
    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('spam');
            loadingEl.setAttribute('id', 'loading');
            loadingEl.appendChild(
                document.createTextNode('Carregando...')
            );

            this.fromEl.appendChild(loadingEl);
        } else {
            document.getElementById('loading').remove();
        }

    }

     /**
     * function to render the elements on screen
     */
    render() {
        this.listEl.innerHTML = '';

        this.repositories.forEach(repo => {

            let imgEl = document.createElement('img');
            imgEl.setAttribute(
                'src',
                repo.avatar_url
            );

            let titleEl = document.createElement('strong');
            titleEl.appendChild(
                document.createTextNode(repo.name)
            );

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(
                document.createTextNode(repo.description)
            );
            
            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.appendChild(
                document.createTextNode('Acessar')
            );
            linkEl.setAttribute('href', repo.html_url);

            let listItenEl = document.createElement('li');
            listItenEl.appendChild(imgEl);
            listItenEl.appendChild(titleEl);
            listItenEl.appendChild(descriptionEl);
            listItenEl.appendChild(linkEl);

            this.listEl.appendChild(listItenEl);

        });
    }
}

new App();