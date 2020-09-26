
    
   class Entity{
        constructor(x,y,dimensions=entity_dimensions,velocity=entity_speed,starting_direction='up'){
            this.x = x;
            this.y = y;
            this.width = dimensions[0];
            this.height = dimensions[1];
            this.velocity = entity_speed;
            this.velocity_x = 0;
            this.velocity_y = 0;
            this.screen_end_x = container_dimenions[0]
            this.screen_end_y = container_dimenions[1]
            this.direction = starting_direction;
            this.unallowed_direction = ''
        }

        detect_boundaries(){  //Limit the entity to the grid layout(STOP RIGHT THERE!)
            if(this.x + this.width >= this.screen_end_x){
                this.x = 5;
            }else if(this.x<=0){
                this.x = this.screen_end_x - this.width - 5;
            }
            this.paste_to_grid();
            if( !this.ray_trace_forward() ){
                this.stop_moving()
            }
        }

        change_direction(direction){
            let directions = this.ray_trace()  //check all sides,if that side requested to go is taken, ignore
            if( arr_unIncluded(directions,direction) ){
                if(direction == 'up'){
                    this.velocity_y = -this.velocity;
                    this.velocity_x = 0;
                }else if(direction == 'down'){
                    this.velocity_y = this.velocity;
                    this.velocity_x = 0;
                   
                }else if(direction == 'left'){
                    this.velocity_x = -this.velocity;
                    this.velocity_y = 0;
                 
                }else if(direction == 'right'){
                    this.velocity_x = this.velocity;
                    this.velocity_y = 0;
                }
                this.direction = direction;
                if(player_asset_holder == 'eat'){ 
                    set_asset('player-container',player_eat_assets,this.direction)
                }else{
                    set_asset('player-container',player_assets,this.direction)
                }
            }
            
        }

        stop_moving(){
            this.velocity_x = 0;
            this.velocity_y = 0;
        }

        paste_to_grid(){
            if(this.direction != null){
                if(this.direction == 'right' || this.direction == 'left'){
                    this.y = get_closest(this.y,this.y+this.height,this.height)
                }else if(this.direction =='up'  || this.direction == 'down'){
                    this.x = get_closest(this.x,this.x+this.width,this.width)
                }
            }
        }

        ray_trace(){
           let directions = new Array()
           let mid_point = get_mid_points([this.x,this.y],this.width)
           for(let wall_pos of walls_position){
              let mid_point_top = mid_point[0]
              let mid_point_right = mid_point[1] 
              let mid_point_down = mid_point[2]
              let mid_point_left = mid_point[3]
              if( mid_point_top[0]>wall_pos[0] && mid_point_top[0]<wall_pos[0]+this.width && mid_point_top[1]>wall_pos[1] && mid_point_top[1]<wall_pos[1]+this.height){
                directions.push('up');
              }if( mid_point_right[0]>wall_pos[0] && mid_point_right[0]<wall_pos[0]+this.width && mid_point_right[1]>wall_pos[1] && mid_point_right[1]<wall_pos[1]+this.height ){
                  directions.push('right');
              }if( mid_point_down[0]>wall_pos[0] && mid_point_down[0]<wall_pos[0]+this.width && mid_point_down[1]>wall_pos[1] && mid_point_down[1]<wall_pos[1]+this.height ){
                directions.push('down');
              }if( mid_point_left[0]>wall_pos[0] && mid_point_left[0]<wall_pos[0]+this.width && mid_point_left[1]>wall_pos[1] && mid_point_left[1]<wall_pos[1]+this.height ){
                directions.push('left');
              }
           }
           return directions
        }

        ray_trace_forward(){ //Check if forward there is something, if there is: STOP!
            let all_directions = ['up','right','down','left']
            let last_direction = this.direction
            if(last_direction == null){
                return true
            }
            let point_index = all_directions.indexOf(last_direction)
            let mid_point_ = get_mid_points([this.x,this.y],this.width)
            mid_point_ = mid_point_[point_index]


            for(let wall_pos of walls_position){
                if( mid_point_[0]>wall_pos[0] && mid_point_[0]<wall_pos[0]+this.width && mid_point_[1]>wall_pos[1] && mid_point_[1]<wall_pos[1]+this.height ){
                    return false
                }
            }
            return true
        }

       

   } //END class ENTITY


    class Player extends Entity{
        constructor(x,y,id,starting_direction='left'){
            super(x,y,entity_dimensions,entity_speed,starting_direction);
            this.id = id;
            this.lives = 4;
            this.entity_type = 'player'
            this.score = 0;
            this.assets = player_assets
            this.direction = 'right'
            this.lives = 4;
            this.pills_eaten = 0; 
            this.pills_eaten_s = 0;
            this.pills_eaten_b = 0;
            this.total_pills_eaten_s = 0;
            this.total_pills_eaten_b = 0;
            this.enemies_eaten = 0;
            this.total_enemies_eaten = 0;

        }

        kill_player(){
            this.x = player_default_position[0];
            this.y = player_default_position[1];
            this.lives--;
        }

        eat_pill_detector(){
            let player_pos = [this.x,this.y]
            player_pos = [...player_pos]
            let pill_range = this.width; // <-- change this to set pill_range
            let player_pos_point = get_mid_points(player_pos,this.width,'this')
            let pl_x = player_pos_point[0]
            let pl_y = player_pos_point[1]
        
            for(let pill of pills_position){
                let pill_x = pill[0]
                let pill_y = pill[1]
                let pill_class = pill[2]
                let pill_no = pill[3]
                if( pl_x > pill_x && pl_x < pill_x + pill_range  ){ //inside x co-ordinate
                    if( pl_y > pill_y && pl_y < pill_y + pill_range){ //inside y co-ordinate
                        this.draw_score_board(pill_class)
                        this.pills_eaten++;
                        if(pill_class == 'pill-b'){
                            start_scared_timer(this)
                            this.pills_eaten_b++;
                            this.total_pills_eaten_b++;
                        } 
                        else{
                            this.pills_eaten_s++;
                            this.total_pills_eaten_s++;
                        }
                        delete_pill(pill_class,pill_no,[pill_x,pill_y])
                    }
                }
            }

        }

        draw_player(type='box',src=''){  //type(box) == rect | type(img) == img:src
            if(type == 'box'){
                $('.player-container').css({
                    left: this.x,
                    top: this.y,
                    width: this.width,
                    height: this.height
                })
            }
            if(player_asset_holder == 'eat'){ 
                set_asset('player-container',player_eat_assets,this.direction)
            }else{
                set_asset('player-container',player_assets,this.direction)
            }
        }

        draw_score_board(pill_class){
            if(pill_class == 'pill-s'){
                this.score += 10
            }else if(pill_class = 'pill-b'){
                this.score += 50
            }
        }


        access_movement_event(event,device='pc'){
            if(device == 'pc'){
                if(event.type == 'keydown'){
                    let keyCode = event.which;  //w s a d   -y +y   -x +x   87  83   65  68
                    if(keyCode == 87){
                        this.change_direction('up')
                    }else if(keyCode == 83){
                        this.change_direction('down')
                    }
                    else if(keyCode == 65){
                        this.change_direction('left')
                    }else if(keyCode == 68){
                        this.change_direction('right')
                    }
                    else if(keyCode == 32){
                        this.stop_moving();
                        this.direction = null;
                    }
                }
            }else{
                this.change_direction(event)
            }
           
        }

        



    }  //END class PLAYER

    
