import React, { useEffect } from 'react'
import Player from '../player'

import {ENDPOINT} from '../../config/miscData'
import {PORT} from '../../../../server'
import io from 'socket.io-client'

import { connect } from 'react-redux'

import Map from '../map'
import Stats from '../HUD_Features/stats'
import TextHUD from '../HUD_Features/textHUD'

import dispatchMap, { completeMapsObj } from './dispatchMap'
import {npcData} from '../../data/npcs/npcData'

const socket=io(PORT)



socket.on('requestWorld',()=>{
        socket.emit('pushNpcList',npcData)
        socket.emit('pushWorldState',completeMapsObj) 
})


const World = (props) => {
    useEffect(()=>{
        dispatchMap(props.currentMap)
    },[]) //empty array allows emulation of componentDidMount due to it checking for change in val. Empty array will nev change. Not sure if gimmic but works well.

    return (
        <div>
                <Map/>
                <Player/> 
                <Stats/>
                <TextHUD/>
            </div>
    )
}

function mapStateToProps(state){
    return { 
       currentMap:state.map.currentMap
    }    
}

export default connect(mapStateToProps)(World)