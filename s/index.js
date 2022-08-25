const express = require("express")
const app = express()
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const game = require("./game");
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});


let new_game = {
    player_0_id: null,
    player_1_id: null,
    player_0_scors: [...game.scors],
    player_1_scors: [...game.scors],
    turn: 0,
    full: false
}

let firs_connection = true

io.on("connection", (client) => {

    client.on("join", () => {
        if (new_game.full) return
        if (firs_connection) {
            new_game.player_0_id = client.id
            firs_connection = false
            client.turn = 0
            client.roll = 0
            client.emit("turn", { turn: client.turn })
            client.join("game")
        }
        else {
            new_game.player_1_id = client.id
            new_game.full = true
            client.turn = 1
            client.roll = 0

            client.join("game")
            client.emit("turn", { turn: client.turn })
            setTimeout(() => {
                io.to("game").emit("game_res", [new_game.player_0_scors, new_game.player_1_scors])
            }, 1000)
        }
    })


    client.on("dice", ({ keep }) => {
        if (client.turn !== new_game.turn) return
        if (client.roll == 3) return
        client.roll = client.roll + 1
        let length = 5 - keep.length
        let dice = game.trow_dice(length)
        let clean_dice = [...keep].concat(dice)
        io.to("game").emit("dice", { clean_dice })
        let dice_res = game.check_all_modes(clean_dice)
        client.emit("dice_res", { dice_res })

    })


    client.on("set_score", ({ index, point }) => {
        if (new_game[`player_${client.turn}_scors`][index].score !== -1) return
        new_game[`player_${client.turn}_scors`][index] = { name: new_game[`player_${client.turn}_scors`][index].name, score: point }
        new_game.turn = client.turn == 0 ? 1 : 0
        client.roll = 0
        io.to("game").emit("game_res", [new_game.player_0_scors, new_game.player_1_scors])


    })


})










server.listen("6544")