(function() {
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: post.geometry.coordinates,
    zoom: 5,
  });

  // create a HTML element for each post location/marker
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for our location and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(post.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'),
    )
    .addTo(map);
})();

(function() {
  $('.toggle-edit-form').on('click', function() {
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    $(this)
      .siblings('.edit-review-form')
      .toggle();
  });
})();

(function() {
  $('.clear-rating').on('click', function() {
    $(this)
      .siblings('.input-no-rate')
      .click();
  });
})();
