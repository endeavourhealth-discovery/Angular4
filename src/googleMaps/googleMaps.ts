
import {Component, Input} from "@angular/core";
import {Marker} from "./models/Marker";
import {GoogleMapPosition} from "./models/GoogleMapPosition";

declare var google: any;
declare var MarkerClusterer: any;

@Component({
    selector: 'eds-google-maps',
    styles: ['#map { height: 500px }'],
    template: `
        <div id="map">

        </div>
    `
})

export class GoogleMaps {
    @Input() markers: Marker[] = [];
    @Input() latitude: number = 54.4347266;
    @Input() longitude: number = -4.7194005;
    @Input() zoom: number = 6;


    ngOnChanges(changes) {
        var vm = this;
        if (vm.markers) {
            vm.refreshMap();
        }
    }

    refreshMap() {
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: this.zoom,
            center: {lat: this.latitude, lng: this.longitude}
        });

        let clusters = {};

        if (this.markers) {
            clusters = this.markers.map(function (mark) {
                const mp: GoogleMapPosition = new GoogleMapPosition;
                mp.lat = mark.lat;
                mp.lng = mark.lng;
                return new google.maps.Marker({
                    position: mp,
                    label: mark.name
                });
            });
        }

        // Add a marker clusterer to manage the markers.
        const markerCluster = new MarkerClusterer(map, clusters,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }

}