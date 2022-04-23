class Team1 {
    constructor(name,owner) {
        this.name = name;
        this.owner = owner;
        this.players = [];
    }

    addPlayer(name, position, team, id){
        this.players.push(new Player1(name, position, team, id));
    }
}

class Player1 {
    constructor(name, position, team, id) {
        this.name = name;
        this.position = position;
        this.team = team;
        this.id = id;
    }
}

class RosterService1 {

    static url = "https://crudcrud.com/api/d62fb174a2164aed9989003ebfc3f162/omaha-teams";

    static getAllTeams() {
        return $.get(this.url);
    }

    static getTeam(id) {
        return $.get(this.url +`/${id}`);
    }

    static createTeam(team) {
        return $.ajax({
            url: this.url,
            dataType: 'json',
            data: JSON.stringify(team),
            contentType: 'application/json',
            type:'POST'
        });
    }

    static updateTeam(team) {
        const {_id, ...noIdTeam} = team;
        return $.ajax({
            url: this.url + `/${team._id}`,
            dataType: 'json',
            data: JSON.stringify(noIdTeam),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteTeam(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }

}

class DOMManager1 {
    static teams;

    static getAllTeams(){
        RosterService1.getAllTeams().then(teams => this.render(teams));
    }

    static createTeam(name,owner) {
        RosterService1.createTeam(new Team1(name,owner))
            .then(() => {
                return RosterService1.getAllTeams();
            })
            .then((teams) => this.render(teams));
    }

    static deleteTeam(id) {
        RosterService1.deleteTeam(id)
        .then(() => {
            return RosterService1.getAllTeams();
        })
        .then((teams) => this.render(teams));
    }

    static addPlayer(id) {
        for (let team of this.teams) {
            if (team._id == id) {
                function getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                }

                let playerId = getRandomInt(1000000000);
                console.log(playerId);
                team.players.push(new Player1($(`#${team._id}-player-name`).val(), $(`#${team._id}-player-position`).val(), $(`#${team._id}-player-team`).val(), playerId))
                
                RosterService1.updateTeam(team)
                .always(() => {             
                    DOMManager1.getAllTeams();
                })
            }
        }
    }

    static deletePlayer(teamId, playerId) {
        for (let team of this.teams) {
            if(team._id == teamId) {             
                for (let player of team.players) {                  
                    if (player.id == playerId) {
                        team.players.splice(team.players.indexOf(player), 1);
                        RosterService1.updateTeam(team)
                        .always(() => {
                            DOMManager1.getAllTeams();
                        })
                    }
                }
            }
        }
    }


    static render(teams) {
        this.teams = teams;
        $('#omaha').empty();
        for (let team of teams) {
            
            $('#omaha').append(
               `<div class='card'>
               <div id='header'>
               <h2>${team.name}</h2> 
               <h3>${team.owner}</h3>
               <button class="btn btn-danger form-control" onclick="DOMManager1.deleteTeam('${team._id}')">Delete Team</button>
                </div>
                <div id="${team._id}">
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                            <th scope='col'><input type="text" id="${team._id}-player-name" class="form-control" placeholder="Player Name"></th>
                            <th scope='col'><select id="${team._id}-player-position" class="form-select">
                                <option selected>Choose Position</option>
                                <option value="QB">QB</option>
                                <option value="RB">RB</option>
                                <option value="WR">WR</option>
                                <option value="TE">TE</option>
                                <option value="D/ST">D/ST</option>
                                <option value="K">K</option>
                                </select>
                            </th>
                            <th scope='col'><select id="${team._id}-player-team" class="form-select">
                                <option selected>Choose Team</option>
                                <option value="Ari">Arizona Cardinals</option>
                                <option value="Atl">Atlanta Falcons</option>
                                <option value="Bal">Baltimore Ravens</option>
                                <option value="Buf">Buffalo Bills</option>
                                <option value="Car">Carolina Panthers</option>
                                <option value="Chi">Chicago Bears</option>
                                <option value="Cin">Cincinnati Bengals</option>
                                <option value="Cle">Cleveland Browns</option>
                                <option value="Dal">Dallas Cowboys</option>
                                <option value="Den">Denver Broncos</option>
                                <option value="Det">Detroit Lions</option>
                                <option value="GB">Green Bay Packers</option>
                                <option value="Hou">Houston Texans</option>
                                <option value="Ind">Indianapolis Colts</option>
                                <option value="Jax">Jacksonville Jaguars</option>
                                <option value="KC">Kansas City Chiefs</option>
                                <option value="LV">Las Vegas Raiders</option>
                                <option value="LAC">Los Angeles Chargers</option>
                                <option value="LAR">Los Angeles Rams</option>
                                <option value="Mia">Miami Dolphins</option>
                                <option value="Min">Minnesota Vikings</option>
                                <option value="NE">New England Patriots</option>
                                <option value="NO">New Orleans Saints</option>
                                <option value="NYG">New York Giants</option>
                                <option value="NYJ">New York Jets</option>
                                <option value="Phi">Philadelphia Eagles</option>
                                <option value="Pit">Pittsburg Steelers</option>
                                <option value="SF">San Francisco 49ers</option>
                                <option value="Sea">Seattle Seahawks</option>
                                <option value="TB">Tampa Bay Buccaneers</option>
                                <option value="Ten">Tennessee Titans</option>
                                <option value="Wsh">Washington Commanders</option>
                            </th>
                            <th scope='col'><button id="${team._id}-new-player" onclick="DOMManager1.addPlayer('${team._id}')" class="btn btn-primary">Add Player</button></th>
                            </tr>
                            <tr>
                            <th scope='col'>Player Name</th>
                            <th scope='col'>Position</th>
                            <th scope='col'>Team</th>
                            <th scope='col'></th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                </div>`
                );
            for (let player of team.players) {
                
                console.log(`${player.id}`)
                $(`#${team._id}`).find('tbody').append(
                    `<tr>
                    <td id="name-${player.id}">${player.name}</td>
                    <td id="position-${player.id}">${player.position}</td>
                    <td id="team-${player.id}">${player.team}</td>
                    <td><button class="btn btn-danger" onclick="DOMManager1.deletePlayer('${team._id}', '${player.id}')">Delete Player</button></td>
                    </tr>`
                );
            }
        }
    }
}

$('#create-new-team').click(() => {
    DOMManager1.createTeam($('#new-team-name').val(),$('#new-team-owner').val());
    $('#new-team-name').val('');
    $('#new-team-owner').val('');
});

DOMManager1.getAllTeams();