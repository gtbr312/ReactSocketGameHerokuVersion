const initialState = {
    tiles:[],
    currentMap:'spawnSite',
    lastMap:''
}

const mapReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'ADD_TILES':
            return{
                ...state,
                ...action.payload
            }
        case 'SET_TILES':
            console.log('in set tiles',action.payload)
            return{
                ...state,
                currentMap:action.payload.currentMap,
                lastMap:state.currentMap,
                tiles:action.payload.tiles
            }
        case 'CHANGE_MAP':
            return{
                ...state,
                ...action.payload,
                lastMap:state.currentMap
            }
        case 'CHANGE_ENVIRONMENT':
            let changedEnv = {...state}
            changedEnv.tiles[action.payload.y][action.payload.x]=action.payload.tileType
            return {
                ...changedEnv
            }
        default:
            return state
    }
}

export default mapReducer