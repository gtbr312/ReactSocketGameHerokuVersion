import store from '../../config/store'

import {tiles as spawnSite} from '../../data/maps/map1'
import {tiles as camp} from '../../data/maps/map2'
import {tiles as woods} from '../../data/maps/map3'
import {tiles as wreck} from '../../data/maps/map4'
import {tiles as temple} from '../../data/maps/map5'

const dispatchMap = (currentMap) => {
    switch(currentMap){
        case 'spawnSite':
                store.dispatch({type:'ADD_TILES',payload: {
                    tiles:spawnSite
                }})
                
            break;
        case 'camp':
                store.dispatch({type:'ADD_TILES',payload: {
                    tiles:camp
                }})
            break;
        case 'woods': 
                store.dispatch({type:'ADD_TILES',payload: {
                    tiles:woods
                }})
            break;
        case 'wreck':
                store.dispatch({type:'ADD_TILES',payload: {
                    tiles:wreck
                }})
            break;
        case 'temple':
                store.dispatch({type:'ADD_TILES',payload: {
                    tiles:temple
                }})
            break;
        default:
            return
    }
    
}

export const completeMapsObj = [{map:'spawnSite',tiles:spawnSite},{map:'camp',tiles:camp},{map:'woods',tiles:woods},{map:'wreck',tiles:wreck},{map:'temple',tiles:temple}]
export default dispatchMap