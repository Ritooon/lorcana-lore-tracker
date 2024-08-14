const params = new URLSearchParams(document.location.search);
const gameToken = params.get("token");

document.addEventListener("DOMContentLoaded", function() {
    let player1Name = document.getElementById('player-1-name'), player2Name = document.getElementById('player-2-name');

    player1Name.addEventListener(`focus`, () => player1Name.select());
    player2Name.addEventListener(`focus`, () => player2Name.select());

    // Check if in game (token is present)    
    if(gameToken != null) {
        // Load the game stats
        let formData=new FormData();
        formData.set('action', 'loadGame');
        formData.set('token', gameToken);
        
        fetch('game_management.php', { method: 'POST', body: formData })
            .then(result => result.json())
            .then(json => {
                // Restore game stats of the game
                player1Name.value = json.nameP1;
                player2Name.value = json.nameP2;
                document.getElementById('tracker-p1-val').innerText = json.loreP1;
                document.getElementById('tracker-p2-val').innerText = json.loreP2;
            })
            .catch(alert)
    }

    let timeout; 

    // Updating player names
    document.querySelectorAll('input').forEach(function(input) {
        input.addEventListener('keyup', function() { 
            // Clear the actual timeout of key pressing
            clearTimeout(timeout); 
            // Reset the timeout
            timeout = setTimeout(function() { 
                updateGame();
            }, 800); 
        });
    });
});

function updateTrackerVal(plusLess, player) {
    // Get lore of the player
    let playerLoreContainer = document.getElementById('tracker-p'+player+'-val');
    let playerLore = parseInt(playerLoreContainer.innerText);

    // Do the maths
    if(plusLess == 'less' && playerLore > 0) {
        playerLore--;
    } else if(plusLess == 'plus') {
        playerLore++;
    }

    // Update lore
    playerLoreContainer.innerText = playerLore;

    // Update the CSV file containing data
    updateGame();
}

function newGame() {
    // Generate token
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for(let i = 0; i < 32; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }

    // Create CSV file with token in parameter
    let formData=new FormData();
    formData.set('action', 'createGame');
    formData.set('token', token);
    formData.set('nameP1', document.getElementById('player-1-name').value);
    formData.set('nameP2', document.getElementById('player-2-name').value);
    
    fetch('game_management.php', { method: 'POST', body: formData })
    .then(result => result.json())
    .then(json => {
        // Get the new generated URL and set it into the input
        document.getElementById('OBSUrl').value = json.urlOBS;
        // Display the modal
        let modal = document.getElementById('modalOBS');
        modal.classList.add("open");
    })
    .catch(alert)

    // Display the link to put in OBS
}

function reloadWithOBSUrl() {
    window.location.href = document.getElementById('OBSUrl').value;
}

function updateGame() {

    let formData=new FormData();
    formData.set('action', 'updateGame');
    formData.set('token', gameToken);
    formData.set('nameP1', document.getElementById('player-1-name').value);
    formData.set('nameP2', document.getElementById('player-2-name').value);
    formData.set('loreP1', document.getElementById('tracker-p1-val').innerText);
    formData.set('loreP2', document.getElementById('tracker-p2-val').innerText);
    
    fetch('game_management.php', { method: 'POST', body: formData })
    .then(result => result.json())
    .then(json => {
        if(json.updated) {
            console.log('Game updated')
        } else {
            alert('Game seems to not have been savec')
        }
    })
    .catch(alert)
}