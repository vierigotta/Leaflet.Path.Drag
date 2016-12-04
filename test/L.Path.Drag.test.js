import tape from 'tape';
import L    from 'leaflet';
import Hand from 'prosthetic-hand';
import DragHandler from '../';

let stylesheet  = document.createElement('link');
stylesheet.rel  = 'stylesheet';
stylesheet.type = 'text/css';
stylesheet.href = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0-rc.3/leaflet.css';
document.head.appendChild(stylesheet);

const center = [22.42658, 114.1952];

const createMap = () => {
  let div = document.createElement('div');
  div.style.width = div.style.height = '500px';

  document.body.appendChild(div);

  const map = new L.Map(div, {})
    .setView(center, 11);
  map._container.style.background = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAABlBMVEXMzMz////TjRV2AAAASklEQVR42u3SsREAMAjDwGf/pbMAhdJDrQvBlm1mmeOOO+6PU99T96r/U+9Q71VzUfNTc1b7UHtT+1U9UH1RvVL9Uz1VfVa9F7l5CX4DIbeXYmYAAAAASUVORK5CYII=\')';
  return map;
}

tape('L.Path.Drag', (t) => {

  t.test('API', (t) => {

    t.ok(L.Handler.PathDrag, 'drag handler is registered');

    t.ok(L.polygon([[1,1], [2,2], [3,3], [4,4], [1,1]], {
      draggable: true
    }).dragging, 'handler on polygon');

    t.ok(L.polyline([[1,1], [2,2], [3,3], [4,4], [1,1]], {
      draggable: true
    }).dragging, 'handler on polyline');

    t.ok(L.circle([1,1], {
      radius: 200,
      draggable: true
    }).dragging, 'handler on circle');

    t.ok(L.circleMarker([1,1], {
      radius: 200,
      draggable: true
    }).dragging, 'handler on circle');

    t.end();

  });


  t.test('dragging', (t) => {
    const map = createMap();

    t.test(' - circle', (t) => {
      t.plan(6);
      const failIfClickPropagates = (evt) => t.fail();
      map
        .once('click', failIfClickPropagates);

      const path = L.circle(center, {
        radius: 4000,
        draggable: true,
        interactive: true
      }).on('dragend', (evt) => {
        const ll = L.latLng(center);
        t.notOk(path.getLatLng().equals(ll), 'center changed');
        t.ok(evt.distance < 105 && evt.distance > 95, 'distance');
      }).addTo(map);

      const h = new Hand({
        onStop: () => {
          let c = map.getCenter();
          map.removeLayer(path);
          map.off('click', failIfClickPropagates);
          t.deepEquals(center, [c.lat, c.lng], 'map center didnt change');
          t.skip('done');
        }
      });
      const mouse = h.growFinger('mouse');

      mouse.moveTo(250, 250, 0)
        .wait(500)
        .down().moveBy(100, 0, 1000).up().wait(500)
        .down().moveBy(-100, 0, 1000).up().wait(500)
        .down().wait(100).up().wait(500);
    });


    t.test(' - polygon', (t) => {
      t.plan(6);

      const failIfClickPropagates = (evt) => t.fail();
      map.once('click', failIfClickPropagates);

      const shift = 0.05;
      const y = center[0];
      const x = center[1];
      const path = L.polygon([
        [y - shift, x - shift],
        [y - shift, x + shift],
        [y + shift, x + shift],
        [y + shift, x - shift],
        [y - shift, x - shift]
      ], {
        draggable: true,
        interactive: true
      }).on('dragend', (evt) => {
        const ll = L.latLng(center);
        t.notOk(path.getCenter().equals(ll), 'center changed');
        t.ok(evt.distance < 105 && evt.distance > 95, 'distance');
      }).addTo(map);

      const h = new Hand({
        onStop: () => {
          let c = map.getCenter();
          map.removeLayer(path);
          map.off('click', failIfClickPropagates);
          t.deepEquals(center, [c.lat, c.lng], 'map center didnt change');
          t.skip('done');
        }
      });
      const mouse = h.growFinger('mouse');

      mouse.moveTo(250, 250, 0)
        .wait(300)
        .down().moveBy(100, 0, 1000).up().wait(500)
        .down().moveBy(-100, 0, 1000).up().wait(500)
        .down().wait(100).up().wait(500);
    });


    t.test(' - polyline', (t) => {
      t.plan(6);

      const failIfClickPropagates = (evt) => t.fail();
      map.once('click', failIfClickPropagates);

      const shift = 0.05;
      const y = center[0];
      const x = center[1];
      const path = L.polyline([
        [y + shift, x - shift],
        [y - shift, x - shift],
        [y + shift, x + shift],
        [y - shift, x + shift]
      ], {
        draggable: true,
        weight: 40,
        interactive: true
      }).on('dragend', (evt) => {
        const ll = L.latLng(center);
        t.notOk(path.getCenter().equals(ll), 'center changed');
        t.ok(evt.distance < 105 && evt.distance > 95, 'distance');
      }).addTo(map);

      const h = new Hand({
        onStop: () => {
          let c = map.getCenter();
          map.removeLayer(path);
          map.off('click', failIfClickPropagates);
          t.deepEquals(center, [c.lat, c.lng], 'map center didnt change');
          t.skip('done');
        }
      });
      const mouse = h.growFinger('mouse');

      mouse.moveTo(250, 250, 0)
        .wait(300)
        .down().moveBy(100, 0, 1000).up().wait(500)
        .down().moveBy(-100, 0, 1000).up().wait(500)
        .down().wait(100).up().wait(500);
    });

  });


  t.end();
});
