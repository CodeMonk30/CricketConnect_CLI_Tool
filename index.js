const axios = require('axios');
const cheerio = require('cheerio');
const notifier = require('node-notifier')

//async function to derive data from 

const getDataFormRemote = async ()=>{
    const URL = 'https://www.cricbuzz.com/cricket-match/live-scores';
    const response = await axios.get(URL);
    const {data} = response;
    return data;
} 

const getScore = async ()=>{
    const html = await getDataFormRemote();
    const scores = [];
    const $ = cheerio.load(html);
    $('a.cb-lv-scrs-well-live').each(function(_, element){
        const scoreContainer = $(element).children().children();
        const score = $(scoreContainer).text();
        scores.push(score);
    })

    return scores;
}

const notify = async ()=>{
    const scores = await getScore();
    if(scores.length == 0){
        // notifier.notify('No live matches.');
        // return;
        const notifyCmd = `notify-send "OOPS!!" "No live matches!!" --icon=./cricket.png`;
        require('child_process').exec(notifyCmd);
    }
    for(let i = 0; i< scores.length;i++){
        // notifier.notify({
        //     title:"Cricket Match Update!!",
        //     icon: './cricket.png',
        //     sound: true,
        //     message: scores[i]
        // });
        const score = scores[i];
        const notifyCmd = `notify-send "Cricket Match Update!!" "Score: ${score}" --icon=./cricket.png`;
        require('child_process').exec(notifyCmd);
    }
}

setInterval(()=>{
    notify();
},3000)