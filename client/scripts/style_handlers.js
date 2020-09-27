
    
    $(document).ready(function(){

        //Specify stylesheet for device
        function css_setter(width){  
            if(width  > 500){
                $('#window_css').attr('href','css/desktop.css')
                device_type = 'pc'
            }
            else {
                $('#window_css').attr('href','css/mobile.css')
                device_type = 'phone'
            }
            return width;
        }
        const device_width = css_setter($(window).width());

        if(device_type == 'phone'){
            set_mobile_display()
            set_mobile_settings()
        }
        home_animation()
    })



    function set_mobile_settings(){ //variables,controllers
        entity_dimensions = [20,20]
        container_dimenions = [320,480]
        entity_speed = 4
        player_original_speed = 4
        player_boost_speed = 6

        enemy_original_speed = 4
        orange_scared_range = 5


        player_default_position = [170,420]
        enemies_default_position = [
            [300,20],  //red
            [50,50],  //blue
            [300,470],  //pink
            [20,470] //orange
        ]
        enemies_spawn_position = [
            [140,200],
            [145,230],
            [150,200],
            [155,230]
        ]
    }

    function set_mobile_display(){ //menu, game_evnironements
        //home animations
        $('.button-grid button').after('<br>')
        $('.home-animations-container').empty()

        //game


        //end, options
    }

    function get_mobile_controls(container_Id){
        $(`#${container_Id}`).append('<div class="control-buttons-container"></div>')
        $('#container').append(`<div class='lives-bar'>${load_lives_bar(player)}</div>`)
        $('.control-buttons-container').append(`<button id='up' class='w3-btn w3-small'>&#8593</button>`)
        $('.control-buttons-container').append(`<button id='left' class='w3-btn w3-small'>&#8592</button>`)
        $('.control-buttons-container').append(`<button id='down' class='w3-btn w3-small'>&#8595</button>`)
        $('.control-buttons-container').append(`<button id='right' class='w3-btn w3-small'>&#8594</button>`)
    }



    function home_animation(){
        let player_animate_assets_left = ['components/assets/player/Roo_0005_roo_0001_side1.png','components/assets/player/Roo_0006_roo_0000_side2.png']
        let player_animate_assets_right = ['components/assets/player/Roo_0003_roo_0001_side1-copy.png','components/assets/player/Roo_0004_roo_0000_side2-copy.png']
        let enemy_animate_assets_left = ['components/assets/enemy/_0006_enemy-right-02.png','components/assets/enemy/_0007_enemy-right-01.png']
        let enemy_animate_assets_right = ['components/assets/enemy/enemy_scared_right.png','components/assets/enemy/enemy_scared_right2.png']
        let direction = 'left'
        let player_animate_assets = player_animate_assets_left[0]
        let enemy_animate_assets = enemy_animate_assets_left[0]
        let entity_sprite_animate_index = 0
        
    
        setTimeout(function(){
            for(let index of range(1,6)){
                if(index == 1){
                    $('.home-animations-container').append(`<div class='pill-b pill-${index}-home'></div>`)
                }else{
                    $('.home-animations-container').append(`<div class='pill-s pill-${index}-home animated-pills'></div>`)
                }
            }
            $('.home-animations-container').append(`<div class='player-left-animate'></div>`)
            $('.home-animations-container').append(`<div class='enemy-left-animate'></div>`)
            home_animation_timer = setInterval(() => {
                
                if(direction == 'left'){  //change velocity
                    player_anime_loc[0] = player_anime_loc[0] - player_anime_speed
                    enemy_anime_loc[0] = enemy_anime_loc[0] - enemy_anime_speed
                }
                else if(direction =='right'){
                    player_anime_loc[0] = player_anime_loc[0] + player_anime_speed
                    enemy_anime_loc[0] = enemy_anime_loc[0] + enemy_anime_speed
                }
                else{

                }
                    $('.player-left-animate').css({
                        'left': `${player_anime_loc[0]}px`, //change and control animation attribute
                        'background-image': `url('${player_animate_assets}')`
                    })
                    $('.enemy-left-animate').css({
                        'left': `${enemy_anime_loc[0]}px`,
                        'background-image': `url('${enemy_animate_assets}')`
                    })

                if($('#container .home-animations-container').length > 0){
                    if($('.player-left-animate').css('left').slice(0,2) <= -1){   //change direction when a specific x is met
                        direction = null
                        setTimeout(function(){
                            direction = 'right'
                            enemy_anime_speed = 3
                        },700)
                    }
                }
                
               
                for(let index of range(pills_anime.length)){
                    pill_anime = pills_anime[index]
                   remove_animation_sprite_on_condition(player_anime_loc[0],pill_anime[0],pill_anime[2],'run')
                }
                if(remove_animation_sprite_on_condition(player_anime_loc[0],enemy_anime_loc[0]-10,'enemy-left-animate','chase')){
                    $('.player-left-animate').css({
                        width: `${entity_dimensions[0]*2}px`,
                        height: `${entity_dimensions[1]*2}px`
                    })
                }
                remove_animation_sprite_on_condition(player_anime_loc[0],container_dimenions[0],'player-animate-left','chase')
               
                
            },60);

            home_animation_eat_timer = setInterval(function(){
                if(entity_sprite_animate_index > 1) 
                    entity_sprite_animate_index = 0
                
                if(direction == 'left'){
                    player_animate_assets = player_animate_assets_left[entity_sprite_animate_index]
                    enemy_animate_assets = enemy_animate_assets_left[entity_sprite_animate_index]
                }else{
                    player_animate_assets = player_animate_assets_right[entity_sprite_animate_index]
                    enemy_animate_assets = enemy_animate_assets_right[entity_sprite_animate_index]
                }
                entity_sprite_animate_index++;
            },200)

        },3000)
        
        
    }



    function load_side_stats(){
        $('body').append(`
            <div class='side-stats'>
              <div class='side-stats-data'></div>
            </div>
            `)
    }



    function load_help(){
        $('#container').empty()
        $('#container').append(`<div class='help-screen-container w3-container'></div>`)
        let help_text = ''
        let controls_animate = new Array()
        if(device_type == 'pc'){
            controls_animate = ['w','s','a','d']
            help_text =  `
                            <div class='controls-animate'>w</div>
                            Use <span class='control-highlight-1 highlight-main-control'>w</span>
                                   ,<span class='control-highlight-2'>s</span>,
                                   <span class='control-highlight-3'>a</span>,
                                   <span class='control-highlight-4'>d</span> 
                                   keys to move around  <br><br> `
            
        }else{
            controls_animate = ['&#8593','&#8595','&#8592','&#8594']
            help_text = `
                            <div class='controls-animate'>&#8593</div>
                            Use <span class='control-highlight-1 highlight-main-control'>&#8593</span>
                                ,<span class='control-highlight-2'>&#8595</span>,
                                <span class='control-highlight-3'>&#8592</span>,
                                <span class='control-highlight-4'>&#8594</span> 
                                keys to move around  <br><br>
                        `
        }
        help_text += `
                Eat all the coins before the ghosts eat you! <br>
                <div class='pill-s pill-s-animate'></div>
                <div class='pill-s pill-s-animate'></div>
                <div class='pill-s pill-s-animate'></div>
                <br>How much gold can you escape with?
                <br><br><br>
                Save your score and see where you rank in the world!<br><br><br>
             `

        
        let control_counter = 0;
        

        setInterval(function(){
            if(control_counter > 3){
                control_counter = 0
                $(`.control-highlight-4`).css('color','white')
            }
            $('.controls-animate').html(controls_animate[control_counter])
            $(`.control-highlight-${control_counter}`).css('color','white')
            $(`.control-highlight-${control_counter+1}`).css('color','red')
            control_counter++
        },1000)
        
        help_text += `
                        <button class='go-back w3-btn w3-blue'>Back</button>
                    `
        
        $('.help-screen-container').html(help_text)
    }


    function load_exit(){
        if(!win || win.closed){
            win = window.open('','_self')
        }else{
            win.close()
        }
    }











