export const filterByPopularity = (data, value) => {
    return data
        .filter(record => record.popularity === value)
        .sort((a,b) => b.power - a.power);
}

export const filterByGenre = (data, value) => {
    return data
        .filter(record => record.genres === value);
}