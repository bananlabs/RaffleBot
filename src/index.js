// Import packages and functions

const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const fs = require('fs')

const { gerandoResultado }  = require('./randomChoice')

// instantiate the bot object
const bot = new Telegraf(env.token)

// set flag to verify if subscriptions are closed
let closedSubs = false

// create array with user ids that subscribed to the raffle
const userIDs = []

// create array of the full information of the subscribers
const userInfo = []

// Maximum Number of Subscriptions 
const MAX_SUBS = 100

// counter to computes the number of subscribers
let count = 1

// subscription button
const button = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('✅ Inscrever', 'insertID')
]))
// start message
bot.start(async ctx => {
    
    const from = ctx.update.message.from
    const fname = from.first_name
    const sname = from.last_name
    await ctx.replyWithMarkdown(`Welcome, *${fname} ${sname}* to the\n 
    🎲 *1st Raffle* of The Group 
    ✅ Click in the *Subscribe* button to participate
       and win the following prizes 🤑:
        \n🥇 *1st place*: 10 $BTC
        \n🥈 *2nd place*: 5 $BTC
        \n🥉 *3rd*: 3 $BTC
        \n                        Nº of Subscribers: *${count}*`, button)
})

// action to insert a new user id when the
// subscription button is clicked
bot.action('insertID', async ctx => {
    
    const userName = await ctx.from.first_name
    const getID = ctx.from.id
    const getInfo = ctx.from
    const verifyBot = ctx.from.is_bot
   if(userIDs.length <= MAX_SUBS){ 
        // verify if user is in the subscription list 
        // and if he is a bot. If the condition is true, 
        // the user is forbidden of subscribe again
        for(let i = 0; i <= userIDs.length; i++){
            if(userIDs[i] !== getID && verifyBot === false){
                userIDs.push(getID)
                userInfo.push(getInfo)
               
                let infos = JSON.stringify(userInfo)
                // creates file of the data of the subscribers
                fs.writeFile('usersInfo.txt', infos, (err) => {
                   // if there's any error outputs err
                   if(err) throw err
               })
                count++
                await ctx.replyWithMarkdown(`*${userName}* is enrolled!🎉`)
                break
            } else {
                await ctx.replyWithMarkdown(`🚫 User *${userName}* can't subscribe again❗️`)
                break
            }
        }
   } else {
       await ctx.reply('Sorry, Subscription are closed!')
       closedSubs = true
    }    
})

// ---------------------- Random Choice of The Users --------------------------------------------------------------

// If the subscription is closed then generates result
if(closedSubs) {   

// get list of the 3 numbers choosed
const arrIndex = async () => {
    index = await gerandoResultado()
    console.log(`3 index: ${index}\n`)
    return index
} 

// take the 3 numbers choosed as an index
// to the user ids array and return the ids
(async () => {
    let arr = await arrIndex()
    let winners = []
    for(let i=0; i <= 2; i++){
        winners.push(userIDs[arr[i]])
        }
    console.log(`Winners: ${vencedores}\n`)
    // creates file with the winners ids
    fs.writeFile('result.txt', winners, (err) => {
            if(err) throw (err)
        })
    })()
} else {
    console.log('Incomplete List')
}

bot.startPolling()