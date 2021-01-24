export const loadCsv = (url, parserFunc) => {
    console.log(`Loading data from ${url}.`);

    return d3.csv(url)
        .then(loadedData => {
            loadedData.forEach(parserFunc);
            console.log(`Loaded data from ${url}.`);
            return loadedData;
        });
}