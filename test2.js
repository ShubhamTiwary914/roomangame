


    function* range(start,end=null,step=1){
        if(end==null){
            end = start;
            start = 0;
        }
        for(let i=start;i< end;i+=step){
            yield i;
        }      
    }


    function random_state_generator(chances){
        var randomstates = new Array();
        for(let ctr of range(10)){
            randomstates.push( Math.round(Math.random()*chances) )
        }
        return randomstates
    }


    let chances = 15
    console.log((random_state_generator(chances)))
      



















