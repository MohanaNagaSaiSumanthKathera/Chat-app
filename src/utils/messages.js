//To generate Date
const generateMessage =(username,text)=>{
   return{
    username,
    text,
    createdAt : new Date().getTime()
   } 
}

const generateLocationMessage = (username,urlmap)=>{
    return{
        username,
        urlMap : `https://google.com/maps?q=${urlmap.lat},${urlmap.long}`,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
}