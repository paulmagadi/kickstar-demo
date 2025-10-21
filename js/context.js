function getPageContext() {
    const indexContainer = document.querySelector('.container.index');
    const pagesContainer = document.querySelector('.container.pages');

    if (indexContainer) {
        return {
            type: 'index',
            homeLinkBase: '',
            imageBase: './images/',
            linkBase: 'pages/',
        };
    } else if (pagesContainer) {
        return {
            type: 'pages',
            homeLinkBase: '../',
            imageBase: '../images/',
            linkBase: '',
        };
    } else {
        // fallback for unknown containers
        return {
            type: 'default',
            homeLinkBase: '',
            imageBase: './images/',
            linkBase: '',
        };
    }
}

window.getPageContext = getPageContext;