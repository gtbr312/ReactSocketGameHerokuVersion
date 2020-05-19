import {createStore, combineReducers} from 'redux'
import playerReducer from '../components/player/reducer'
import mapReducer from '../components/map/reducer'
import appReducer from './appStore/reducer'


const rootReducer = combineReducers({
    app:appReducer,
    player:playerReducer,
    map: mapReducer
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store