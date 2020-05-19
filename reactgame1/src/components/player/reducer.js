import { PLAYER_SPRITE_SIZE } from "../../config/miscData"

const initialState = {
    id:null,
    position: [PLAYER_SPRITE_SIZE*9,PLAYER_SPRITE_SIZE*2],
    spriteLocation: '0px 0px',
    direction:'SOUTH',
    stepsIndex:0,
    messages:[],
    lives:3,
    skills:[10,1,1,1],
    coins:0,
    items:['scoutsMap'],
    status:'default',
    tickAttacks:[1,0,0,0,0,0,0,0]
}

const playerReducer = (state=initialState,action)=>{
    switch(action.type){
        case 'SET_STATUS':
            return{
                ...state,
                ...action.payload
            }
        case 'MOVE_PLAYER':
            return{
                ...state,
                ...action.payload
            }
        case 'ORIENT_PLAYER':
            return{
                ...state,
                ...action.payload
            }
        case 'TELEPORT_PLAYER':
            return{
                ...state,
                ...action.payload
            }
        case 'SET_MESSAGE':
            let pushedMessageArrayState = state
            if(action.payload.message !== state.messages[state.messages.length-1])
            action.payload.message && pushedMessageArrayState.messages.push(action.payload.message)

            if(pushedMessageArrayState.messages.length >= 6) pushedMessageArrayState.messages.shift()

            return{
                ...pushedMessageArrayState
            }
        case 'REMOVE_LIFE':
            let lives=state.lives-1
            return{
                ...state,
                lives
            }
        case 'CHANGE_COINS':
            let newCoinAmount = {...state}
            newCoinAmount.coins += action.payload.amount
            return {
                ...newCoinAmount,

                
            }
        case 'ADD_ITEM':
            let addedItemListState = {...state}
            addedItemListState.items.push(action.payload.item)
            console.log('newlist',addedItemListState.items)
            return {
                ...addedItemListState
            }
        case 'REMOVE_ITEM':
            let removedItemListState = {...state}
            removedItemListState.items = state.items.filter(item => item !== action.payload.item)
            return{
                ...removedItemListState
            }
        case 'ASSIGN_ID':
            return {
                ...state,
                id:action.payload.id
                //heres where current location could go
            }
        default:
            return state
    }
}

export default playerReducer