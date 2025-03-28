var values = {
    friction: 0.8,
    timeStep: 1,
    amount: 8, 
    mass: 2,
    count: 0
};

values.invMass = 1 / values.mass;

var path, springs;
var size = view.size * [1.2, 1];

var Spring = function(a, b, strength, restLength) {
    this.a = a;
    this.b = b;
    this.restLength = restLength || 90;
    this.strength = strength ? strength : 0.9;
    this.mamb = values.invMass * values.invMass;
};

Spring.prototype.update = function () {
    var delta = this.b - this.a;
    var dist = delta.length;
    var normDistStrength = (dist - this.restLength) /
        (dist * this.mamb) * this.strength;
    delta.y *= normDistStrength * values.invMass * 0.2;
    if (!this.a.fixed)
        this.a.y += delta.y;
    if (!this.b.fixed)
        this.b.y -= delta.y;
};

function createPath(strength) {
    var path = new Path();
    path.fillColor = new Color(1, 0.8509803921568627, 0.23137254901960785, 0.8);
    
    // Add first layer of shadow (inner)
    path.shadowColor = '#9e9069';
    path.shadowBlur = 10;
    path.shadowOffset = new Point(0, 0);
    
    // Add second layer of shadow (outer) using CSS
    path.style.boxShadow = '0 0 20px white'; // Adjust blur and spread as needed

    springs = [];
    for (var i = 0; i <= values.amount; i++) {
        var segment = path.add(new Point(i / values.amount, 0.5) * size);
        var point = segment.point;
        if (i == 0 || i == values.amount)
            point.y += size.height;
        point.px = point.x;
        point.py = point.y;
        // The first two and last two points are fixed:
        point.fixed = i < 2 || i > values.amount - 2;
        if (i > 0) {
            var spring = new Spring(segment.previous.point, point, strength);
            springs.push(spring);
        }
    }
    path.position.x -= size.width / 4;
    return path;
}


function onResize() {
    if (path)
        path.remove();
    size = view.bounds.size * [2, 1];
    path = createPath(0.1);
}

function onMouseMove(event) {
    var point = event.point;
    var pathBounds = path.bounds;

    // Ensure the mouse position is within the canvas bounds
    if (point.x >= pathBounds.left && point.x <= pathBounds.right && point.y >= pathBounds.top && point.y <= pathBounds.bottom) {
        var location = path.getNearestLocation(point);
        var segment = location.segment;
        var targetPoint = segment.point;

        if (!targetPoint.fixed && location.distance < size.height / 4) {
            var y = point.y;
            targetPoint.y += (y - targetPoint.y) / 6;
            if (segment.previous && !segment.previous.fixed) {
                var previous = segment.previous.point;
                previous.y += (y - previous.y) / 24;
            }
            if (segment.next && !segment.next.fixed) {
                var next = segment.next.point;
                next.y += (y - next.y) / 24;
            }
        }
    }
}


function onFrame(event) {
    updateWave(path);
}

function updateWave(path) {
    var force = 1 - values.friction * values.timeStep * values.timeStep;
    for (var i = 0, l = path.segments.length; i < l; i++) {
        var point = path.segments[i].point;
        var dy = (point.y - point.py) * force;
        point.py = point.y;
        point.y = Math.max(point.y + dy, 0);
    }

    for (var j = 0, l = springs.length; j < l; j++) {
        springs[j].update();
    }
    path.smooth({ type: 'continuous' });
}

function onKeyDown(event) {
    if (event.key == 'space') {
        path.fullySelected = !path.fullySelected;
        path.fillColor = path.fullySelected ? null : 'black';
    }
}
