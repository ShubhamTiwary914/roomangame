

    function filter_objects_inside_array(array,item_key_name){
        function *enumerate(array){
            for(let i = 0;i < array.length; i++){
                yield [i,array[i]];
            }
        }

        for(enumerated of enumerate(array)){
            let index = enumerated[0]; let item = enumerated[1];
            new_item = {}
            for(key in item){
                if(key != `${item_key_name}`){
                    new_item[key] = item[key]
                }
            }
            array[index] = new_item;
        }
        return array;
    }


    module.exports = {
        'Filter_obj_arr': filter_objects_inside_array
    }