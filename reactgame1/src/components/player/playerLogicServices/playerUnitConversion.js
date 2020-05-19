import {PLAYER_SPRITE_SIZE} from '../../../config/miscData'

export const spriteIndexToPixels = (spriteLocationIndex)=>{
    return `${spriteLocationIndex[0]*PLAYER_SPRITE_SIZE}px ${spriteLocationIndex[1]*PLAYER_SPRITE_SIZE}px`
}

export const indexToPixels = (posIndex)=>{
    let posPixels = [posIndex.position[0]*PLAYER_SPRITE_SIZE,posIndex.position[1]*PLAYER_SPRITE_SIZE]
    let posPixelIndex = {...posIndex, position:posPixels}
    return posPixelIndex
}

export const cleanPos=(pos)=>{
    let cleanedPos =[pos[0]/PLAYER_SPRITE_SIZE,pos[1]/PLAYER_SPRITE_SIZE]
    return cleanedPos
}
export const newPlayerPosition = (oldPos, direction) => {
    switch(direction){
        case 'WEST':
            return [oldPos[0]-PLAYER_SPRITE_SIZE,oldPos[1]]
        case 'NORTH':
            return [oldPos[0],oldPos[1]-PLAYER_SPRITE_SIZE]
        case 'EAST':
            return [oldPos[0]+PLAYER_SPRITE_SIZE,oldPos[1]]
        case 'SOUTH':
            return [oldPos[0],oldPos[1]+PLAYER_SPRITE_SIZE]
        default:
            return
        }
    
}

export const setWalkIndex = (stepsIndex) => {
    return stepsIndex >=7 ? 0 : stepsIndex + 1
}

export const setSpriteLocation = (direction,stepsIndex) => {
    switch(direction){
        case 'WEST':
            return [stepsIndex,2]
        case 'NORTH':
            return [stepsIndex, 3]
        case 'EAST':
            return [stepsIndex, 1]
        case 'SOUTH':
            return [stepsIndex, 0]
        default:
            return
    }
}

export const attemptLocation = (oldPos, direction) => {
    switch(direction){
        case 'WEST':
            return [(oldPos[0]/PLAYER_SPRITE_SIZE)-1,(oldPos[1]/PLAYER_SPRITE_SIZE)]
        case 'NORTH':
            return [(oldPos[0]/PLAYER_SPRITE_SIZE),(oldPos[1]/PLAYER_SPRITE_SIZE)-1]
        case 'EAST':
            return [(oldPos[0]/PLAYER_SPRITE_SIZE)+1,(oldPos[1]/PLAYER_SPRITE_SIZE)]
        case 'SOUTH':
            return [(oldPos[0]/PLAYER_SPRITE_SIZE),(oldPos[1]/PLAYER_SPRITE_SIZE)+1]
        default:
            return
        }
    
}
