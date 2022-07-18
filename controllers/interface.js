const { baseKeyboard } = require('../keyboards');

const MakerMaker = async ctx => {
    ctx.scene.enter('MAKER_MAKER_SCENE');
}

const TakerMaker = async ctx => {
    ctx.scene.enter('TAKER_MAKER_SCENE');
}

const MakerTaker = async ctx => {
    ctx.scene.enter('MAKER_TAKER_SCENE');
}

const TakerTaker = async ctx => {
    ctx.scene.enter('TAKER_TAKER_SCENE');
}


module.exports = {
    MakerMaker, TakerMaker,
    MakerTaker, TakerTaker
}