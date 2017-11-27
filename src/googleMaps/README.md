### Google Maps
Component to display a google map containing clustered markers

#### Usage
Import the Google Maps Module into the module you want to use it in.
```typescript
import { GoogleMapsModule } from 'eds-angular4/dist/googleMaps';
```

and add it to your imports
```typescript
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GoogleMapsModule
  ],
```
Takes an input of an array of Markers which are defined in the models folder but contains  
* Name  
* Latitude  
* Longitude

Also takes optional parameters of
* Latitude - Latitude of the centre of the map
* Longitude - Longitude of the centre of the map.
* Zoom -  Zoom level of the map

The default values for the optional parameters show the entire UK.

Use in the HTML as follows
```html
      <eds-google-maps
        [markers]="markers">
      </eds-google-maps>
```