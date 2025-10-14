function getPageContext() {
    const indexContainer = document.querySelector('.container.index');
    const pagesContainer = document.querySelector('.container.pages');

    if (indexContainer) {
        return {
            type: 'index',
            imageBase: './images/',
            linkBase: 'pages/',
        };
    } else if (pagesContainer) {
        return {
            type: 'pages',
            imageBase: '../images/',
            linkBase: '',
        };
    } else {
        // fallback for unknown containers
        return {
            type: 'default',
            imageBase: './images/',
            linkBase: '',
        };
    }
}

window.getPageContext = getPageContext;