class Game {

    constructor() {
        this.players = {
            red: new NullPlayer(),
            green: new NullPlayer(),
            blue: new NullPlayer(),
            yellow: new NullPlayer(),
        };
        this.round_started = false;
        this.current_turn = null;
        this.dice_rolled = false;
        this.total_players = 0;
    };

    select_player(id) {
        for (const i of Object.values(this.players)) {
            if (i.id == id) {
                return i
            };
        };
        return null
    };

    connect(player) {
        if (!this.round_started) {
            let commands = { 0: 'red', 1: 'green', 2: 'blue', 3: 'yellow' };
            for (let i = 0; i < 4; i++) {
                if (this.players[commands[i]].compare(new NullPlayer())) {
                    player.command = commands[i];
                    this.players[commands[i]] = player;
                    this.total_players = this.total_players + 1;
                    return true;
                };
            };
        };
    };

    disconnect(player) {
        if (!this.round_started) {
            let commands = { 0: 'red', 1: 'green', 2: 'blue', 3: 'yellow' };
            let list = [];
            for (let i = 0; i < 4; i++) {
                if (this.players[commands[i]].compare(player)) {
                    player.command = null;
                } else if (!this.players[commands[i]].compare(new NullPlayer())) {
                    list.push(this.players[commands[i]]);
                };
            };
            for (let i = 0; i < 4; i++) {
                this.players[commands[i]] = list[i] || new NullPlayer();
                if (list[i]) {
                    this.players[commands[i]].command = commands[i]
                };
            };
        }; // else {exterminatus};
        this.total_players = this.total_players - 1;
    };

    log(sender_id = null) {
        let answer = {
            players: {
                red: this.players['red'].log(),
                green: this.players['green'].log(),
                blue: this.players['blue'].log(),
                yellow: this.players['yellow'].log()
            },
            round_started: this.round_started,
            command: null,
            current_turn: this.current_turn,
            dice_rolled: this.dice_rolled
        };
        if (!sender_id) {
            return answer;
        };
        if (this.select_player(sender_id)) {
            answer['command'] = this.select_player(sender_id).command;
        };
        return answer;
    }

    run() {
        this.round_started = true;
        this.current_turn = 'red';
        this.dice_rolled = false;
    };

    next_turn() {
        if (this.dice_rolled) {
            this.dice_rolled = false;
            let order = {
                'red': 'green',
                'green': 'blue',
                'blue': 'yellow',
                'yellow': 'red'
            };
            this.current_turn = order[this.current_turn];
            while (this.players[this.current_turn].compare(new NullPlayer())) {
                this.current_turn = order[this.current_turn];
            };
            return true;
        };
    };

};

class Player {

    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.command = null;
        this.cell_number = 0;
    };

    compare(other) {
        if (this.id === other.id) { return true };
        return false;
    };

    rename(name) {
        this.name = name
    };

    log() {
        return { name: this.name, id: this.id };
    };

    move(count) {
        this.cell_number = this.cell_number + count;
        if (this.cell_number > 39) {
            this.cell_number = this.cell_number - 40;
        };
    };

};

class NullPlayer extends Player {

    constructor() {
        super('null', null);
    };
};

module.exports = { Game, Player, NullPlayer };
