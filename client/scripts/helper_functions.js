



    function test_target(position,target_no){
        $(`.target-${target_no}`).css({
            left: `${position[0]}px`,
            top: `${position[1]}px`
        })
    }

    function set_asset(container_class,asset_holder,asset_name){
        $(`.${container_class}`).css(
            'background-image',`url(${asset_holder[asset_name]})`
        )
    }

    function find_inverse(pos1,pos2){ //take pos1 = player_pos, pos2 = red_pos
        let p1 = new Array()
        if(pos1[0] <= pos2[0]){
           p1[0] = pos2[0] + (pos2[0] - pos1[0])
        }else{
            p1[0] = pos1[0] + (pos1[0] - pos2[0])
        }
        if(pos1[1] <= pos2[1]){
            p1[1] = pos2[1] + (pos2[1] - pos1[1])
        }else{
            p1[1] = pos1[1] + (pos1[1] - pos2[1])
        }
        p1 = [ Math.round(p1[0]/2), Math.round(p1[1]/2)]
        return p1
    }


    function remove_animation_sprite_on_condition(player_animate_x,sprite_x,animation_sprite_class,type='run'){ //function to remove a animation  when x pos is 
        if(type== 'run'){
            if(player_animate_x <= sprite_x){
                $(`.${animation_sprite_class}`).css('opacity','0')
                return true
            } return false
                
        }else{
            if(player_animate_x >= sprite_x){
                $(`.${animation_sprite_class}`).css('opacity','0')
                return true
            } return false
        }

        
        
            
    }


    function start_scared_timer(player_object){  //player has eaten pill, start scared mode
        if(scared_timer != null){
            clearInterval(scared_timer)
        }
        scared = true
        player_object.velocity = player_boost_speed
        for(enemy of enemies){
            enemy.velocity = enemy_scared_speed
            enemy.assets = enemy_scared_assets
        }
        let timer = 20 - level
        if(timer < 0) timer = 0
        scared_timer = setTimeout(function(){
            player_object.velocity = player_original_speed
            scared = false
            for(enemy of enemies){
                enemy.assets = enemy_assets
                enemy.velocity = enemy_original_speed
            }
            scared_timer = null
            player_eat_ghost_timer = null
            player_eat_score = 200
        },scared_timer_count)
    }
    

    function enemy_shift_chaser(){ //change scatter -> chase modes and so on (difficulty~level)
        var chances = level+1;  
        chances*=2
        if(level <= 3){
            chances = 8
        }
        if(random_state_generator(chances))
            ghost_chaser = 'scatter'
        else
            ghost_chaser = 'chaser'
    }


    function player_touch_enemy(player_object){  //triggered when [ player_position == forEach(enemies.position) ] && [ scared == true ]
        player_pos = [player_object.x,player_object.y]
        player_pos = [...player_pos]
        player_pos = get_mid_points(player_pos,entity_dimensions[0],'this')
        for(let index of range(enemies.length)){
            if(player_pos[0] > enemies[index].x && player_pos[0] < enemies[index].x + entity_dimensions[0]){
                if(player_pos[1] > enemies[index].y && player_pos[1] < enemies[index].y + entity_dimensions[1]){
                    if(scared == false){ //player dies
                        player_object.kill_player()
                    }else{  //enemy dies
                        enemies[index].kill_enemy(index)
                        player_object.enemies_eaten++;
                        player_object.total_enemies_eaten++;
                        player_object.score += player_eat_score
                        player_eat_score = player_eat_score*2
                        if(player_eat_score >= 2000){
                            player_eat_score = 1600
                        }
                    }
                }
            }
        }
    }

    function player_eat(player_object){
        let direction = player_object.direction
        set_asset('player-container',player_eat_assets,direction)
        setTimeout(function(){ 
            set_asset('player-container',player_assets,direction)
        },player_eat_timer)
    }

    function load_lives(player_object){
        lives = player_object.lives;
        let lives_imgs = `<div class='lives-container'>`
        for(let ctr of range(lives)){
            lives_imgs += `<div class='lives-img lives-img-${ctr}'></div>`
        }
        lives_imgs += '</div>'
        return lives_imgs
    }

    function load_lives_bar(player_object){ //for mobile only
        lives = player_object.lives;
        let lives_imgs = ``
        for(let ctr of range(lives)){
            lives_imgs += `<div class='lives-img lives-img-${ctr}'></div>`
        }
        return lives_imgs
    } 

    function level_stats(player_object,asynch=false){
        if(player_object.lives <= 0)
            player_object.lives = 0;
        let level_stats_text = `
            Score                 <em>${player_object.score}</em><br><br>
            Lives                 <em>${load_lives(player)}</em><br>
            Coins collected       <em>x${player_object.pills_eaten_s}</em><br>
            Enemies Eaten         <em>x${player_object.enemies_eaten}</em><br><br><br>
        `
        if(asynch == true){
            level_stats_text += `
                Coins left <em>x${total_pills - player_object.pills_eaten_s}</em><br>
            `
        }
        return  level_stats_text
    }

    function get_total_stats(player_object,device_type){
        let total_stats_text = `
            <br><br>
            Levels Cleared        <em>${level}</em><br><br>
            Coins collected       <em>${player_object.total_pills_eaten_s}</em><br>
            Enemies Eaten         <em>${player_object.total_enemies_eaten}</em><br><br><br>
            Key Validator         <em>${encode(player_object.score)}</em><br>
            <br><br>
        `
        if(device_type == 'phone'){
            total_stats_text = `
                                    <br><br>
                                    Levels Cleared        <em>${level}</em><br><br>
                                    Coins collected       <em>${player_object.total_pills_eaten_s}</em><br><br>
                                    Enemies Eaten         <em>${player_object.total_enemies_eaten}</em><br><br>
                                    Key Validator         <br><em>${encode(player_object.score)}</em><br>
                                    <br>
                                `
        }
        let save_form = `
            <div class='save-player-container'>
                <input type='text' placeholder='enter name...' class='w3-input input-class'/>
                <button id='save-player-button' class='w3-btn w3-blue'>Save</button>
            </div>
        `
        total_stats_text += save_form
        if(player_object.score == 0){
            total_stats_text = 'You lose'
        }
        return total_stats_text
    }







