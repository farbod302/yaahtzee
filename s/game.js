const game = {
    dice: [1, 2, 3, 4, 5, 6],
    trow_dice(time) {
        let nums = []
        for (let i = 0; i < time; i++) {
            let rand = Math.floor(Math.random() * 5)
            nums.push(this.dice[rand])
        }
        return nums
    },
    scors: [
        {
            name: "ones",
            score: -1,
        },
        {
            name: "tows",
            score: -1,
        },
        {
            name: "threes",
            score: -1,
        },
        {
            name: "fours",
            score: -1,
        },
        {
            name: "fives",
            score: -1,
        },
        {
            name: "sixes",
            score: -1,
        },
        {
            name: "three of kind",
            score: -1,
        },
        {
            name: "four of kind",
            score: -1,
        },
        {
            name: "full house",
            score: -1,
        },
        {
            name: "small straight",
            score: -1,
        },
        {
            name: "large straight",
            score: -1,
        },
        {
            name: "chance",
            score: -1,
        },
        {
            name: "yahtzee",
            score: -1,
        },



    ],
    check_nums(dices) {
        let names = ["ones", "twos", "threes", "fours", "fives", "sixes"]
        let scors = []
        for (let i = 1; i <= 6; i++) {
            let s_num = [...dices].filter(e => e === i)
            let length = s_num.length
            scors.push({
                name: names[i - 1],
                score: length * i
            })

        }
        return scors
    },
    check_n_of_kind(dices, n) {
        let score = 0
        let kind_num = -1
        for (let i = 1; i <= 5; i++) {
            let s_num = [...dices].filter(e => e === dices[i])
            let length = s_num.length
            if (length < n) { continue }
            score = 0
            dices.map(e => { return score += e })
            kind_num = dices[i]
        }
        return { score, kind_num }
    },
    check_full_house(dices) {
        let _is_kind = this.check_n_of_kind(dices, 3)
        if (_is_kind.kind_num === -1) return { name: "full_house", score: 0 }
        const { kind_num } = _is_kind
        let left_dice = [...dices].filter(e => e !== kind_num)
        const two_kind = this.check_n_of_kind(left_dice, 2)
        if (two_kind.kind_num > -1) return { name: "full_house", score: 25 }
        return { name: "full_house", score: 0 }
    },
    check_small_straight(dices) {
        let accepted_moeules = [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6],
        ]
        let sorted_dices = [...dices].sort((a, b) => { return a - b })
        sorted_dices = sorted_dices.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === sorted_dices.findIndex(obj => {
                return JSON.stringify(obj) === _value;
            });
        });
        sorted_dices = sorted_dices.slice(0, 4)
        let score = 0
        let str_dice = JSON.stringify(sorted_dices)
        accepted_moeules.forEach(e => {
            let str = JSON.stringify(e)
            if (str === str_dice) return score=30
        })
        return { name: "small_straight", score }


    },
    check_large_straight(dices) {
        let accepted_moeules = [
            [1, 2, 3, 4, 5],
            [2, 3, 4, 5, 6],
        ]
        let sorted_dices = [...dices].sort((a, b) => { return a - b })
        sorted_dices = sorted_dices.filter((value, index) => {
            const _value = JSON.stringify(value);
            return index === sorted_dices.findIndex(obj => {
                return JSON.stringify(obj) === _value;
            });
        });
        sorted_dices = sorted_dices.slice(0, 5)
        let score = 0
        let str_dice = JSON.stringify(sorted_dices)
        accepted_moeules.forEach(e => {
            let str = JSON.stringify(e)
            if (str === str_dice) return score = 40
        })
        return  {name:"large_straight",score}

    },
    check_yahtzee(dices) {
        const { kind_num } = this.check_n_of_kind(dices, 5)
        if (kind_num > -1) return {name:"yahtzee",score:50}
        return  {name:"yahtzee",score:0}
    },
    check_chance(dices) {
        let score = 0
        dices.map(e => { return score += e })
        return {name:"chance",score}
    },
    check_all_modes(dices) {
        let sum = []
        let nums=this.check_nums(dices)
        sum=sum.concat(nums)
        console.log(sum);
        sum.push ({name:"three_of_kind",score:this.check_n_of_kind(dices, 3).score})
        sum.push ({name:"foure_of_kind",score:this.check_n_of_kind(dices, 4).score})
        sum.push(this.check_full_house(dices))
        sum.push(this.check_small_straight(dices))
        sum.push(this.check_large_straight(dices))
        sum.push(this.check_yahtzee(dices))
        sum.push(this.check_chance(dices))
        return sum

    }

}

module.exports = game