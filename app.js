
    const express = require('express');
    const serveStatic = require('serve-static');
    const app = express();
    const mongoose = require('mongoose')
    const csv_parser = require('csv-parser');
    const fs = require('fs');
    const Server = require('http').Server(app);
    const Sockets = require(__dirname + '/server/sockets.js')['Socket'];
    const Player = require(__dirname + '/server/sockets.js')['Player'];
    
   

    mongoose.connect('mongodb+srv://roo_user31:2QN5oyPFlcXv2HgN@rooman.a4rsd.mongodb.net/roomandb?retryWrites=true&w=majority',{ 
          useNewUrlParser: true,
          useUnifiedTopology: true
    })
    const db = mongoose.connection
    const Players = require(__dirname+'/server/models/players.js')
    var fetch_players = null;
    

    db.once('open',() =>{
        console.log('Database Connection Established! ')
    })

    let socket_list =  require(__dirname + '/server/sockets.js')['socket_list']
    let filter_obj_arr =  require(__dirname + '/server/function_holders.js')['Filter_obj_arr']
    
    //Routers
    app.get('/',async function(req,res){
        try{
            fetch_players = await Players.find()
            res.sendFile(__dirname + '/client/index.html');
        }catch(err){
            res.send('Error: '+err)
        }
    });


    


    app.use('/', express.static(__dirname +'/client') );


    const port = process.env.PORT || 8080
    Server.listen(port);
    console.log(`Server Started at Port ${port}`)



    const io = require('socket.io')(Server);
    io.on('connection',function(socket){

        socket.on('newSock',function(){
            socket_list_length = socket_list.length;
            socket_list.push( new Player(socket_list_length+1,socket) );
            socket.emit('assign_player_id',{
                id: socket_list.length
            })

            socket.emit('get_top_players',{
                players: fetch_players,
            })
        })

        socket.on('save-player',async(player) =>{
            const new_player = new Players({
                name: player.name,
                score: player.score,
                level: player.level
            })
            await new_player.save()
        })
        

        socket.on('keepConnection',function(sock_data){
            for(let index=0; index < socket_list.length; index++){
                if(sock_data.sock_id == socket_list[index].id ){
                    socket_list[index].timer = 0;
                }
            }
        });

        socket.on('sendEnv',function(env_data){
            let results = new Array();
            fs.createReadStream(`server/maps/${env_data.environment}.csv`)
                .pipe(csv_parser({}))
                .on('data',(data) =>{
                    results.push(data)
                }).on('end',() =>{
                    socket.emit('receiveEnv',{
                        env_array: results
                    })
            })
        })

    });


    setInterval(function(){
        for(let index = 0; index < socket_list.length; index++){
            socket_list[index].timer++;
            if(socket_list[index].timer > 9){
                socket_list = socket_list.filter((sock) => sock.id != socket_list[index].id);
            }
        }
    },1000)

