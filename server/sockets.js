

    let socket_list = new Array();

    class Sockets{
        constructor(id,socket){
            this.id = id;
            this.socket = socket;
            this.timer = 0;
        }
    }

    class Player extends Sockets{
        send_data(){
            
        }
    }

    module.exports = {
        'Socket': Sockets,
        'Player': Player,
        'socket_list': socket_list
    }
