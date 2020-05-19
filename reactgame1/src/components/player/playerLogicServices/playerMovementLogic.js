import {PLAYER_SPRITE_SIZE, MAP_WIDTH, MAP_HEIGHT} from '../../../config/miscData'

export const checkMapEdges = (newPos) => {
    return (newPos[0] >= 0 && newPos[0] <= MAP_WIDTH - PLAYER_SPRITE_SIZE) &&
    (newPos[1] >= 0 && newPos[1] < MAP_HEIGHT)
}

