
    //socket data
    const socket = io();

    //device metadata
    let device_type = 'pc'
    let map_type = 'mobile'
    let win = false


    // static entity data for global use
    let entity_dimensions = [25,25];
    var entity_speed = 5;

    var level = 0;  //level / modes stats
    var ghost_chaser = 'scatter'
    var scared = false;


    var player = null;     //player stats
    var player_spawn = new Array()
    var player_spawn_count = 0;
    const player_original_speed = 5;
    const player_boost_speed = 7;   

    var player_eat_score = 200;
    

    let enemies = new Array(); //enemy stats
    var enemies_spawn = new Array();
    var enemies_spawn_count = 0;
    const enemy_original_speed = 5  
    const enemy_scared_speed = 2
    const orange_scared_range = 7


    var scared_timer = null   //timer stats 
    const scared_timer_count = 7000
    const player_eat_timer = 200
    var player_asset_holder = 'eat'

    
    let player_default_position = [450,560];  
    var enemies_default_position = [  //scatter pos
        [700,75],  //red
        [75,25],  //blue
        [725,550],  //pink
        [50,550] //orange
    ];

    var enemies_spawn_position = [
        [400,300],
        [480,300],
        [400,300],
        [400,300]
    ]
    

    const player_assets ={
        'up': '../components/assets/player/Roo_0000_roo_0004_back1.png',
        'down': '../components/assets/player/Roo_0001_roo_0003_front1.png',
        'right': '../components/assets/player/Roo_0003_roo_0001_side1-copy.png',
        'left': '../components/assets/player/Roo_0005_roo_0001_side1.png',
    }

    const player_eat_assets = {
        'up': '../components/assets/player/Roo_0007_roo_0005_back2.png',
        'down': '../components/assets/player/Roo_0002_roo_0002_front2.png',
        'left': '../components/assets/player/Roo_0006_roo_0000_side2.png',
        'right': '../components/assets/player/Roo_0004_roo_0000_side2-copy.png'
    }

    const enemy_assets = {
        'up': '../components/assets/enemy/_0000_enemyback-02.png',
        'down': '../components/assets/enemy/_0002_enemyfront-02.png',
        'left': '../components/assets/enemy/_0006_enemy-right-02.png',
        'right': '../components/assets/enemy/_0004_enemy-left-02.png'  
    }

    const enemy_scared_assets = {
        'up': '../components/assets/enemy/enemy_scared_back.png',
        'down': '../components/assets/enemy/enemy_scared_front.png',
        'left':  '../components/assets/enemy/enemy_scared_left.png',
        'right': '../components/assets/enemy/enemy_scared_right.png'
    }
    
    //environments data
    let gridbox_dimensions = [...entity_dimensions];
    let container_dimenions = [800,600]

    let walls = new Array()
    var created_walls = 0;
    let walls_position = new Array();

    var pills = new Array();
    var created_pills = 0;
    var pills_position = new Array()
    var total_pills = 100;

    let empty_spaces = new Array()
    var empty_spaces_count = 0;

    let objects_classList = {
        '1LU': 'wall-VLU',
        '1LD':'wall-VLD',
        '1LO': 'wall-VLO',
        '1RU': 'wall-VRU',
        '1RD':'wall-VRD',
        '1RO':'wall-VRO',
        
        'U': 'wall-HUO',
        'UR': 'wall-HUR',
        'UL': 'wall-HUL',
        '_':'wall-HDO',
        '_R':'wall-HDR',
        '_L': 'wall-HDL',

        'X': 'none',
        '': 'pill-s',
        'O': 'pill-b',
        'E': 'enemy-spawn',
        'P': 'player-spawn',

        'TLO': 'wall-TLO',
        'TLC':'wall-TLC',
        'TRO': 'wall-TRO',
        'TRC': 'wall-TRC',
        'DLC': 'wall-DLC',
        'DLO': 'wall-DLO',
        'DRC': 'wall-DRC',
        'DRO': 'wall-DRO',

        'JU': 'wall-JU',
        'JD': 'wall-JD',
        'JL': 'wall-JL',
        'JR': 'wall-JR'
    }


    //database manager variables(store players list)
    var players_list = null
    var top_players_score = null
    var top_players_level = null
    var players_range_start = 1
    var players_range_end = 10
    var top_sort_by = 'score'


    //style handlersdata
    var gameMode = 'main';


    //Extra External Functions
    function* range(start,end=null,step=1){
        if(end==null){
            end = start;
            start = 0;
        }
        for(let i=start;i< end;i+=step){
            yield i;
        }      
    }

    //find last index in array
    function find_lastIndex(arr){
        for(let i of range(arr.length)){
            if(i == arr.length -1){
               return arr[i];
            }
        }
    }    


    function rotate_array(array_2d){
        let num_rows = array_2d.length; //2
        let num_cols = array_2d[0].length; //5
        let rotated_array = new Array();
        for(let i of range(num_cols)){
            let rows_holder = new Array();
            for(let j of range(num_rows)){
                rows_holder.push('-')
            }
            rotated_array.push(rows_holder)
        }

        for(let k of range(array_2d.length)){
            for(let l of range(array_2d[k].length)){
                rotated_array[l][k] = array_2d[k][l]
            }
        }


        return rotated_array;
    }


    function environment_objects_to_array(array){
        let filtered_result = new Array();
        let key_list = Object.keys(array[0]);
        for(let i=0;i<array.length;i++){
            let array_part = new Array()
            for(let j=0;j<key_list.length;j++){
                array_part.push(array[i][key_list[j]])
            }
            filtered_result.push(array_part)
        }
        return filtered_result;
    }

    function generate_wall_position(){
        let walls_positions = new Array();
        for(let i=0; i<=container_dimenions[0] ; i+=entity_dimensions[0] ){
            let row_walls_positions = new Array();
            for(let j=0; j<=container_dimenions[1]; j+=entity_dimensions[1] ){
                row_walls_positions.push([i,j])
            }
            walls_positions.push(row_walls_positions)
        }

        return rotate_array(walls_positions);

    }
    

