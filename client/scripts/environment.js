
    class Wall{    //for solid and empty grid components
        constructor(position,object_className,storage_variable){       //vertical //horizontal //none //curve(top_left,top_right,down_left,down_right)
            this.position = position;   //[x,y]
            this.img_src = null;
            this.storage_variable = storage_variable;
            this.wall_mainclassName = 'object-container'
            this.wall_className = object_className;
            this.containerClass_withno = `${this.wall_className}${this.storage_variable+1}`
            this.create(this.wall_className)
        }


        create(containerClass){
            let wall_object = $(`<div class='${this.wall_mainclassName} ${this.containerClass_withno} ${this.wall_className}'></div>`)
            $('#container').append(wall_object);
            $(`.${this.containerClass_withno}`).css({
                left: `${this.position[0]}px`,
                top: `${this.position[1]}px`
            })
        }

        


    }


    class Environment{  //Grid
        constructor(display){
            this.display_class = display;
            this.environment_array = null;
            this.width = gridbox_dimensions[0]
            this.height = gridbox_dimensions[1]
            this.object_classNames = null;
            this.walls_position = generate_wall_position();
        }

        request_environment(socket,env_name){
            socket.emit('sendEnv',{
                environment: env_name
            })
        }

        draw_gameplay_environment(){
            if(this.environment_array != null){
                this.object_classNames = environment_objects_to_array(this.environment_array)
                for(let i of range(this.walls_position.length)){
                    for(let j of range(this.walls_position[i].length)){
                        let wall_container_class = objects_classList[this.environment_array[i][j]]
                        if(typeof(wall_container_class) !== 'undefined'){
                            let class_type = wall_container_class.slice(0,4)
                            if(class_type == 'wall'){
                                walls.push( new Wall(this.walls_position[i][j],wall_container_class,created_walls) );
                                created_walls++;
                                walls_position.push([parseInt(find_lastIndex(walls).position[0]),parseInt(find_lastIndex(walls).position[1])])
                            }else if(class_type == 'pill'){
                                pills.push( new Wall(this.walls_position[i][j],wall_container_class,created_pills) );
                                pills_position.push([parseInt(find_lastIndex(pills).position[0]),parseInt(find_lastIndex(pills).position[1]),wall_container_class,created_pills])
                                created_pills++;
                            }else if(class_type == 'enem'){
                                enemies_spawn.push( new Wall(this.walls_position[i][j],wall_container_class,enemies_spawn_count) );
                                enemies_spawn_count++;
                            }else if(class_type == 'play'){
                                player_spawn.push( new Wall(this.walls_position[i][j],wall_container_class,player_spawn_count) );
                                player_spawn_count++;
                            }else if(class_type == 'none'){
                                empty_spaces.push( new Wall(this.walls_position[i][j],wall_container_class,empty_spaces_count) );
                                empty_spaces_count++;
                            }
                        
                        }
                          
                    }
                    $('#container').push('<br>')
                }
            }
            
        }

        draw_help_environment(){

        }

        draw_scores_environment(){

        }

    }


var gameplay_grid = null

function create_new_gameplay_environment(){
    if(gameplay_grid != null){
        delete gameplay_grid
    }
    gameplay_grid = new Environment('#container')
}


