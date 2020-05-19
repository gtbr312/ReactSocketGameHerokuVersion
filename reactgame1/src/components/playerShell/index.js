import React from 'react'
import walkSprite from '../player/player_walk.png'
import {connect} from 'react-redux'
import {PLAYER_SPRITE_SIZE} from '../../config/miscData'

const PlayerShell = (props) => {
        return(
            <div className='shell '
                key={`${props.identity}`}
                style={{
                    position:'absolute',
                    currentMap: props.identity && props.identity.currentMap ? props.identity.currentMap : 'spawnSite',
                    left: props.identity && props.identity.position ? props.identity.position[0]*PLAYER_SPRITE_SIZE : 0,
                    top: props.identity && props.identity.position ? props.identity.position[1]*PLAYER_SPRITE_SIZE : 0,                
                    backgroundPosition:  props.identity && props.identity.spriteLocation ? `${props.identity.spriteLocation[0]*PLAYER_SPRITE_SIZE}px ${props.identity.spriteLocation[1]*PLAYER_SPRITE_SIZE}px`: [1,1],
                    backgroundImage:`url('${walkSprite}')`,
                    backgroundSize: `${PLAYER_SPRITE_SIZE*8}px ${PLAYER_SPRITE_SIZE*4}px`,
                    width: PLAYER_SPRITE_SIZE,
                    height: PLAYER_SPRITE_SIZE,
                }}
            />
        )
}

function mapStateToProps(state){
    return{
        ...state.player,
        tiles:state.map.tiles
    }
}

export default connect(mapStateToProps)(PlayerShell)