var startTime = new Date().getTime();
var colors = ["red", "orange", "green", "blue", "indigo", "violet"];
var currentIndex = 0;
var timer;  // Déclarer timer ici pour qu'il soit accessible dans toutes les fonctions

function updateTimer() {
  var currentTime = new Date().getTime();
  var elapsedTime = currentTime - startTime;
  
  var hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  timer = hours + ":" + minutes + ":" + seconds;
  document.getElementById("timer").innerHTML = timer;

  if (hours >= 1) {
    document.body.style.background = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
    document.getElementById("congrat").innerHTML = "Tu es au chômage ?";
  } else if (minutes >= 30) {
    document.body.style.background = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
    document.getElementById("congrat").innerHTML = "Merci d'être encore là";
  } else if (minutes >= 1) {
    document.body.style.background = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
    document.getElementById("congrat").innerHTML = "Quel temps pourras-tu faire ?";
  }
}

setInterval(updateTimer, 1000);

function getUrlParameters() {
  var params = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    params[key] = value;
  });
  return params;
}

var urlParams = getUrlParameters();
if (urlParams.access_token) {
  var accessToken = urlParams.access_token;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://discord.com/api/users/@me", true);
  xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      var discordUsername = response.username;
      var discordEmail = response.email;
  
      var pseudoElement = document.getElementById("pseudo");
      pseudoElement.textContent = discordUsername;
  
      var emailElement = document.getElementById("email");
      emailElement.textContent = discordEmail;
      
      var connexionDiscordButton = document.getElementById("connexionDiscord");
      connexionDiscordButton.style.display = "none";

      var greeting = document.getElementById("msg");
      greeting.content = "Message envoyée avec succès";
    }
  };  
  xhr.send();
}

function sendDataToDiscord() {
  // Obtenez le pseudo de l'utilisateur
  var pseudo = document.getElementById("pseudo").textContent;

  var data = {
    content: `Pseudo: ${pseudo}\nHeure passé: ${timer}`
  };

  // Effectuez une requête POST au webhook Discord
  fetch('https://discord.com/api/webhooks/1113191549874999326/fJvUmnj2msB6V_5YxH2DRMXlO5-FC5DX-gCz1f0Q7d11AVRJCl_qISEl4lx_B7Smtq17', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    console.log('Données envoyées avec succès à Discord');
  })
  .catch(error => {
    console.error('Erreur lors de l\'envoi des données à Discord', error);
  });
}
