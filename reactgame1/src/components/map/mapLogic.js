import React from 'react'
import PlayerShell from '../playerShell'
import Hitsplat from '../hitsplat'

export const gridRenderer = (tileVal) => {
    switch(tileVal){
        case 0:
            return 'grass'
        case 1:
            return 'stone' 
        case 5: 
            return 'wooden_panel'
        case 6:
            return 'wooden_panel_alt'
        case 70:
            return 'gate_open'
        case 101:
            return 'tree'
        case 102:
            return 'rock'
        case 104:
            return 'water'
        case 108:
            return 'bush1'
        case 109:
            return 'berry_bush'
        case 177:
            return 'campfire'
        case 180:
            return 'pillar'
        case 201:
        case 202:
        case 203:
        case 204:
        case 205:
            return 'sign'
        case 208:
            return 'bush1'
        case 216:
                return 'golden_chest'
        case 217:
                return 'golden_chest_open'
        case 221:
            return 'weighted_pressure_plate'
        case 222:
            return 'pressure_plate'
        case 223:
            return 'chest'
        case 224:
            return 'chest_open'
        case 229:
            return 'trap_stone'
        case 230:
            return 'trap_stone_open'    
        case 226:
            return 'chest_open_stone'
        case 237:    
        case 234:
        case 235:
        case 236:
            return 'tent1'
        case 233:
            return 'tent1'
        case 244:
            return 'grass'
        case 250:
            return 'golden_key'
        case 270:
            return 'gate'
        case 288:
            return 'canoe'
        case 298:
            return 'npc2'
        case 299:
            return 'npc1'
        case 1001:
        case 1002:
        case 1003:
        case 1004: 
        case 1005:
            return 'portal'
        default:
            return
    }
}

export const populateUsers = (userList) => {
    return (
        <div>
        {userList.map((user,i)=>{
            return <PlayerShell key={i} identity={userList[i]}/> 
        })}
        </div>
    )
}

export const populateHitsplats = (userList)=> {
    return(
        <div>
        {userList.map((userObj,i) => {
            return <Hitsplat key={i} userObj={userObj}/ >
        })}
        </div>
    )
}