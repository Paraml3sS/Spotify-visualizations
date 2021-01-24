import { popularityDataParser, genresPopularityParser } from '../src/Utilities/csv-parsers.js';
import { loadCsv } from '../src/data.js';
import { RadialChart } from '../src/Charts/RadialChart.js';
import { BarChart } from '../src/Charts/BarChart.js';
import { filterByPopularity, filterByGenre } from './Utilities/filters.js'

// ---------------------------------------------------------------------
// Apis
const popularityUrl = 'https://raw.githubusercontent.com/Paraml3sS/Spotify-visualizations/main/popularity_v2.csv';
const genresPopularityUrl = 'https://raw.githubusercontent.com/Paraml3sS/Spotify-visualizations/main/genres_popularity.csv';
const genresInfoUrl = 'https://raw.githubusercontent.com/Paraml3sS/Spotify-visualizations/main/genres_info.csv';


// ---------------------------------------------------------------------
let popularityData;
let genresPopularityData;
let genresInfoData;

let popularityChart;
let genresPopularityChart;
let genresInfoChart;

// ---------------------------------------------------------------------
// Selectors
const popularitySliderSelector = document.getElementById('popularitySlider');
const hoveredGenreSelector = document.querySelector('.selected-genre');
const genresSearchSelector = document.querySelector('#genresSearch');
const sliderValueSelector = document.querySelector('.value');



popularitySliderSelector.addEventListener('change', (event) => popularitySliderHandler(event));
genresSearchSelector.addEventListener('input', event => genresSearchHandler(event));


const popularitySliderHandler = (e) => {
    const value = Number(e.target.value);
    sliderValueSelector.innerHTML = `${value}% popularity`;
    let filtered = filterByPopularity(popularityData, value);
    popularityChart.update(filtered);
}

const genresSelectorHandler = (e) => {
    let genre = e.target.getAttribute("genre");
    hoveredGenreSelector.textContent = genre;
    let filtered = filterByGenre(genresInfoData, genre);
    genresInfoChart.update(filtered);
}

const genreHoverSubscribe = () => {
    let genresSelector = document.querySelectorAll('.bar');
    genresSelector.forEach(elem => elem.removeEventListener("mouseover", genresSelectorHandler));
    genresSelector.forEach(elem => elem.addEventListener("mouseover", (e) => genresSelectorHandler(e)));
}

const genresSearchHandler = (e) => {
    let genrePart = e.target.value;

    Promise.resolve([genrePart, genresPopularityChart, genresPopularityData])
        .then(([genrePart, genresPopularityChart, genresPopularityData]) => {

            if (genrePart.length > 1) {
                let filtered = genresPopularityData
                    .filter(record => record.genres.startsWith(genrePart));

                genresPopularityChart.update(filtered);
            } else {
                genresPopularityChart.update(genresPopularityData);
            }
        })
        .then(genreHoverSubscribe);
}


// ---------------------------------------------------------------------
// Load data and create charts 
loadCsv(popularityUrl, popularityDataParser)
    .then(data => {
        popularityData = data;
        let filtered = filterByPopularity(popularityData, Number(popularitySliderSelector.value));

        popularityChart = RadialChart("#popularityChart", {
            innerRadius: 80,
            outerRadius: 340 / 1.6,
            width: 360 - 20,
            height: 560 - 20,
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            conditional: false
        });

        popularityChart.render(filtered);
    })


loadCsv(genresPopularityUrl, genresPopularityParser)
    .then(data => {
        genresPopularityData = data;
        let dataLength = genresPopularityData.length;
        genresPopularityChart = BarChart("#genresChart", {
            width: 500,
            height: 300,
            margin: ({ top: 30, right: 0, bottom: -20, left: 40 }),
            color: "steelblue",
            dataLength: dataLength
        });

        genresPopularityChart.render(genresPopularityData);
    })

loadCsv(genresInfoUrl, popularityDataParser)
    .then(data => {
        genresInfoData = data;
        let filtered = filterByGenre(genresInfoData, "basshall");

        genresInfoChart = RadialChart("#genreInfoChart", {
            innerRadius: 80,
            outerRadius: 340 / 1.6,
            width: 360 - 20,
            height: 560 - 20,
            margin: { top: 10, right: 10, bottom: 10, left: 10 },
            conditional: true
        });

        genresInfoChart.render(filtered);
    })
    .then(genreHoverSubscribe);