const b_url = "https://covid-api.com/api/reports/total";
const a_url = "https://covid-api.com/api/regions";

function fetchCovidData() {
    const country = document.getElementById("country").value.trim();
    const date = document.getElementById("date").value;

    if (!country || !date) {
        alert("Please enter a country name and a date");
        return;
    }

    fetch(a_url)
        .then(response => response.json())
        .then(regionsData => {
            if (!regionsData || !regionsData.data) {
                document.getElementById("result").innerHTML = "Error fetching country codes.";
                return;
            }

            const countryData = regionsData.data.find(item =>
                item.name.toLowerCase() === country.toLowerCase()
            );

            if (!countryData) {
                document.getElementById("result").innerHTML = "Invalid country name.";
                return;
            }

            const countryCode = countryData.iso;
            const url = `${b_url}?date=${date}&iso=${countryCode}`;

            return fetch(url);
        })
        .then(response => response.json())
        .then(data => {
            if (!data || !data.data) {
                document.getElementById("result").innerHTML = "No data found.";
                return;
            }
            
            const covidInfo = `
            <p><strong>Country:</strong> ${country}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Last Update:</strong> ${data.data.last_update || "No update available"}</p>
            <p><strong>Cases:</strong> ${data.data.confirmed?.toLocaleString() || "N/A"}</p>
            <p><strong>Cases Difference:</strong> ${data.data.confirmed_diff?.toLocaleString() || "N/A"}</p>
            <p><strong>Deaths:</strong> ${data.data.deaths?.toLocaleString() || "N/A"}</p>
            <p><strong>Recovered:</strong> ${data.data.recovered?.toLocaleString() || "N/A"}</p>
            <p><strong>Recovered Difference:</strong> ${data.data.recovered_diff?.toLocaleString() || "N/A"}</p>
            <p><strong>Active Cases:</strong> ${data.data.active?.toLocaleString() || "N/A"}</p>
            <p><strong>Active Difference:</strong> ${data.data.active_diff?.toLocaleString() || "N/A"}</p>
            <p><strong>Fatality Rate:</strong> ${data.data.fatality_rate ? data.data.fatality_rate.toFixed(2) : "N/A"}</p>
        `;

            document.getElementById("result").innerHTML = covidInfo;
        })
        .catch(error => {
            document.getElementById("result").innerHTML = "Error fetching data.";
            console.error("Error:", error);
        });
}