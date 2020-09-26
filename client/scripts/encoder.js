


    var small_letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    var big_letters = small_letters.map(letter => letter.toUpperCase())
    var numbers = ['0','1','2','3','4','5','6','7','8','9']


    function* range(start,end=null,step=1){
        if(end==null){
            end = start;
            start = 0;
        }
        for(let i=start;i< end;i+=step){
            yield i;
        }      
    }


    function get_zeroes_end(string_){
        zeroes_count = 0;
        for(let ctr of range(string_.length)){
            if(string_.charAt(string_.length - 1) == '0'){
                string_ = string_.substring(0,string_.length-1)
                zeroes_count++;
            }else{
                break
            }
            
        }
        return zeroes_count
    }
    

    function create_algo_keys(){
        algo_keys = {}
        let letters_values = new Array()
        for(let i of range(26)){
            letters_values.push(i)
        }
        for(let index of range(letters_values.length)){
            algo_keys[small_letters[index]] = letters_values[index] + 1
        } letters_values.reverse()
        for(let index of range(letters_values.length)){
            algo_keys[big_letters[index]] = letters_values[index] + 1
        }
        return algo_keys
    }



    function array_cutter(arr){
        let splitted_array = new Array()
        for(let str_code of [...arr]){
            str_code = Number(str_code)
            if(str_code > 26){
                str_code = str_code.toString(10)
                splitted_array.push(str_code[0])
                splitted_array.push(str_code[1])
            }else{
                splitted_array.push(str_code.toString(10))
            }
        }
        for(let index of range(splitted_array.length)){
            if(index != splitted_array.length-1){
                this_index = splitted_array[index]
                next_index = splitted_array[index+1]
                if(Number(`${this_index}${next_index}`) < 27){
                    splitted_array[index] += next_index
                    splitted_array = splitted_array.filter((x,y) => y!= index+1 )
                }
            }
        }
        return splitted_array
    }



    function generate_key(score){
        //split keys
        score = score.toString(10)
        score_keys = new Array()
        split_string = ''
        for(let i of range(score.length)){
            split_string += score[i]
            if(i%2==0){
                score_keys.push(split_string)
                split_string = ''
            }
        }
        return score_keys

    }



    function convert_algorithm(algorithm_keys,split_values){
        let algorithm_list = Object.entries(algorithm_keys)
        let split_keys = new Array()
        for(let value of split_values){
            for(let algorithm of algorithm_list){
                if(algorithm[1] == Number(value)){
                    split_keys.push(algorithm[0])
                }
            }
        }
        split_keys = split_keys.map((key,index) => {
            if(index != split_keys.length -1)
                return [split_keys[index],split_keys[index+1]]
        }).filter((key,index) => index%2 == 0 )
        return split_keys
    }

    

    function encode(score){
        let algo_keys = create_algo_keys()
        let key = generate_key(score)
        let split_values = array_cutter(key)
        let converted = convert_algorithm(algo_keys,split_values)
        let chosen_index = null;
        let letter_style = null, letter_index = null;
        let key_indexes = new Array()
        let encoded_string = ''
        let num_zeroes = get_zeroes_end(score.toString(10))

        let encoded_array = new Array()
        for(let ctr of range( (converted.length*2)+Math.round(Math.random()*5) )){ //create a dummy array to fill in values
            encoded_array.push('-')
        }
        for(let keys of converted){ //Get all vales in encoder
            while(true){
                chosen_index = Math.round(Math.random()*encoded_array.length)
                if(encoded_array[chosen_index] == '-'){
                    encoded_array[chosen_index] = keys[Math.floor(Math.random()*Math.floor(1))]
                    key_indexes.push(chosen_index)
                    break
                }
            }
        }
        let code_counter = 0;
        let keys_counter = 0;
        while(true){
            if(encoded_array[code_counter] == '-'){
                encoded_array[code_counter] = key_indexes[keys_counter].toString(10)
                keys_counter++
            }
            code_counter++;
            if(code_counter >= encoded_array.length || keys_counter >=key_indexes.length)
                break
        }
        for(let code_index of range(encoded_array.length)){
            if(encoded_array[code_index] == '-'){
                letter_style = Math.floor(Math.random()*Math.floor(1))
                letter_index = Math.floor(Math.random()*Math.floor(26))
                if(letter_style == 0){
                    encoded_array[code_index] = small_letters[letter_index]
                }else{
                    encoded_array[code_index] = big_letters[letter_index]
                }
                
            }
        }
        for(let code of encoded_array){
            encoded_string+= code
        }
        
        if(!(num_zeroes == 0)){
            encoded_string += `&${num_zeroes}`
        }
        return encoded_string
    }

