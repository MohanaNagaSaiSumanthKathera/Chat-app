//To generate Date
const generateMessage =(text)=>{
   return{
    text,
    createdAt : new Date().getTime()
   } 
}

const generateLocationMessage = (urlmap)=>{
    return{
        urlMap : `https://google.com/maps?q=${urlmap.lat},${urlmap.long}`,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocationMessage
}