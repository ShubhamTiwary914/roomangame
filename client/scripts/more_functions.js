

    
    function get_ratio(percent,number){
        return Math.round((percent/100) * number)
    }    



    function get_closest(num1,num2,to){ //if to=25; num1 = 501; num2 = 505; return num1: since 500%25==0  is closest to num1
        let closest_divisible = 0;
        let go_to_position = 0;

        for(let i of range(num1,num2+1)){
            if( i % to == 0)
                closest_divisible = i;
        }

        if(num1 % to == 0)
            return num1;
        if(num2 - closest_divisible < closest_divisible - num1){
            return closest_divisible - to
        }
        return closest_divisible

    }

    function get_mid_points(pos,to,type='sides'){
        let mid_points = new Array()  //top -> right ->  down  -> left
        pos[0] = Math.round(pos[0] + (to/2))
        pos[1] = Math.round(pos[1] + (to/2))
        mid_points.push([pos[0],pos[1]-to])
        mid_points.push([pos[0]+to,pos[1]])
        mid_points.push([pos[0],pos[1]+to])
        mid_points.push([pos[0]-to,pos[1]])
        if(type == 'this'){
            return pos
        }else if(['up','right','down','left'].includes(type)){
            let type_index = ['up','right','down','left'].indexOf(type)
            return mid_points[type_index]
        }
        return mid_points
    }

    function get_mid_points_priorityVersion(pos,to){
        let mid_points = new Array()  //top -> right ->  down  -> left
        pos[0] = Math.round(pos[0] + (to/2))
        pos[1] = Math.round(pos[1] + (to/2))
        mid_points.push([pos[0],pos[1]-to])
        mid_points.push([pos[0],pos[1]+to])
        mid_points.push([pos[0]+to,pos[1]])
        mid_points.push([pos[0]-to,pos[1]])
        return mid_points
    }


    function arr_unIncluded(arr,num){  // if that item does not exist, return true!
        if(!arr.includes(num))
            return true
        return false
    }


    function array_filter_max(arr){
        arr = arr.filter(function(val){
            return val
        })
        return arr
    }

    function objects_maker(keys,values){
        let object = new Object()
        values = array_filter_max(values)
        for(let index of range(values.length)){
            object[keys[index]] = values[index]
        }
        return object
    }

    
    function find_best_direction(directions_available,enemy_pos,to_pos,dimension,last_direction){
        //find shortest distances
        enemy_pos = [...enemy_pos]
        let mid_points = get_mid_points_priorityVersion(enemy_pos,dimension)
        let distances = mid_points.map(mid_point => ( Math.round( Math.sqrt( ((mid_point[0]-to_pos[0])**2) +(mid_point[1]-to_pos[1])**2) )))
        distances = objects_maker(directions_available,distances)

        //set all priorties all data from Object -> array for efficiency
        let priority = ['up','left','down','right']
        distances = Object.entries(distances)
        let minimun_distances = new Array()
        let minimun_distances_array = new Array()
        let new_distances = new Array()

        //calculate and filter the minimum in the array, also remove last direction
        for(distance of distances){
            if(distance[0] != last_direction)
                new_distances.push(distance)
        }
        for(let distance of new_distances){
            if(distance[0] != 'undefined')
                minimun_distances.push(distance[1])
        }
        minimun_distances = Math.min(...minimun_distances)
        for(distance of new_distances){
            if(distance[1] == minimun_distances)
                minimun_distances_array.push(distance)
        }
        
        //after that, get priority of shortest distances
        for(let distance of minimun_distances_array){
            for(let priority_direction of priority){
                if(distance[0] == priority_direction && distance[0]){
                    return priority_direction;
                }
            }
        }
    }
    
    function random_state_generator(chances){
        var randomstates = new Array();
        for(let ctr of range(10)){
            randomstates.push( Math.round(Math.random()*chances) )
        }
        return randomstates.includes(2)
    }


    //Environemt - player mod functions
    function delete_pill(containerClass,container_no){     
        container_no = container_no + 1
        let pill_object = [...pills.filter(pill => pill.containerClass_withno == `${containerClass}${container_no}`)]
        let pill_pos = pill_object[0].storage_variable
        pills_position = pills_position.filter(pos => pos[3] != pill_pos)
        $(`.${containerClass}${container_no}`).removeClass(`${containerClass}`)
        
    }


