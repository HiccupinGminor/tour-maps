App = Ember.Application.create({});

App.Router.map(function() {
    // put your routes here
    this.route("guest", {path: "/guest"});
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

App.GuestController = Ember.Controller.extend({

    waypoints: [],

    tripLegs: [],

    addWaypoint: function(location){

        this.waypoints.push({location: location, stopover: true});
    },

    calcRoute: function(){

        var directionsService = new google.maps.DirectionsService();

        var start = "742 N Cahuenga Blvd, Los Angeles, CA";
        var end = start;
        var optimize = true;
        var legs;

        //Google's request parameters
        var request = {
            origin:start,
            destination:end,
            waypoints: this.waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
            optimizeWaypoints: optimize,
        };

        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {

                directionsRenderer.setDirections(response);
                
                //Get google response
                legs = response.routes[0].legs;

                tripLegs = legs;
            }
        });
    },

    actions: {
        addNode: function(node){

            node.set('added', true);
            this.addWaypoint(node.location);
            this.calcRoute();
        }
    }

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

// google.maps.event.addDomListener(window, 'load', initialize);