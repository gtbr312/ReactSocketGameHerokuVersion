const initialState = {
    userList:[],
    mapList:[{meme:'dream'}],
    appState:'landingPage',
    tradeObj:null
}
const appReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'SET_PLAYER_STATES':
            return{
                ...state,
                userList:action.payload.userList
            }
        case 'SET_MAP_STATE':{
            return{
                ...state,
                mapList:action.payload.allMaps
            }
        }
        case 'SET_APPSTATE':
            return{
                ...state,
                ...action.payload
            }        
        case 'SET_TRADE':
            return {
                ...state,
                tradeObj:action.payload.tradeObj
            }
        default:
            return state
    }
}

export default appReducer