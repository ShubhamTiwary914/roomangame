
    
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
        else{
            set_pc_display()
        }
    })



    function set_mobile_settings(){ //variables,controllers
        entity_dimensions = [20,20]
        container_dimenions = [320,480]


        player_default_position = [170,300]
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
        $('.control-buttons-container').append(`<button id='up' class='w3-btn w3-small'>&#8593</button>`)
        $('.control-buttons-container').append(`<button id='left' class='w3-btn w3-small'>&#8592</button>`)
        $('.control-buttons-container').append(`<button id='down' class='w3-btn w3-small'>&#8595</button>`)
        $('.control-buttons-container').append(`<button id='right' class='w3-btn w3-small'>&#8594</button>`)
    }



    function set_pc_display(){
        let player_animate_assets_left = ['components/assets/player/Roo_0005_roo_0001_side1.png','components/assets/player/Roo_0006_roo_0000_side2.png']
        let player_animate_assets_right = ['components/assets/player/Roo_0003_roo_0001_side1-copy.png','components/assets/player/Roo_0004_roo_0000_side2-copy.png']
        let enemy_animate_assets_left = ['components/assets/enemy/_0006_enemy-right-02.png','components/assets/enemy/enemy_0007_enemy-right-01.png']
        let enemy_animate_assets_right = ['components/assets/enemy/enemy_scared_right.png','components/assets/enemy/enemy_scared_right2.png']
        let counter = 0;
        let direction = 'left'
        setTimeout(function(){
            setInterval(function(){
                if(counter > 1)  counter = 0
                if(direction == 'left'){
                    $(`.player-left-animate`).css({
                        'background-image': `url('${player_animate_assets_left[counter]}')`
                   })
                   $('.enemy-left-animate').css({
                        'background-image': `url('${enemy_animate_assets_left[0]}')`
                   })
                }else{
                    $(`.player-left-animate`).css({
                        'background-image': `url('${player_animate_assets_right[counter]}')`
                    })
                    $('.enemy-left-animate').css({
                        'background-image': `url('${enemy_animate_assets_right[counter]}')`
                    })
                }
                
                counter++;
            },200)
            
            $(`.player-left-animate`).animate({    //move player and enemy to left
                left:'-=300px'
            },4000)
            $(`.enemy-left-animate`).animate({    //move player and enemy to left
                left:'-=200px'
            },4000)

            let timer = 2000     //delete pills 
            for(let ctr of range(1,6)){
                setTimeout(function(){
                    $(`.pill-${ctr}-home`).remove()
                },timer)
                timer+=300
            }
            setTimeout(function(){
                direction = 'right'
            },3500)
            
            $(`.player-left-animate`).animate({  //move player and enemy to right
                left:'+=700px'
            },8000)
            $(`.enemy-left-animate`).animate({  //move player and enemy to right
                left:'+=300px'
            },7000)

            setTimeout(function(){
                $(`.enemy-left-animate`).remove()
                $(`.player-left-animate`).css({
                    'width': '40px',
                    'height':'40px',
                })
            },8000)

            setTimeout(function(){
                $(`.player-left-animate`).remove()
            },9700)

        },500)
        
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











