const req = new Request('/config');
fetch(req)
    .then(response => response.json())
    .then(config => {
        document.title = config.title;
        var itemlistHTML = '';
        config.items.forEach(item => {
            itemlistHTML += '<a href="' + item.link + '" title="' + item.alt + '" ><i class="' + item.icon + ' fa-fw" style="color:' + item.color + ';"></i><strong>' + item.alt + '</strong></a>';
        });
        document.getElementById("itemlist").innerHTML = itemlistHTML;
    })

function addTriangleTo(target) {
    var dimensions = target.getClientRects()[0];
    var pattern = Trianglify({
        width: dimensions.width,
        height: dimensions.height
    });

    target.style['background-image'] = 'url(' + pattern.png() + ')';
    target.style['background-size'] = 'cover';
    // target.style['-webkit-background-size'] = 'cover';
    // target.style['-moz-background-size'] = 'cover';
    // target.style['-o-background-size'] = 'cover';
}

var resizeTimer;
window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        addTriangleTo(homepage);
    }, 400);
})

addTriangleTo(homepage);