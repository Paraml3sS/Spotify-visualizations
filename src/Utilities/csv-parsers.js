export const popularityDataParser = (row) => {
    row.id = +row.id;
    row.popularity = +row.popularity;
    row.power = +row.power;
}

export const genresPopularityParser = (row) => {
    row.id = +row.id;
    row.popularity = +row.popularity;
}