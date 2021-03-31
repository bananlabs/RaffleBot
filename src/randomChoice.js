// ---------------- Using a True Random Number Generator --------------------------------------

const env = require('../.env')
const Telegraf = require('telegraf')
const fetch = require('node-fetch')

const bot = new Telegraf(env.token)

// Url to get a random numbers list using a TRNG algorithm
// From the ANU QRNG website.
// To understand more go to: https://qrng.anu.edu.au/

const baseUrl = 'https://qrng.anu.edu.au/API/jsonI.php?length=120&type=uint8'

// get the data from baseUrl 
const getUrl = async () => {
    try {
        const res = await fetch(baseUrl)
        const result = await res.json()
        console.log(result)
        return result
       
    } catch(err) {
        console.log(`Erro: ${err}`)
    }
}


// Get 3 random numbers from a reduced list for
// the 1st, 2nd and 3rd places

const createsReducedList = async () => {
    const urlList = await getUrl()
    // remove duplicated numbers from the received list
    // and creates new array without duplicate numbers
    let reducedList = []
    urlList.data.forEach((i) => {
        if(!reducedList.includes(i)){
            reducedList.push(i)
        }
    })

    return reducedList
}

const generatesResult = async () => {
    const reducedList = await createsReducedList()
    // creates array with 3 numbers from reduced list
    // and returns the array
    let threeChoosed = []
    for(i = 0; i <= 2; i++){
        threeChoosed.push(reducedList[i])
    }
    
    return threeChoosed
}

module.exports = {
    generatesResult
}