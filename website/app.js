/* Global Variables */

// Personal API Key for OpenWeatherMap API
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey =  '&appid=854efe04118733b92102a2581402dc25';
const units =  '&units=metric';



let d = new Date();
let newDate = (d.getMonth()+1)+'.'+ d.getDate()+'.'+ d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e){
    const zip = document.getElementById('zip').value;
    const userResponse = document.getElementById('feelings').value;
    getWeather(baseURL, zip, apiKey, units)
    // Add a data to POST request
    .then(function gotData(data){
        postData('http://localhost:8000/addWeather', {date: newDate,temp: data.main.temp, userResponse: userResponse});
        updateUI('http://localhost:8000/all')
    });
}
/* Function to GET Web API Data*/
const getWeather = async (baseURL, zip, apiKey, units) =>{

    const res = await fetch(baseURL + zip + apiKey + units)
    try{

        const data = await res.json();
        console.log(data)
        return data;
    }    catch(error){
        console.log("error", error)
    }
}

/* Function to POST data */

const postData = async (url, data) =>{
    console.log(url, data)

    const response = await fetch (url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(newData);
        return newData
    } catch(error){
        console.log("error", error);
    }
}


// Update UI
const updateUI = async () =>　{
    const request = await fetch('http://localhost:8000/all')
    try　{
        const allData = await request.json();
        const lastEntry = allData[allData.length - 1];
        if (lastEntry < 0) {
            // no previous entries exist
            return;
        }
        document.getElementById('date').innerHTML = lastEntry.date;
        document.getElementById('temp').innerHTML = lastEntry.temp;
        document.getElementById('content').innerHTML = lastEntry.userResponse;
    }　catch(error)　{
        console.log("error", error);
    }
}
