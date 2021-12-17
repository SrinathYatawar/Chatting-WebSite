const Users = [];

function userJoin(id,username,roomcode){
    const user = {id,username,roomcode};
    Users.push(user);
    return user;
}

function getCurrentUser(id){
    return Users.find(function(user){
    (user.id===id)
    })
}
function removeDisconnectUser(id){
  const index = Users.findIndex(user=>user.id === id);
  if(index !== -1){
      return Users.splice(index,1)[0];
  }
}

function getRoomUser(room){
   return Users.filter(user=>  user.roomcode === room);
}

module.exports={
    userJoin,
    getCurrentUser,
    getRoomUser,
    removeDisconnectUser
};