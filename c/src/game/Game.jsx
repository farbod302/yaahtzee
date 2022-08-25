import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import "./game.scss"

const Game = () => {


    const [turn, setTurn] = useState(null)
    const [game, setGame] = useState({ player_0: [], player_1: [] })
    const [cleanGame, setCleansGame] = useState({ me: [], player: [] })
    const [dice, setDice] = useState([])
    const [diceKeep, setDiceKeep] = useState([])
    const [socket, setSocket] = useState(null)
    const [diceRes, setDiceRes] = useState([])


    useEffect(async () => {
        let socket = await io("http://localhost:6544")
        setSocket(socket)


        socket.on("turn", (data) => {
            setTurn(data.turn)
        })


        socket.on("dice", (data) => {
            setDice(data.clean_dice)
            setDiceKeep([])
        })

        socket.on("game_res", (data) => {
            setGame(data)
        })

        socket.on("dice_res", (data) => {
            setDiceRes(data.dice_res)
        })


    }, [])

    useEffect(() => {

        let clean = {}
        if (turn === null) return
        let player = turn === 0 ? 1 : 0
        clean.me = [...game[turn]]
        clean.player = [...game[player]]
        console.log(clean);
        setCleansGame(clean)


    }, [game])

    const game_functions = {
        start() { socket.emit("join") },
        dice() { socket.emit("dice", { keep: diceKeep }) },
        add_to_keep(index) {
            setDiceKeep(prv => prv.concat(dice[index]))
            setDice(prv => prv.filter((e, i) => i !== index))
        },
        remove_from_keep(index, val) {
            setDice(prv => prv.concat(val))
            setDiceKeep(prv => prv.filter((e, i) => i !== index))

        },
        set_score(index, point) {
            socket.emit("set_score", { index, point })
            setDiceRes([])
        }


    }

    return (
        <div className="game-fild">
            {!socket ?
                <div className="splash">Wait for connection</div> :
                turn == null ? <div className="splash" onClick={game_functions.start}><span>Start Game</span></div>
                    : null
            }
            <div className="fild">

                <div className="dices">
                    {dice.map((d, i) => <div onClick={() => { game_functions.add_to_keep(i) }}>{d}</div>)}
                </div>
                <div>you:
                    <br />
                    <div className="roll">
                        <button onClick={game_functions.dice}>Roll Dice</button>
                    </div>
                    <div className="keep">
                        {diceKeep.map((d, index) => <div onClick={() => game_functions.remove_from_keep(index, d)}>{d}</div>)}
                    </div>

                    <div className="dice-option">
                        {diceRes.map((d, index) =>
                            <div onClick={() => { game_functions.set_score(index, d.score) }}>{d.name}:{d.score}</div>
                        )}
                    </div>
                </div>
            </div>
            <div className="scores" >

                <div>
                    <div className="title">you</div>

                    <ul className="scors-list">
                        {cleanGame["me"].map(s =>
                            <li>
                                <div>{s.name}</div>
                                <div>{s.score === -1 ? "" : s.score}</div>
                            </li>
                        )}
                    </ul>
                </div>
                <div>
                    <div className="title">player</div>
                    <ul className="scors-list">
                        {cleanGame["player"].map(s =>
                            <li>
                                <div>{s.name}</div>
                                <div>{s.score === -1 ? "" : s.score}</div>
                            </li>
                        )}
                    </ul>

                </div>

            </div>
        </div>
    );
}

export default Game;