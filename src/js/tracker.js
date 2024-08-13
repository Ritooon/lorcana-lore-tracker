document.addEventListener("DOMContentLoaded", function() {
    let player1Name = document.getElementById('player-1-name'), player2Name = document.getElementById('player-2-name');

    player1Name.addEventListener(`focus`, () => player1Name.select());
    player2Name.addEventListener(`focus`, () => player2Name.select());
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
}