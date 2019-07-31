const http = new XMLHttpRequest();
const url = 'https://top100movies.herokuapp.com/movieinfo';
http.open("GET", url);
http.send(null);
var loaded = false;

// Load data when page finishes loading
window.onload = function() {
    var data;
    var firstElement = false;
    if (loaded == true) {
        return;
    }
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(http.responseText);
            
            data.forEach(element => {
                if (firstElement == false) {
                    firstElement = true;
                    return;
                }
                var listElement = document.createElement('li');
                listElement.className = 'zoom shadow list-group-item mb-3 text-left';
        
                var img = document.createElement('img');
                img.className = 'mr-4';
                img.style = 'float:left';
                img.src = element.image;
                
                var heading = document.createElement('h1');
                heading.innerText = element.rank + '. ' + element.name;
        
                var p1 = document.createElement('p');
                p1.innerText = 'Studio: ' + element.studio;
        
                var p2 = document.createElement('p');
                p2.innerText = 'Worldwide Gross: ' + element.worldwide + ' Million';
        
                var p3 = document.createElement('p');
                p3.innerText = 'Release Date: ' + element.year;
        
                var p4 = document.createElement('p');
                p4.innerText = 'Genre: ' + element.genre;
        
                var p5 = document.createElement('p');
                p5.innerText = 'Runtime: ' + element.runtime;
        
                var p6 = document.createElement('p');
                p6.innerText = 'Rating: ' + element.rating;
        
                var p7 = document.createElement('p');
                p7.innerText = 'Budget: ' + element.budget;
        
                listElement.appendChild(img);
                listElement.appendChild(heading);
                listElement.appendChild(p1);
                listElement.appendChild(p2);
                listElement.appendChild(p3);
                listElement.appendChild(p4);
                listElement.appendChild(p5);
                listElement.appendChild(p6);
                listElement.appendChild(p7);
            
                document.getElementById('movielist').appendChild(listElement);
            });
        
            loaded = true;
        }
    }  
}