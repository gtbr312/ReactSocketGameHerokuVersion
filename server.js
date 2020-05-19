const express = require('express')
const socketio = require('socket.io')
const http = require('http')

export const PORT = process.env.PORT || 5000;

const app = express()
const router = require('./router')

const server = http.createServer(app)
const io = socketio(server)

const path = require('path')

//if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, 'reactgame1/build')))
//}

let userCount = 0
let userList = []
let npcList = []
let allMaps = []
let worldState = []
let subTick = 0

const calculateAttack = (attackerSkills,attackedSkills) => {
    let attackerStrength = attackerSkills[2]
    let damage = Math.floor(Math.random()*Math.floor(attackerStrength+3))
    return damage
}

const randomMovement = (position,leftTopRoll) => {
    let y = position[0]
    let x = position[1]
        switch(leftTopRoll){
            case 0:
                return [y,x-1] 
            case 1:
                return [y,x+1] 
            case 2:
                return [y-1,x] 
            case 3:
                return [y+1,x] 
            default:
                break;
        }
}

const observeAllowedTiles = (newTile,currentMap) => {
    let foundMap = worldState.find(mapObj => {
        return   mapObj.map === currentMap
    })

    if(foundMap&&foundMap.tiles){
    let tiles = foundMap.tiles
    let y = newTile[1]
    let x = newTile[0]
    if((y<10&&y>=0)&&(x<20&&x>=0)){
    let tryTile = tiles[y][x]
    switch(tryTile){
        case 0:
            return true
        default:
            return false
    }
}
}else return false
}

const circularScript = (id,position,scriptArray,scriptIndex) => {
    const instruction = scriptArray[scriptIndex]
    
    let y = position[0]
    let x = position[1]
    switch(instruction){
        case 0:
            return [y,x-1] 
        case 1:
            return [y,x+1] 
        case 2:
            return [y-1,x] 
        case 3:
            return [y+1,x] 
        default:
            break;
    }
}

const setSpriteLocation = (direction,stepsIndex) => {
    switch(direction){
        case 'NORTH':
        case 0:
            return [stepsIndex,3]
        case 'SOUTH':
        case 1:
            return [stepsIndex,0]
        case 'WEST':
        case 2:
            return [stepsIndex,2]
        case 'EAST':
        case 3:
            return [stepsIndex,1]
        default:
            break;
    }
}

const observePlayerShells = (newPos,moveAttemptObj) => {
    const shellsAtLocation = userList.filter(userObj => {
        if(userObj.position)return userObj.position.join(' ') === newPos.join(' ') && userObj.id !== moveAttemptObj.id && userObj.currentMap === moveAttemptObj.currentMap
        else return
    })
    return shellsAtLocation[0] ? false : true
}

const moveNpc = (userObj) => {
    let leftTopRoll = Math.floor(Math.random() * Math.floor(4))
    let newPos

    switch(userObj.movementType){
        case 'random':
            newPos = randomMovement(userObj.position,leftTopRoll)
            break;
        case 'circularScript':
            newPos = circularScript(userObj.id,userObj.position,userObj.script,userObj.scriptIndex)
            break;
        default:
            break;
    }
  
    if(observeAllowedTiles(newPos,userObj.currentMap)&&observePlayerShells(newPos,userObj)){    
    userObj.position = newPos
    switch(userObj.movementType){
        case 'random':
            userObj.spriteLocation = setSpriteLocation(leftTopRoll,userObj.stepsIndex)
            break;
        case 'circularScript':
            userObj.spriteLocation = setSpriteLocation(userObj.script[userObj.scriptIndex],userObj.stepsIndex)
            break;
        default:
            break; 
    }
    userObj.stepsIndex = userObj.stepsIndex >= 7 ? 0 : userObj.stepsIndex + 1
    if(userObj.script)userObj.scriptIndex = userObj.scriptIndex >= userObj.script.length-1 ? 0 : userObj.scriptIndex + 1
    }

    if(!observePlayerShells(newPos,userObj)){       
        switch(userObj.aggression){
            case 'defensive':
                break;
            case 'aggressive':
                const shellsAtLocation = userList.filter(shellObj => {
                    return shellObj.position.join(' ') === newPos.join(' ') && shellObj.id !== userObj.id && shellObj.currentMap === userObj.currentMap
                })
                
                const updatedUserList = userList.map(shellObj => {
                    if(shellObj.id === shellsAtLocation[0].id){
                        shellObj.status ='combat'
                        shellsAtLocation[0].focus = userObj.id
                    }
                })

                userObj.focus = shellsAtLocation[0].id
                userObj.status = 'combat'
                break;
            default:
                break;
        }    
    }
    return userObj
}

const isNextTo = (attackerPos,attackedPos) => {
    const differences = [attackerPos[0]-attackedPos[0],attackerPos[1]-attackedPos[1]]
    let direction
     switch(differences.join(' ')){
         case '0 1':
             return direction = 'NORTH'
        case '0 -1':
            return direction = 'SOUTH'
        case '-1 0':
            return direction = 'EAST'
        case '1 0':
            return direction = 'WEST'
        default:
            return
     }
}

const shellAttack = (shellObj) => {
        let foundAttacked = userList.find(userObj => userObj.id === shellObj.focus)

        if(foundAttacked && isNextTo(shellObj.position,foundAttacked.position)){
        let attackValue = calculateAttack(shellObj.skills,foundAttacked.skills)
        foundAttacked.skills[0] = foundAttacked.skills[0] - attackValue
        if(foundAttacked.skills[0] <=0){
            io.to(foundAttacked.id).emit('commandDeath')
            console.log('a user has died.')
        }
        foundAttacked.hitFor = attackValue
        console.log(`${shellObj.id} attacked ${foundAttacked.id} for ${attackValue}. ${foundAttacked.id} has ${foundAttacked.skills[0]} health remaining`)
        let orientedAttacked = orientAttacked(shellObj,foundAttacked) 
        userList.forEach(userObj => {
            if(userObj.id === orientedAttacked.id){
                userObj = orientedAttacked
                userObj.focus = foundAttacked.id
            }
        })
        if(foundAttacked.status === 'combat' && foundAttacked.focus === shellObj.id){
        foundAttacked.status = 'combat'
        foundAttacked.focus = shellObj.id
        }else if(foundAttacked.status === 'fleeing'){
            //console.log('in else of status not combat')
        }
    }else{
        userList.forEach(userObj => {
            if(userObj.id === shellObj.id){
                userObj.focus=null
                userObj.hitFor = null
                userObj.status='default'
            }
            if(foundAttacked && userObj.id === foundAttacked.id && userObj.focus !== shellObj.id){
                userObj.focus=null
                userObj.hitFor = null
                userObj.status='default'
            }
        })
    }
    io.emit('distributePlayerStates',userList)
}


setInterval(() => {
    subTick = subTick >= 8 ? 1 : subTick+1
    let npcStateChange = false
    userList.map(userObj => {
        if(userObj.playerType === 'NPC'){
                switch(userObj.status){
                    case 'default':
                        if(userObj.tickActions[subTick-1]===1){
                            userObj = moveNpc(userObj)
                        }
                        break;
                    case 'combat':
                        if(userObj.tickAttacks[subTick-1]===1){
                            userObj = shellAttack(userObj)
                        }
                }
                npcStateChange=true
        }else{
            switch(userObj.status){
                case 'default':

                    break;
                case 'combat':
                    if(userObj.tickAttacks[subTick-1]===1){
                        userObj = shellAttack(userObj)
                    }
                case 'fleeing':
                    break;
            }
        } 
    })
    io.emit('distributePlayerStates',userList)
},500)

const selectMap = (currentMap,lastMap) => {
    if(worldState[0]){
    let mapToDispatch = worldState.filter(mapObj => {
        return mapObj.map === currentMap
    })
    return mapToDispatch[0]
    }
    else{ 
        return allMaps
    }

}

const modifyMap = (mapChanges,currentMap)=>{
    mapChanges.forEach((changeInstructions)=>{
        let {y,x,tileType} = changeInstructions
        const mapIndex = worldState.findIndex((map)=>{
            return map.map === currentMap
        })
        worldState[mapIndex].tiles[y][x]=tileType
    })
}

const concatNpcs = () => {
    userList = userList.concat(npcList)
}

const findDirection = (position,attackerPos) => {
    const differences = [position[0]-attackerPos[0],position[1]-attackerPos[1]]
    let direction
     switch(differences.join(' ')){
         case '0 1':
             return direction = 'NORTH'
        case '0 -1':
            return direction = 'SOUTH'
        case '-1 0':
            return direction = 'EAST'
        case '1 0':
            return direction = 'WEST'
     }
}

const orientAttacked = (userObj,attackerObj) => {
     const attackerPos = attackerObj.position 
     const stepsIndex = 0
     const direction = findDirection(userObj.position,attackerPos)
     const orientedSpriteLocation = setSpriteLocation(direction,stepsIndex)
     const attackerId = attackerObj.id
     userObj.stepsIndex = stepsIndex
     userObj.direction = direction
     userObj.spriteLocation = orientedSpriteLocation
     userObj.focus = attackerId
     return userObj
     
}

io.on('connection', function(socket){

    if(!worldState[0])io.emit('requestWorld')

    userCount++
    let filteredUserList = userList
    io.emit('assignId',{id:socket.id,userList})


    socket.on('disconnect',()=>{
        let associatedUser = userList.filter(userObj => userObj.id === socket.id)
        if(associatedUser[0]){
            let clients = Object.keys(io.engine.clients)
            let filteredUserList = userList.filter(userObj => clients.includes(userObj.id))
            userList = filteredUserList
            concatNpcs()


            io.emit('distributePlayerStates',userList)
        }
    userCount--
        if(userCount===0){
            worldState=[]
            npcList=[]
            userList=[]
            console.log('no users, resetting world',worldState)
        }
        console.log('user disconnected')
    })

    socket.on('updateStatus',(id,status)=>{
        let userListUpdateState = userList.map(userObj => {
            if(userObj.id === id){
                userObj.status=status
                return userObj
            }else return userObj
        })
        userList = userListUpdateState
    })

    socket.on('pushCombatInteraction',({playerUser,otherUser})=>{
        let foundAttacker = userList.find(userObj => userObj.id === playerUser.id)
        let foundAttacked = userList.find(userObj => userObj.id === otherUser.id)

        if(foundAttacked){

        let attackValue = calculateAttack(foundAttacker.skills,foundAttacked.skills)
        foundAttacked.skills[0] = foundAttacked.skills[0] - attackValue
        if(foundAttacked.skills[0] <=0){
        io.to(foundAttacked.id).emit('commandDeath')
        console.log('a user has died.')
        }

        foundAttacked.focus = playerUser.id
        foundAttacked.status = 'combat'
        console.log(`${foundAttacker.id} attacked ${foundAttacked.id} for ${attackValue}. ${foundAttacked.id} has ${foundAttacked.skills[0]} health remaining`)

        userList.forEach(userObj => {
            if(userObj.id === orientAttacked.id){
                userObj = orientAttacked
            }
        })
        userList.forEach(userObj => {
            if(userObj.id === playerUser.id){
                userObj.status = 'combat'
                userObj.focus = foundAttacked.id
            }
        })
        io.emit('distributePlayerStates',userList)
        }
    })

    socket.on('changeMap',({id,newMap,currentMap})=>{
        userList.map((userObj)=>{
            if(userObj.id === id){
                userObj.currentMap = newMap
            }
        })
        let newTiles = selectMap(newMap)
        io.to(socket.id).emit('serveMap',newTiles)
    })


    socket.on('requestUserAdd',({currentMap})=>{
        if(!userList[0]){
            console.log('NO USERS TRY HERE')
            concatNpcs()
        }

        userList.push({id:socket.id})
        let dispatchedMap = selectMap(currentMap)
        io.to(socket.id).emit('serveMap',dispatchedMap)
        console.log(`pushed ${currentMap} to`,socket.id)
    })

    socket.on('pushNpcList',(receivedNpcList)=>{
        npcList = receivedNpcList
        concatNpcs()
    })

    socket.on('pushWorldState',(worldArray)=>{
        worldState.push(...worldArray)
    })

    socket.on('pushMapChanges',({mapChanges,currentMap})=>{
        let tiles = selectMap(currentMap)

        mapChanges.forEach((mapChangeObj,i)=>{
        let {y,x,tileType} = mapChangeObj
        tiles.tiles[y][x]=tileType})
        modifyMap(mapChanges,currentMap)    
        io.emit('distributeMapChanges',{mapChanges,currentMap})
    })

    socket.on('updateMap',({map})=>{
        allMaps=map
    })
    


    socket.on('dispatchBuildMap',({map})=>{
        allMaps.push({map})
        io.emit('serveMap',allMaps)
    })


    socket.on('sendMessage',(message,callback)=>{
        io.emit('message',{user:'Matt',text:message})
        callback()
    })

    socket.on('sendPos',(pos)=>{
        if(userList.length <= 1){
            console.log('THIS IS THE FIRST EVER SEND POS')
            concatNpcs()
        }
        let updatedUserList = userList.map((userObj)=>{
            if(userObj.id === pos.id)
            {
                return pos
            }else{
            
            return userObj
            }
        })
        userList = updatedUserList
        io.emit('posUpdate',{pos,updatedUserList})
    })

    return ()=>{
        socket.emit('disconnect')
        socket.off()
    }

})

//app.use(router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/reactgame1/build/index.html'))
  })

server.listen(PORT, () => console.log(`Server running on ${PORT}`))