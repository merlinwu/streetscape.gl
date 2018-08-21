import _ from 'lodash';
import {v4 as uuid} from 'uuid';
import {ROUTE} from '~/topics';

export class RouteDataSource {
  constructor() {
    this.ROUTE = '/map/route';
  }

  convertFrame(frame, xvizBuilder) {
    let routeMessages = frame[ROUTE];
    if (!routeMessages) {
      if (!this.previousRouteMessages) {
        return;
      }
      routeMessages = this.previousRouteMessages;
    }
    this.previousRouteMessages = routeMessages;

    for (const {timestamp, message} of routeMessages) {
      const {markers} = message;
      const points = _.chain(markers)
        .map('points')
        .reject(_.isEmpty)
        .flatten()
        .slice(0, -2) // Our last point seems to return to origin, so chop it off
        .map((p) => [p.x, p.y, 0])
        .value();

      if (!_.isEmpty(points)) {
        xvizBuilder
          .stream(this.ROUTE)
          .polyline(points)
          .classes(['Map'])
          .timestamp(timestamp.toDate().getTime())
          .color([0, 0, 255, 255])
          .id(uuid());
      }
    }
  }


  getMetadata(xvizMetaBuilder) {
    const xb = xvizMetaBuilder;
    xb.stream(this.ROUTE)
      .coordinate('map_relative')
      .category('primitive')
      .type('polyline')
      .styleClass('Map', {
        fillColor: '#FF0000',
        strokeWidth: 0.2,
        strokeWidthMinPixels: 1
      });
  }
}
