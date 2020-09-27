


    function* range(start,end=null,step=1){
        if(end==null){
            end = start;
            start = 0;
        }
        for(let i=start;i< end;i+=step){
            yield i;
        }      
    }

    function* inverted_range(start,end=null,step=1){
        let original_array = new Array()
        for(let ctr of range(start,end,step)){
            original_array.push(ctr)
        }
        original_array.reverse()
        for(let item of original_array){
            yield item
        }
    }


    for(let ctr of inverted_range(1,10)){
        console.log(ctr)
    }
    















