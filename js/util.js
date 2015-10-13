function toggleClass(el, className) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);
        if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
        else
            classes.push(className);
        el.className = classes.join(' ');
    }
}

function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}

function pDate(date) {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

function pDist(dist) {
    return (dist/1000).toFixed(2) + " km";
}

function pSpeed(speed) {
    return (speed*1000*3.6).toFixed(2) + " km/h";
}

function pTime(time) {
    hour = Math.floor(time / 3600);
    min = Math.floor((time - hour*3600) / 60);
    sec = (time - hour*3600 - min*60).toFixed(2);
    return hour + "h " + min + "m " + sec + "s";
}