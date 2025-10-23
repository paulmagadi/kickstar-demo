function getPageContext() {
    const indexContainer = document.querySelector('.container.index');
    const pagesContainer = document.querySelector('.container.pages');

    if (indexContainer) {
        return {
            imageBase: './images/',
            linkBase: 'pages/',
        };
    } else if (pagesContainer) {
        return {
            imageBase: '../images/',
            linkBase: '',
        };
    } else {
        return {
            imageBase: './images/',
            linkBase: '',
        };
    }
}

window.getPageContext = getPageContext;