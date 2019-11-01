const users = [];

//add user
const addUser =({id,username,room})=>{
    //clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //validate the data
    if(!room || !username){
        return {
            error : 'username & room are required'
        }
    }

    //checking for exosting user
    const existingUser = users.find((user)=>{
        return user.username === username  && user.room === room;
    });

    //if exist throw error
    if(existingUser){
        return{
            error : "username is already in use"
        }
    }

    //add user to the array
    const user = {id , username, room}
    users.push(user);
    return {user};

}

//Remove user

const removeUser =(id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id;
    })
    if(index !== -1){
        return users.splice(index,1)[0];
    }
    return {error : "User does't exists"}
}

//get user
const getUser=(id)=>{
    const user = users.find((user)=>{
        return user.id === id;
    });
    return user;
}

//getUsersInRoom
const getUsersInRoom = (room)=>{
    const roomUsers = users.filter((user)=>{
        return user.room === room;
    })
    return roomUsers;
}



module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}