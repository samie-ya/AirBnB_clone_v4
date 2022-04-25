const $ = window.$;
window.onload = function () {
  const checkedAmenities = {};
  const checkedStates = {};
  const checkedCities = {};
  $('.amenities input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    } else if ($(this).is(':not(:checked)')) {
      delete checkedAmenities[$(this).attr('data-id')];
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    }
  });

  $('.locations h2 input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      checkedStates[$(this).attr('data-id')] = $(this).attr('data-name');
      $('div.locations > h4').text(Object.values(checkedStates).join(', '));
    } else if ($(this).is(':not(:checked)')) {
      delete checkedStates[$(this).attr('data-id')];
      $('div.locations > h4').text(Object.values(checkedStates).join(', '));
    }
  });

  $('.locations li input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      checkedCities[$(this).attr('data-id')] = $(this).attr('data-name');
      $('div.locations > h4').text(Object.values(checkedCities).join(', '));
    } else if ($(this).is(':not(:checked)')) {
      delete checkedCities[$(this).attr('data-id')];
      $('div.locations > h4').text(Object.values(checkedCities).join(', '));
    }
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: '{}',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      for (let res = 0; res < data.length; res++) {
        const place = data[res];
        $('.places').append(
          '<article> <div class="title_box">' +
                    '<h2>' + place.name + '</h2>' +
                    '<div class="price_by_night">' + '$' + place.price_by_night + '</div> </div>' +
                    '<div class="information"> <div class="max_guest">' +
                    '<br />' + place.max_guest + ' Guests' + '</div>' +
                    '<div class="number_rooms">' +
                    '<br />' + place.number_rooms + ' Bedrooms' + '</div>' +
                    '<div class="number_bathrooms">' +
                    '<br />' + place.number_bathrooms + ' Bathroom' + '</div>' +
                    '</div>' + '<div class="description">' + place.description + '</div>' + '</article>'
        );
      }
    }
  });

  $('button').click(function () {
    $('section.places > article').remove();
    const amenitiesKeys = Object.keys(checkedAmenities);
    const statesKeys = Object.keys(checkedStates);
    const citiesKeys = Object.keys(checkedCities);
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({ states: statesKeys, cities: citiesKeys, amenities: amenitiesKeys }),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        for (let res = 0; res < data.length; res++) {
          const place = data[res];
          $('.places').append(
            '<article> <div class="title_box">' +
                        '<h2>' + place.name + '</h2>' +
                        '<div class="price_by_night">' + '$' + place.price_by_night + '</div> </div>' +
                        '<div class="information"> <div class="max_guest">' +
                        '<br />' + place.max_guest + ' Guests' + '</div>' +
                        '<div class="number_rooms">' +
                        '<br />' + place.number_rooms + ' Bedrooms' + '</div>' +
                        '<div class="number_bathrooms">' +
                        '<br />' + place.number_bathrooms + ' Bathroom' + '</div>' +
                        '</div>' + '<div class="description">' + place.description + '</div>' + '</article>'
          );
        }
      }
    });
  });
};
