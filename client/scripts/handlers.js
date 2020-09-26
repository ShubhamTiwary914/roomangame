
    $(document).ready(function(){


        function load_new_level(){
            //start game
                $('#container').empty();
                $('#container').append($(`<div class='player-container'></div>`))
                gameMode = 'play';
                
                

                if(enemies.length > 0){  
                    enemies = new Array()
                }
                    enemies.push( new Red(enemies_spawn_position[0],'red-container',0) )
                    enemies.push( new Pink(enemies_spawn_position[1],'pink-container',1) )
                    enemies.push( new Blue(enemies_spawn_position[2],'blue-container',2) )   
                    enemies.push( new Orange(enemies_spawn_position[3],'orange-container',3) )
                    $('#container').append($(`<div class='enemy-container red-container'></div>`))
                    $('#container').append($(`<div class='enemy-container blue-container'></div>`))
                    $('#container').append($(`<div class='enemy-container pink-container'></div>`))
                    $('#container').append($(`<div class='enemy-container orange-container'></div>`))
                    $('#container').append($(`<div class='score'></div>`))
                    $('#container').append($(`<div class='target target-1'></div>`))
                    $('#container').append($(`<div class='target target-2'></div>`))
                    $('#container').append($(`<div class='target target-3'></div>`))
                
                create_new_gameplay_environment()
                if(device_type == 'pc'){
                    gameplay_grid.request_environment(socket,'pc')
                    if(level == 0)
                        load_side_stats()
                }
                    
                else{
                    gameplay_grid.request_environment(socket,'phone')
                    if(level == 0)
                        get_mobile_controls('container')
                }
                   
        }

        function load_level_display(display_type='level-up'){ //show level and all stats
            $('#container').empty();
            $('#container').append($(`<div class='stats-container'></div>`))
            if(display_type == 'level-up'){
                $('#container').append($(`<div class='level-container'></div>`))
                if(!level > 0){ //start menu
                    $('.level-container').text(`Level ${level+1}`)
                }else{ //after player completes a level
                    if(device_type == 'pc'){
                        $('.level-container').css('left','180px')
                    }
                    else{
                        $('.level-container').css('left','10px')
                    }
                        
                    $('.level-container').text(`Level ${level} Completed!`)
                    $('.stats-container').append((level_stats(player)))
                    if(device_type == 'phone'){
                        $('.stats-container').css('top','300px')
                    }
                         
                }
            }else{
                if(device_type == 'phone'){
                    $('.stats-container').css('top','180px')
                }
                $('#container').append($(`<div class='over-container'>Score    <em>${player.score}</em></div>`))
                $('.stats-container').append(get_total_stats(player,device_type))
            } 
        }


        function clear_level(type='env'){
            if(player != null && type == 'player'){
                player.x = player_default_position[0]
                player.y = player_default_position[1]
                player.direction = 'right'
                player.pills_eaten_s = 0;
                player.pills_eaten_b = 0;
                player.enemies_eaten = 0;
                
            }
            if(type=='env'){
                player.pills_eaten = 0
                walls = new Array()
                created_walls = 0;
                walls_position = new Array();

                pills = new Array();
                created_pills = 0;
                pills_position = new Array()

                empty_spaces = new Array()
                empty_spaces_count = 0;
            }
            
        }


        //Main Menu Inputs
        $('.button-grid button').click(function(){
            if($(this).attr('id')=='play'){
                load_level_display()
                setTimeout(function(){
                    load_new_level()
                },700)
            }
            else if($(this).attr('id')=='board'){
                fetch_top_players(top_sort_by)
            }
            else if($(this).attr('id')=='help'){
                load_help()
            }else if($(this).attr('id')=='exit'){
                load_exit()
            }
            
        })

        $('#container').on('click','#save-player-button',function(){
            let rank = filter_player_data($('input').val(),player.score,level)
            socket.emit('save-player',{
                name: $('input').val(),
                score: player.score,
                level: level+1
            })
            $('input').val('')
            $('.save-player-container').html(`
                Your rank is ${rank} worldwide!
            `)
        })


        $('#container').on('click','.top-players-next',function(){
            players_range_start +=10
            players_range_end += 10
            console.log(players_range_start)
            fetch_top_players(top_sort_by)
        })

        $('#container').on('click','.go-back',function(){
            window.location.reload(true)
        })



        //Socket handlers(creation)
        socket.emit('newSock',{});
        socket.on('assign_player_id',function(received_id){
            player = new Player(player_default_position[0],player_default_position[1],received_id.id);
        })

        //Socket Handlers(environments)
        socket.on('receiveEnv',function(env_data){
            gameplay_grid.environment_array = environment_objects_to_array(env_data.env_array)
            gameplay_grid.draw_gameplay_environment()
            total_pills = pills.length 
        });


        //Player controls handlers
        $(window).keydown(function(event){
            if(player != null && gameMode == 'play'){
                player.access_movement_event(event);
            }
        })

        $(window).keyup(function(event){
            if(player != null && gameMode == 'play'){
                player.access_movement_event(event);
            }
        })

        $('#container').on('click','button',function(){
            if(player != null && gameMode == 'play'){
               player.access_movement_event($(this).attr('id'),'mobile-controller')
            }
        })
        
    
        setInterval(function(){   // local clock-time cycle
            if(player != null){
                player.x += player.velocity_x;
                player.y += player.velocity_y;
                player.eat_pill_detector();
                player.detect_boundaries();
                player.draw_player();
                
                if(player.pills_eaten == total_pills){
                    clear_level()
                    level +=1
                    load_level_display()
                    if(device_type == 'pc'){
                        $('.side-stats').hide()
                    }
                    setTimeout(function(){
                        load_new_level()
                        clear_level('player')
                        $('.side-stats').show()
                    },5000)
                }

                if(device_type == 'pc'){
                    $('.side-stats-data').html(`
                        ${level_stats(player,true)}
                    `)
                }

            }if(enemies.length > 0){
                player_touch_enemy(player)
                for(let index of range(enemies.length)){
                   if(scared == false){
                        if(ghost_chaser == 'chaser'){
                            if(index == 0){
                                enemies[index].chase_player([player.x,player.y])   //red
                            }else if(index == 1){
                                enemies[index].chase_player([player.x,player.y],player.direction)   //pink
                            }else if(index == 2){
                                enemies[index].chase_player([player.x,player.y],[enemies[0].x,enemies[0].y])  //blue
                            }else if(index == 3){
                                enemies[index].chase_player([player.x,player.y],enemies_default_position[3])  //orange
                            }
                        }else if(ghost_chaser == 'scatter'){  
                            if(index == 0){
                                enemies[index].scatter_enemy(enemies_default_position[0],0)   //red
                            }else if(index == 1){
                                enemies[index].scatter_enemy(enemies_default_position[1],1)   //pink
                            }else if(index == 2){
                                enemies[index].scatter_enemy(enemies_default_position[2],2)  //blue
                            }else if(index == 3){
                                enemies[index].scatter_enemy(enemies_default_position[3],3)  //orange
                            }
                        }
                   }else{
                        if(index == 0){
                            enemies[index].scatter_enemy(enemies_default_position[0],0)   //red
                        }else if(index == 1){
                            enemies[index].scatter_enemy(enemies_default_position[1],1)   //pink
                        }else if(index == 2){
                            enemies[index].scatter_enemy(enemies_default_position[2],2)  //blue
                        }else if(index == 3){
                            enemies[index].scatter_enemy(enemies_default_position[3],3)  //orange
                        }
                   }
                   
                   enemies[index].x +=enemies[index].velocity_x;
                   enemies[index].y +=enemies[index].velocity_y;        
                   enemies[index].detect_boundaries(); 
                   enemies[index].draw_enemy();

                }
            }
        },60)

        var game_event_loop = setInterval(function(){  //assets loader cycle and verifications
            if(player != null){
                if(player_asset_holder == 'eat') //player eat animation
                    player_asset_holder = 'move'
                else
                    player_asset_holder = 'eat'

                if(player.lives <= 0){ //player death 
                    clear_level()
                    load_level_display('game-over')
                    $('.side-stats').remove()
                    clearInterval(game_event_loop)
                } 
            }
        },player_eat_timer)


        setInterval(function(){  // client - server cycle
            enemy_shift_chaser();
            if(player != null){
                socket.emit('keepConnection',{
                    sock_id: player.id
                })
            }
        },1000)



    })




