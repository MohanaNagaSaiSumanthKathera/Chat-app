//socket is used to send and receive
const socket = io();
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocation = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

//Options
const{username, room} = Qs.parse(location.search,{ignoreQueryPrefix : true});

socket.on('message',(message)=>{
    console.log(message);
    //getting the html and inserting it in the required place.
    const html = Mustache.render(messageTemplate,{
        message: message.text,
        createdAt : moment(message.createdAt).format('h:mm:a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
});

socket.on('locationMessage',(locObj)=>{
    console.log(locObj);
    const html = Mustache.render(locationTemplate,{
        link : locObj.urlMap,
        createdAt : moment(locObj.createdAt).format('h:mm:a')
    });
    $messages.insertAdjacentHTML('beforeend',html);

})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled',"disabled");

    const message = e.target.elements.messName.value;
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(error){
            return console.log(error);
        }
        console.log('Message is acknowledged');
    });
});

$sendLocation.addEventListener('click',()=>{
    $sendLocation.setAttribute('disabled','disabled');
    if(!navigator.geolocation){
        return alert('Your browser is not supported for geolocation');
    }

    //doesnot support promises or async
    navigator.geolocation.getCurrentPosition((position)=>{
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        console.log(position.coords.latitude,position.coords.longitude);
        socket.emit('sendLocation',{lat,long},()=>{
            $sendLocation.removeAttribute('disabled');
            console.log("Location is acknowledged");
        });
    });
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href ='/';
    }
});
// socket.on('countUpdated',(count)=>{
//     console.log("count has been updated ", count);
// });

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('clicked');
//     socket.emit('increment');
// });