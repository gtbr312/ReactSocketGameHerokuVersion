import { itemCheck, pushMapSwitch} from '../playerLogic'
import {cleanPos} from './playerUnitConversion'
import {PLAYER_SPRITE_SIZE} from '../../../config/miscData'

export const identifyInteractable = (tryTile,y ,x, oldTile, returnVal) => {
    let message = ''
    let mapChanges = []
    let tradeObj = null
    let inventDispatchObj

    switch(tryTile){
        case 201:
            message=`Great job. Try walking through the portals to continue through the world.`
            break;
        case 202:
            message='Portal to the campsite. Bring your coins!'
            break;
        case 203:
            message='Portal to the woods. Beware of bandits!'
            break;
        case 204:
            message='Portal to the wildland roads.'
            break;
        case 205:
            message='Portal to temple ruins.'
            break;
        case 208:
            message='inside the bush you find a oddly shaped stone. It is very heavy.'
            inventDispatchObj = {type:'ADD_ITEM', payload:{item:'weight'}}
            mapChanges.push({y,x,tileType:108})
            break;
        case 216:
            if(itemCheck('goldenKey')){
                mapChanges.push({y,x,tileType:213})
                message='You unlock the chest and find a large map...'
                inventDispatchObj = {type:'ADD_ITEM', payload:{item:'scoutsMap'}}
            }else{
                message='The chest is locked...'
            }
            break;
        case 222:
            if(itemCheck('weight')){
                message='You place the weight onto the pressure plate'
                mapChanges.push({y,x,tileType:221})
            }else{
            message='As you step onto the plate you hear a rumbling nearby.'
            mapChanges.push({y:y+1,x,tileType:244})
            returnVal=true
            }
            mapChanges.push({y:y+2,x:x-3,tileType:1})
            mapChanges.push({y:y+2,x:x-4,tileType:1})
            mapChanges.push({y:y+2,x:x-5,tileType:1})            
            break;
        case 223:
            message='You open the chest and find 10 coins!'
            mapChanges.push({y,x,tileType:224})
            inventDispatchObj = {type:'CHANGE_COINS', payload:{amount:10}}
            break;
        case 217:
        case 224:
        case 226:
        case 230:
            message='You have already looted this chest.'
            break;
        case 229:
            message='You open the chest and are damaged by a trap!'
            mapChanges.push({y,x,tileType:230})
            inventDispatchObj = {type:'REMOVE_LIFE'}
            break;
        case 233:
            message='The tent appears to be empty.'
            break;
        case 234:
            message='Someone emerges from the tent...'
                    mapChanges.push({y:y+1,x,tileType:299})
                    mapChanges.push({y,x,tileType:233})
            break;
        case 236:
            message='Someone emerges from the tent...'
            mapChanges.push({y:y-1,x,tileType:298})
            mapChanges.push({y,x,tileType:233})
            break;
        case 244:
            switch(oldTile){
                case 222:
                    message='As you step off the pressure plate somthing splashes into the water...'
                    mapChanges.push({y:y+1,x,tileType:0})
                    mapChanges.push({y:y+1,x:x-3,tileType:104})
                    mapChanges.push({y:y+1,x:x-4,tileType:104})
                    mapChanges.push({y:y+1,x:x-5,tileType:104})
                    break;
                default:
                    break;
            }
            returnVal=true;
            break;
        case 250:
            message='You pick up a golden key'
            inventDispatchObj = {type:'ADD_ITEM', payload:{item:'goldenKey'}}
            mapChanges.push({y,x,tileType:1})
            returnVal=true;
            break;
        case 270:
            if (itemCheck('obsidianKey')){
            console.log('PASSED itemCheck ',itemCheck('obsidianKey'), itemCheck('obsidianKey'))
            message=`The obsidian key fits into the gate and it slides open...`
            mapChanges.push({y,x,tileType:70})
            }else message = 'The gate is made of obsidian. It has a keyhole in the center of its arch...'

            break;
        case 288:
            if(itemCheck('certificate',true)){
                message='You climb into the canoe...'
                returnVal=true
            }else message=`This canoe isn't yours to use`

            break;
        case 298:
            if(itemCheck('obsidianKey',true))
            {
                message='Duadel: Good luck in the temple.'
            }
            else if(itemCheck('scoutsMap',true)){
                tradeObj={isActive:true, vendor:'Duadel', offerItem:'obsidianKey', coinsPrice:0, itemPrice:'scoutsMap'}
                message='You purchase the obsidianKey from Duadel.'

            }else message=`Duadel: I'll trade you this obsidian key if you can find my map.`
            break;
        case 299:
            if(itemCheck('certificate',true )){
                message='What?!?!'
            }else{
                tradeObj={isActive:true, vendor:'Ned', offerItem:'certificate', coinsPrice:100, itemPrice:null}
                message=`You purchase the canoe's certificate of ownership from Ned.`
            } 
            break;
        default:
            break;
    }
    let passedReturnVal = returnVal
    return {message, mapChanges, tradeObj, inventDispatchObj, passedReturnVal}

}

export const identifyPortal = (tryTile,currentMap,id) => {
    let returnVal = null
    switch(tryTile){
        case 1001:
            pushMapSwitch('spawnSite',currentMap,id)
            returnVal = false
            break;
        case 1002:
            pushMapSwitch('camp',currentMap,id)
            returnVal = false
            break;
        case 1003:
            pushMapSwitch('woods',currentMap,id)
            returnVal = false
            break;
        case 1004:
            pushMapSwitch('wreck',currentMap,id)
            returnVal = false
            break;
        case 1005:
            pushMapSwitch('temple',currentMap,id)
            returnVal = false
            break;
        default:
            break;
    }
    return returnVal
}

export const notTelePort = (newPos,tiles)  => {  
    const y = newPos[1]/PLAYER_SPRITE_SIZE //because of how the map is structured the 0 index is the x axis
    const x = newPos[0]/PLAYER_SPRITE_SIZE
    if(tiles[y]){
    const tryTile = tiles[y][x]
    let returnVal = tryTile >=1000 ? false : true
    return returnVal
}else return true
}

export const notPlayerShell = (newPos,userList,id) => {
    const cleanedPos = cleanPos(newPos)
    const shellsAtLocation = userList.filter(userObj => {
        return userObj.position.join(' ') === cleanedPos.join(' ') && userObj.id !== id
    })
    if(shellsAtLocation[0]){
        return false
    }else return true
}