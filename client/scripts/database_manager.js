



    socket.on('get_top_players',function(data){
        players_list = data.players
        top_players_level = [...players_list]
        top_players_score = [...players_list]
        top_players_level.sort((this_player,next_player) => next_player.level -this_player.level )
        top_players_score.sort((this_player,next_player) => next_player.score -this_player.score )
    })



    function filter_top_players(players_range_start,players_range_end,top_players,sortBy){
        if(!(players_range_start-1 > top_players.length -1)){
            if(players_range_end > top_players.length)
                players_range_end = top_players.length
            for(let index of range(players_range_start-1,players_range_end)){
                if(sortBy == 'score'){
                    if(index < 10){
                        let crowns = `
                                        <div class='crown-container'></div>
                                    `
                        if(index == 0){
                            $('.top-1').html(`Top 1. ${top_players[index].name}     ${top_players[index].score}`)
                        }else if(index == 1){
                            $('.top-2').html(`Top 2. ${top_players[index].name}   ${top_players[index].score}`)
                        }else if(index == 2){
                            $('.top-3').html(`Top 3. ${top_players[index].name}   ${top_players[index].score}`)
                        }else{
                            $('.top-players-container').append(`${index+1}. ${top_players[index].name}   ${top_players[index].score}`)
                        }
                    }
                    else{
                        $('.top-players-container').append(`${index+1}. ${top_players[index].name}   ${top_players[index].score}`)
                    }
                    $('.top-players-container').append('<br>')
                }

                else if(sortBy == 'level'){
                    if(index < 10){
                        if(index == 0){
                            $('.top-1').html(`${index+1}. ${top_players[index].name}   ${top_players[index].level}`)
                        }else if(index == 1){
                            $('.top-2').html(`${index+1}. ${top_players[index].name}   ${top_players[index].level}`)
                        }else if(index == 2){
                            $('.top-3').html(`${index+1}. ${top_players[index].name}   ${top_players[index].level}`)
                        }else{
                            $('.top-players-container').append(`${index+1}. ${top_players[index].name}   ${top_players[index].level}`)
                        }
                    }else{
                        $('.top-players-container').append(`${index+1}. ${top_players[index].name}   ${top_players[index].level}`)
                    }
                    $('.top-players-container').append('<br>')
                }
            }
        }
        else{
            $('.top-players-container').append(`<div class='top-none'>No more Players left!</div>`)
            $('.top-1').css({
                'margin-left': '-60px','margin-top':'200px'
            })
        }
        

    }


    function fetch_top_players(sortBy='score'){
        $('#container').empty()
        $('#container').append($(`<div class='top-players-container'></div>`))
        $('.top-players-container').append(`<div class='top-1'></div>`)
        $('.top-players-container').append(`<div class='top-2'></div>`)
        $('.top-players-container').append(`<div class='top-3'></div>`)
        $('.top-players-container').append(`<div class='top-rest'></div>`)
        $('#container').append(`<button class='top-players-next w3-btn w3-blue w3-color-white'>Next</button>`)
        $('#container').append(`<button class='go-back top-player-back w3-btn w3-blue'>Back</button>`)
        let top_players = null;
        if(sortBy =='score')
            top_players = top_players_score
        else if(sortBy == 'level')
            top_players = top_players_level
        filter_top_players(players_range_start,players_range_end,top_players=top_players,sortBy=sortBy)
    }


    function filter_player_data(name,score,level){
        let object = {
            name: name,
            score: score,
            level: level
        }
        array = top_players_score
        let sample_array = [...array]
        sample_array.push(object)
        sample_array.sort((this_player,next_player) => next_player.score -this_player.score )
        for(let ctr=0;ctr<sample_array.length;ctr++){
            if(sample_array[ctr].name == object.name  &&  sample_array[ctr].score == object.score  && sample_array[ctr].score == object.score ){
                return ctr
            }
        }
        return sample_array.length
    }


    





    









