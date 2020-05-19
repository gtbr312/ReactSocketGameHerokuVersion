import store from '../../config/store'
import {PLAYER_SPRITE_SIZE, ENDPOINT} from '../../config/miscData'
import {PORT} from '../../../../server'
import io from 'socket.io-client'
import { mapSwitch } from './playerLogicServices/mapSwitch'
import { spriteIndexToPixels, indexToPixels, cleanPos, newPlayerPosition, setSpriteLocation, setWalkIndex, attemptLocation } from './playerLogicServices/playerUnitConversion'
import { identifyInteractable, identifyPortal, notTelePort, notPlayerShell } from './playerLogicServices/mapInteractionLogic'
import { checkMapEdges } from './playerLogicServices/playerMovementLogic'
let socket=io(PORT)

socket.on('distributeMapChanges',({mapChanges,currentMap}) => {
    if(mapChanges[0]&&currentMap === store.getState().map.currentMap){
        mapChanges.forEach((mapChangeObj,i)=>{
        let {y,x,tileType} = mapChangeObj
        store.dispatch({type:'CHANGE_ENVIRONMENT', payload:{y,x,tileType}})
        })
    }
})

socket.on('posUpdate',(data)=>{
    let posIndex = data.pos
    const map = store.getState().map.currentMap
    let currentMap = map ? map : 'spawnSite'
    let {position,direction,stepsIndex} = indexToPixels(posIndex)
    let spriteLocationPixel = spriteIndexToPixels(posIndex.spriteLocation)
    let newUserList = data.updatedUserList

    let userList = newUserList.filter((userObj)=>{
        return userObj.currentMap===currentMap
    })

    if(store.getState().player.id === posIndex.id){
        store.dispatch({
            type:'MOVE_PLAYER',
            payload: {
                position,
                currentMap,
                direction,
                stepsIndex,
                spriteLocation:spriteLocationPixel,
                status:posIndex.status
            }
        })
        }
    store.dispatch({type:'SET_PLAYER_STATES',payload:{userList}})   
})

socket.on('distributePlayerStates',(userList)=>{
    const {id, direction, stepsIndex, status:currentStatus, skills} = store.getState().player
    const playerMap = store.getState().map.currentMap
    const currentHealth = skills[0]
    const getMyUserInfo = userList.find((userObj)=>userObj.id === id)
    const currentSpritelocation = setSpriteLocation(direction,stepsIndex)

    if(getMyUserInfo && getMyUserInfo.currentMap){
    if(getMyUserInfo.spriteLocation.join(' ') !== currentSpritelocation.join(' ') || getMyUserInfo.status !== currentStatus){
        store.dispatch({
            type:'MOVE_PLAYER',
            payload: {
                direction:getMyUserInfo.direction,
                stepsIndex,
                spriteLocation:spriteIndexToPixels(getMyUserInfo.spriteLocation),
                status:getMyUserInfo.status,
                skills:getMyUserInfo.skills,
            }
        })
    }

    if(getMyUserInfo.skills[0] !== currentHealth){
        store.dispatch({
            type:'MOVE_PLAYER',
            payload: {
                skills:getMyUserInfo.skills,
                status:getMyUserInfo.status
            }
        })
    }

    if(playerMap !== getMyUserInfo.currentMap)
       store.dispatch({
        type:'CHANGE_MAP',
        payload:{
            currentMap:getMyUserInfo.currentMap
        }
    })

    let currentMapList = userList.filter((userObj)=>{
        return userObj.currentMap===getMyUserInfo.currentMap
    })
    store.dispatch({
        type:'SET_PLAYER_STATES',
        payload:{
            userList:currentMapList
        }
    })
    }   
})

socket.on('commandDeath',()=>{ //Dont touch this yet
    console.log('PLAYER HAS DIED.')
})

socket.on('assignId',({id,userList})=>{
    const {position,direction,stepsIndex,skills,tickAttacks,status, id:isId} = store.getState().player

    let currentMap = store.getState().map.currentMap
    const spriteLocation = setSpriteLocation(direction,0)


    if(isId === null){
    store.dispatch({type:'ASSIGN_ID',payload:{id}})
    socket.emit('requestUserAdd',{currentMap})
    socket.emit('sendPos',{id,currentMap,position:cleanPos(position),direction,stepsIndex,spriteLocation,skills,tickAttacks,status})    
    }
})

socket.on('requestMap',()=>{
    socket.emit('dispatchBuildMap',{map:store.getState().map.tiles})
})

socket.on('serveMap',(servedMap)=>{
    if(servedMap.tiles){
    store.dispatch({type:'SET_TILES',payload:{currentMap:servedMap.map,tiles:servedMap.tiles}})
    }
})

export const itemCheck = (requiredItem, keepItem) => {
    const items = store.getState().player.items
    const hasItem = items.includes(requiredItem) ? true : false
    if(!keepItem){
        store.dispatch({type:'REMOVE_ITEM', payload:{item:requiredItem}})
    }
    return hasItem
}

export const pushMapSwitch = (newMap,currentMap,id) => {
    let position = mapSwitch(newMap, currentMap)

    store.dispatch({type:'CHANGE_MAP',payload: {
        currentMap:newMap
    }})
    socket.emit('changeMap',{id,newMap,currentMap})
    dispatchOrientPlayer('SOUTH',position)
}

const checkMapObjects = (newPos,oldPos,tiles,currentMap,items,id)=>{
    let returnVal = null
    const y = newPos[1]/PLAYER_SPRITE_SIZE //because of how the map is structured the 0 index is the x axis
    const x = newPos[0]/PLAYER_SPRITE_SIZE
    const tryTile = tiles[y][x]
    const oldY = oldPos[1]/PLAYER_SPRITE_SIZE
    const oldX = oldPos[0]/PLAYER_SPRITE_SIZE
    const oldTile = tiles[oldY][oldX]
    
    let portalReturnVal = identifyPortal(tryTile,currentMap,id)
    returnVal = portalReturnVal

    if(tryTile > 200 && tryTile < 400){
        let {message, mapChanges, tradeObj, inventDispatchObj, passedReturnVal} = identifyInteractable(tryTile, y, x, oldTile, returnVal, items)
        returnVal = passedReturnVal // This is gimmicky but works. If I use returnVal i mess up scope. will change

        if(inventDispatchObj)store.dispatch(inventDispatchObj)

        if(mapChanges[0])socket.emit('pushMapChanges',{mapChanges,currentMap}) 
            
        if(message)store.dispatch({type:'SET_MESSAGE',payload:{message}})
            
        if(tradeObj !== null)store.dispatch({type:'SET_TRADE',payload:{tradeObj}})
            
        }else{
            if(store.getState().app.tradeObj)store.dispatch({type:'SET_TRADE', payload:{tradeObj:null}})
            if(store.getState().player.message)store.dispatch({type:'SET_MESSAGE',payload:{message:''}})
            }
        if(!returnVal)returnVal = tryTile < 100
            
    return returnVal
}

const dispatchOrientPlayer=(direction, oldPos)=>{
    const {stepsIndex:currentStepsIndex,id, skills,tickAttacks,status, spriteLocation} = store.getState().player
    const currentMap = store.getState().map.currentMap
    const userList = store.getState().app.userList

    const stepsIndex = setWalkIndex(currentStepsIndex)
    const newSpriteLocation = setSpriteLocation(direction,0)
    const cleanedPos = cleanPos(oldPos)
    const foundUser = userList.find(userObj => userObj.id === id)
    const hitFor = foundUser.hitFor

    if(spriteLocation !== newSpriteLocation)
    socket.emit('sendPos',{id,currentMap,position:cleanedPos,direction,stepsIndex,spriteLocation:newSpriteLocation,skills,tickAttacks,status,hitFor})
    
}

const dispatchMovePlayer=(direction, newPos)=>{
    const {stepsIndex:currentStepsIndex, id,skills,tickAttacks,status} = store.getState().player
    const {tiles,currentMap} = store.getState().map

    const stepsIndex = setWalkIndex(currentStepsIndex)
    const spriteLocation = setSpriteLocation(direction,stepsIndex)
    const cleanedPos = cleanPos(newPos)
    const userList = store.getState().app.userList
    const foundUser = userList.find(userObj => userObj.id === id)
    const hitFor = foundUser.hitFor

    if(notTelePort(newPos,tiles)){
    socket.emit('sendPos',{id,currentMap,position:cleanedPos,direction,stepsIndex,spriteLocation,skills,tickAttacks,status,hitFor})
    }
    
}

const attemptPlayerMove = (direction)=>{
    const userList = store.getState().app.userList
    const {id,position: oldPos,status: userStatus, items} = store.getState().player
    const {tiles, currentMap} = store.getState().map
    const newPos = newPlayerPosition(oldPos,direction)

    if(checkMapEdges(newPos) && checkMapObjects(newPos,oldPos,tiles,currentMap,items,id)&& notTelePort(newPos,tiles)&&notPlayerShell(newPos, userList, id)&&userStatus!=='combat'&&userStatus!=='fleeing'){
        dispatchMovePlayer(direction, newPos)
    }else if(notTelePort(newPos,tiles)){
        if(userStatus==='combat' && userStatus!=='fleeing'){
            store.dispatch({type:'SET_STATUS',payload:{status:'fleeing'}})
            fleeDelay(id)
        }
        dispatchOrientPlayer(direction,oldPos)
    }
}

const attemptInteraction = () =>{
    const {direction, position:currentPos,id:playerId,status:userStatus} = store.getState().player
    const interactionLocation = attemptLocation(currentPos,direction)
    const userList = store.getState().app.userList

    const foundUser = userList.find(userObj => {
        return userObj.position[0]===interactionLocation[0]&&userObj.position[1]===interactionLocation[1]&&userObj.id !== playerId//userObj.position === interactionLocation
    })
        if(foundUser){
        const playerUser = userList.find(userObj => userObj.id === playerId)
            switch(userStatus){
                case 'combat':
                    return;
                default:
                    emitCombat(playerUser,foundUser)        
                    return;
            }
        }
}

const emitCombat = (playerUser,otherUser) => {
    socket.emit('pushCombatInteraction',{playerUser,otherUser})
}

const fleeDelay = (id) => {  
    setTimeout(function(){
        store.dispatch({type:'SET_STATUS',payload:{status:'default'}})
        let status ='default'
        socket.emit('updateStatus',id,status)
    }, 1000);
}

const onUserInput = (e)=>{
    e.preventDefault()
   
    switch(e.keyCode){
        case 65:
            return attemptPlayerMove('WEST')
        case 37:
            return attemptPlayerMove('WEST')
        case 87:
            return attemptPlayerMove('NORTH')
        case 38:
            return attemptPlayerMove('NORTH')
        case 68:
            return attemptPlayerMove('EAST')
        case 39:
            return attemptPlayerMove('EAST')
        case 83:
            return attemptPlayerMove('SOUTH')
        case 40:
            return attemptPlayerMove('SOUTH')
        case 32:
            attemptInteraction()
            break;
        default: 
            return
    }
}

 const listener = (player) => {
    window.addEventListener('keydown', (e)=>{
        if(e.srcElement.nodeName !== 'INPUT')
        {
        onUserInput(e)   
        }
    })
    return player
}


export default listener