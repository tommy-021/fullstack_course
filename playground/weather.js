// Nacteni hodnoty ze stranky (textarea)
window.document.getElementById('button').addEventListener('click', async () => {
    document.getElementById('results-show').textContent = '';
    const cities = document.querySelector('textarea').value
        .split(/[,;]/)
        .map((city) => city.trim())
        .filter(Boolean);

    // Kontrola prázdného vstupu
    if (cities.length === 0) {
        window.alert('Musíte zadat alespoň jedno město.');
        return;
    }

    // Kontrola maximálního počtu měst
    if (cities.length > 3) {
        window.alert('Mohou být zadána maximálně tři města.');
        return;
    }

    // Načte souradnice a zavola dotaz na pocasi
    for (let i = 0; i < cities.length && i < 3; i++) {
        const cityCoords = await getCityCoords(cities[i]);

        print(`\nPocasi pro ${cities[i]} je:`);
        let forecast = await getForecast(cityCoords.latitude, cityCoords.longitude);
        print(` ${forecast.temp_avg} ${forecast.temp_unit}`);
    }
});

// API volani
const getCityCoords = async (cityName) => {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&language=en&format=json`, {
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
        window.alert(error.message);
        return undefined;
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
    catch (e) {
        window.alert(e.message);
    }
};

function print(message) {
    const out = document.getElementById('results-show');
    out.textContent += (out.textContent ? '\n' : '') + message;
}
