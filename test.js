

var percent = 70
var number = 25

    
    function* range(start,end=null,step=1){
        if(end==null){
            end = start;
            start = 0;
        }
        for(let i=start;i< end;i+=step){
            yield i;
        }      
    }
    


    function get_mid_points(pos,to,type='sides'){
        let mid_points = new Array()  //top -> right ->  down  -> left
        pos[0] = Math.round(pos[0] + (to/2))
        pos[1] = Math.round(pos[1] + (to/2))
        mid_points.push([pos[0],pos[1]-to])
        mid_points.push([pos[0]-to,pos[1]])
        mid_points.push([pos[0],pos[1]+to])
        mid_points.push([pos[0]+to,pos[1]])
        if(type == 'this')
            return pos
        return mid_points
    }

    
let arr = [1,2,3,4,5]
let num = 3;


    function arr_unIncluded(arr,num){  // if that item does not exist, return true!
        if(!arr.includes(num))
            return true
        return false
    }

   

    function find_directions(){
        let total_directions = new Set(['up','right','down','left'])
        let unavailable_directions = new Set(['up','down'])
        let possible_directions = [...total_directions].filter(x => !unavailable_directions.has(x))
        return possible_directions
    }

    function array_filter_max(arr){
        arr = arr.filter(function(val){
            return val
        })
        return arr
    }

    function objects_maker(keys,values){
        let object = new Object()
        for(let index of range(values.length)){
            object[keys[index]] = values[index]
        }
        return object
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
            minimun_distances.push(distance[1])
        }
        minimun_distances = Math.min(...minimun_distances)
        for(distance of new_distances){
            if(distance[1] == minimun_distances)
                minimun_distances_array.push(distance)
        }
        console.log(minimun_distances_array)
        //after that, get priority of shortest distances
        for(let distance of minimun_distances_array){
            for(let priority_direction of priority){
                if(distance[0] == priority_direction && distance[0]){
                    return priority_direction;
                }
            }
        }
    }
        
    


    let directions_available = ['up','down','right','left']
    let enemy_pos = [10,10]
    let player_pos = [100,10]
    let dimension = 25;
    let last_direction = ''
    
    
    let steps = 0;
    let move_to = null;
    let best_direction = find_best_direction(directions_available,enemy_pos,player_pos,dimension,last_direction)
        console.log(best_direction)
        console.log(player_pos)
        console.log(enemy_pos)
    
    