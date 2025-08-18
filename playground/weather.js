// Nacteni hodnoty ze stranky (textarea)
window.document.getElementById('button').addEventListener('click', async () => {
    document.getElementById('results-show').textContent = '';
    const cities = document.querySelector('textarea').value
        .split(/[,;]/)
        .map((city) => city.trim())
        .filter(Boolean); // Odfiltrule falsy hodnoty (0, null, undefined, Nan, flase)

    // Kontrola prazdneho vstupu
    if (cities.length === 0) {
        window.alert('Musíte zadat alespoň jedno město.');
        return;
    }

    // Kontrola maximalniho poctu mest
    if (cities.length > 3) {
        window.alert('Mohou být zadána maximálně tři města.');
        return;
    }

    // Ziska vsechny souradnice paralelne (najednou)
    const geoResults = await Promise.allSettled(cities.map(getCityCoords));
    console.log(geoResults); // pro me

    // Vyfiltruje pouze fulfilled
    const validCities = geoResults.map((res, i) => {
        if (res.status !== 'fulfilled' || !res.value
            || !Number.isFinite(res.value.latitude) || !Number.isFinite(res.value.longitude)) {
            print(`\nMěsto "${cities[i]}" nebylo nalezeno.`);
            return null;
        }
        return { name: cities[i], coords: res.value };
    }).filter(Boolean);

    // Ziska vsechny predpovdi paralelne
    const forecastResults = await Promise.allSettled(
        validCities.map((city) => getForecast(city.coords.latitude, city.coords.longitude)),
    );

    // Vypise vysledky
    forecastResults.forEach((res, i) => {
        const cityName = validCities[i].name;
        if (res.status !== 'fulfilled' || !res.value) {
            print(`\nPředpověď pro "${cityName}" není dostupná.`);
            return;
        }
        print(`\nPočasí pro ${cityName} je:`);
        print(` ${res.value.temp_avg.toFixed(2)} ${res.value.temp_unit}`);
    });
});

// API volani
const getCityCoords = async (cityName) => {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&language=en&format=json`, {
            method: 'GET',
        });

        // vysvetleni: pokud vyhodi Error, kod se v try zastavi a prejde do catch
        if (!response.ok) {
            throw new Error(`Server vrátil chybu: ${response.status} ${response.statusText}`);
        }

        const jsonResponse = await response.json();
        const { latitude, longitude } = jsonResponse.results?.[0]; // vysvetleni: pokud neni result, vrati undefined
        console.log(latitude, longitude);
        return { latitude, longitude };
    }
    catch (error) {
        console.log(error.message);
    }
};

const getForecast = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&timezone=GMT&forecast_days=3&format=json`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Nemůže najít předpověď');
        }

        const jsonResponse = await response.json();
        const temp_unit = jsonResponse.daily_units.temperature_2m_max;
        const temp_max = jsonResponse.daily.temperature_2m_max[1];
        const temp_min = jsonResponse.daily.temperature_2m_min[1];
        const temp_avg = (temp_max + temp_min) / 2;
        return { temp_avg, temp_unit };
    }
    catch (error) {
        console.log('Chyba: ' + error.message);
    }
};

function print(message) {
    const out = document.getElementById('results-show');
    out.textContent += (out.textContent ? '\n' : '') + message;
}
