App = Ember.Application.create({});

App.Router.map(function() {
    // put your routes here
    this.route("guest", {path: "/guest"});
    this.route("directions", {path: "/directions"});
    this.route("staff", {path: "/staff"});
});

var directionsRenderer = new google.maps.DirectionsRenderer();

App.GuestRoute = Ember.Route.extend({
    model: function() {
        return [
            Ember.Object.create({name:"Page Museum",location:"Page Museum 5801 Wilshire Blvd Los Angeles, CA 90036", added:false}),
            Ember.Object.create({name:"LACMA",location:"Los Angeles County Museum of Art 5905 Wilshire Blvd Los Angeles, CA 90036", added:false}),
            Ember.Object.create({name:"MOMA",location:"Museum of Contemporary Art 250 S Grand Ave Los Angeles, CA 90012", added:false}),
            Ember.Object.create({name:"The Getty",location:"The Getty 1200 Getty Center Dr Los Angeles, CA 90049", added:false}),
        ];
    }
});

App.DirectionsRoute = Ember.Route.extend({});

App.DirectionsController = Ember.Controller.extend({
    model: function() {
        return [
            {text: "FOO"}, {text: "BAR"}, {text: "BAZ"}
        ];
    }
});

App.GuestController = Ember.Controller.extend({

    waypoints: [],

    addWaypoint: function(location){

        this.waypoints.push({location: location, stopover: true});
    },

    calcRoute: function(node){

        var travelMode = node.get('mode') || google.maps.TravelMode.DRIVING;

        var directionsService = new google.maps.DirectionsService();

        var start = "742 N Cahuenga Blvd, Los Angeles, CA";
        var end = start;
        var optimize = true;
        var directionsResponse;
        //Google's request parameters
        var request = {
            origin:start,
            destination:end,
            waypoints: this.waypoints,
            travelMode: travelMode,
            optimizeWaypoints: optimize,
        };

        var saveDirections = function(directions){
            console.log(controllers.directions);
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // console.log(this.response);

                directionsRenderer.setDirections(response);
                directionsResponse = response;
                // console.log(response.routes[0].legs);
                //Get google response
                // response = response.routes[0].legs;
                saveDirections(directionsResponse);
            }
        });
    },

    newPlaceTag: "",
    newPlaceLocation: "",

    actions: {
        addNode: function(node){
            node.set('added', true);
            this.addWaypoint(node.location);
            this.calcRoute(node);

            // console.log(tripLegs.get('legs'));
        },
        createPlace: function(place){
            // var location = this.get('newPlaceLocation');

            //HACK
            var location = document.getElementById("autoComplete").value;
            var tag = this.get('newPlaceTag');
            // if (!location || !tag) { return false; }
            // Create the new Todo model
            var placeObject = {
                name: tag,
                location: location,
                added: false,
            };

            this.addWaypoint(location);
            this.calcRoute(placeObject);

            // // Clear the "New Todo" text field
            this.set('newPlaceLocation', '');
            this.set('newPlaceTag', '');
        }
    },

    needs: ['directions']

});

App.GoogleMapsComponent = Ember.Component.extend({
  insertMap: function() {
    var container = this.$(".map-canvas");
    var zoom = this.get("zoom") || 14;
    var options = {
        center: new google.maps.LatLng(this.get("latitude"),
        this.get("longitude")),
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(container[0], options);
    
    directionsRenderer.setMap(map);

    if(this.get("center") === true){
        homeMarker = new google.maps.Marker({
            position: options.center,
            map: map,
            title: "Runtriz"
        });
    }

  }.on('didInsertElement')
});

//Generate autocomplete field
var options = {
    types: [],
    componentRestrictions: {}
};
var inputField = new google.maps.places.Autocomplete(document.getElementById('autoComplete'), options);

function initialize() {

    var input = document.getElementById('autoComplete');
    var autocomplete = new google.maps.places.Autocomplete(input);
}

google.maps.event.addDomListener(window, 'load', initialize);
// google.maps.event.addDomListener(window, 'load', initialize);