


    class Enemy extends Entity{

        constructor(args,container_class,enemy_no,direction_start='up'){
            super(args[0],args[1],entity_dimensions,entity_speed,direction_start);
            this.default_position = args;
            this.entity_type = 'enemy'
            this.container_class = container_class
            this.move_to = null;
            this.steps_moved = 0;
            this.target_position = null;
            this.scatter_position = enemies_default_position[enemy_no]
            this.assets = enemy_assets
        }



        move_enemy(direction){
            if(direction == 'up'){
                if(this.unallowed_direction != 'down'){
                    this.velocity_y = -this.velocity;
                    this.velocity_x = 0;
                    this.unallowed_direction = 'down'
                    this.direction = direction;
                }  
            }else if(direction == 'down'){
                if(this.unallowed_direction != 'up'){
                    this.velocity_y = this.velocity;
                    this.velocity_x = 0;
                    this.unallowed_direction = 'up'
                    this.direction = direction;
                }
            }else if(direction == 'left'){
                if(this.unallowed_direction != 'right'){
                    this.velocity_x = -this.velocity;
                    this.velocity_y = 0;
                    this.unallowed_direction = 'right'
                    this.direction = direction;
                }
             
            }else if(direction == 'right'){
                if(this.unallowed_direction != 'left'){
                    this.velocity_x = this.velocity;
                    this.velocity_y = 0;
                    this.unallowed_direction = 'left'
                    this.direction = direction;
                }
            }
            set_asset(this.container_class,this.assets,this.direction)
        }



        scatter_enemy(scatter_target,target_no){
            scatter_target = [...scatter_target]
            scatter_target = get_mid_points(scatter_target,this.width,'this')
            let directions_available = this.find_directions_available()

            let best_direction = find_best_direction(directions_available,[this.x,this.y],scatter_target,this.width,this.unallowed_direction)
            this.move_to_direction_setter(best_direction)
            this.move_enemy(this.move_to)
            
        }



        draw_enemy(type='box',src=''){
            if(type == 'box'){
                $(`.${this.container_class}`).css({
                    left: this.x,
                    top: this.y,
                    width: this.width,
                    height: this.height
                })
            }else{ //load player sprite

            }
        }

        find_directions_available(){
            let total_directions = new Set(['up','right','down','left'])
            let unavailable_directions = new Set(this.ray_trace())
            let possible_directions = [...total_directions].filter(x => !unavailable_directions.has(x))
            return possible_directions
        }

        change_target(target_position){
            if(this.target_position == null){
                this.target_position = target_position
            }
            else if(target_position != this.target_position){
                this.target_position = target_position
            }
        }

        move_to_direction_setter(direction){
            if(this.steps_moved >= 5){ //enemy should change direction
                this.steps_moved = 0;
                this.move_to = direction
            }else{  //enemy should move to already given direction
                this.steps_moved+=1
            }
        }


        kill_enemy(index){
            this.x = enemies_spawn_position[index][0]
            this.y = enemies_spawn_position[index][1]
        }   

        
    }  

   //  END CLASS ENEMY  //





    class Red extends Enemy{
        chase_player(player_pos){
            player_pos = [...player_pos]
            player_pos = get_mid_points(player_pos,this.width,'this')
            let directions_available = this.find_directions_available()

            let best_direction = find_best_direction(directions_available,[this.x,this.y],player_pos,this.width,this.unallowed_direction)
            this.move_to_direction_setter(best_direction)
            this.move_enemy(this.move_to)
            
        }
    }



    class Pink extends Enemy{
        chase_player(player_pos,player_direction){
            player_pos = [...player_pos]
            let target_pos = get_mid_points(player_pos,this.width,player_direction)
            let directions_available = this.find_directions_available()

            let best_direction = find_best_direction(directions_available,[this.x,this.y],target_pos,this.width,this.unallowed_direction)
            this.move_to_direction_setter(best_direction)
            this.move_enemy(this.move_to)
            
        }
    }


    class Blue extends Enemy{
        chase_player(player_pos,red_pos){
            player_pos = [...player_pos]
            red_pos = [...red_pos]
            let target_pos = find_inverse(player_pos,red_pos)
            let directions_available = this.find_directions_available()

            let best_direction = find_best_direction(directions_available,[this.x,this.y],target_pos,this.width,this.unallowed_direction)
            this.move_to_direction_setter(best_direction)
            this.move_enemy(this.move_to)
            
        }
    }


    class Orange extends Enemy{
        chase_player(player_pos,scatter_pos){
            player_pos = [...player_pos]
            scatter_pos = [...scatter_pos]
            let target_pos = player_pos
            if( this.x > (player_pos[0] - (this.width*orange_scared_range)) && this.x < (this.width*orange_scared_range) ){ //if in pacman's range, run AWAY!
                if( this.y > (player_pos[1] - (this.height*orange_scared_range)) && this.y < (this.height*orange_scared_range) ){ 
                    target_pos = get_mid_points(scatter_pos,this.width,'this')
                }
            }
            else{ //if pacman is not near, go CHARGEE!
                target_pos = get_mid_points(player_pos,this.width,'this')
            }
            let directions_available = this.find_directions_available()

            let best_direction = find_best_direction(directions_available,[this.x,this.y],target_pos,this.width,this.unallowed_direction)
            this.move_to_direction_setter(best_direction)
            this.move_enemy(this.move_to)
            
        }
    }




