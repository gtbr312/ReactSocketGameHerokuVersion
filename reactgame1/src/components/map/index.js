import React from 'react'
import {connect} from 'react-redux'
import { PLAYER_SPRITE_SIZE } from '../../config/miscData'
import './styles.css'

import {gridRenderer, populateUsers, populateHitsplats} from './mapLogic'



const Map = (props) => {
        return(
        <div>
        <div className={`map_container`}
        key='map_container'
         style={{
             width:PLAYER_SPRITE_SIZE*20,
             height:PLAYER_SPRITE_SIZE*10,
         }}
        >
        {
            props.tiles.map((row,i)=>{
                let rowIndex=i
                return row.map((tile,i) => {
                    return (
                    <div key={`tile_${rowIndex}_${i}`} className={`tile tile_${rowIndex}_${i} ${gridRenderer(tile)}`}
                    />
                    )
                })
            })
        }
       </div>
       {populateHitsplats(props.userList)}
       {populateUsers(props.userList)}
       </div>
        ) 
}


function mapStateToProps(state){
    return {
        tiles:state.map.tiles,
        userList:state.app.userList,
    }    
}


export default connect(mapStateToProps)(Map)
