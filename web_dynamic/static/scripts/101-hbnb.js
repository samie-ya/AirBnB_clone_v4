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

  const placeLoder = (data) => {
    $('.places').empty();
    for (let res = 0; res < data.length; res++) {
      const place = data[res];
      $(
        $('<article>', { id: place.id }).append(
          $('<div>', { class: 'title_box' }).append(
            $('<h2>').text(place.name),
            $('<div>', { class: 'price_by_night' }).html('$' + place.price_by_night)
          ),
          $('<div>', { class: 'information' }).append(
            $('<div>', { class: 'max_guest' }).append(
              $('<br />'), place.max_guest + ' Guests'
            ),
            $('<div>', { class: 'number_rooms' }).append(
              $('<br />'), place.number_rooms + ' Bedrooms'
            ),
            $('<div>', { class: 'number_bathrooms' }).append(
              $('<br />'), place.number_bathrooms + ' Bathroom'
            )
          ),
          $('<div>', { class: 'description' }).html(place.description)
        )
      ).appendTo('.places');

      $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews/', function (data) {
        const para = $('<ul>');
        for (const review of data) {
          para.append(
            $('<li>').append(
              $('<h3>', { id: review.id }).text(''),
              $('<p>').text(
                review.text
              )
            )
          );
        }
        for (const review of data) {
          const reviewId = review.id;
          $.get('http://0.0.0.0:5001/api/v1/users/' + review.user_id, function (data) {
            const name = data.first_name + ' ' + data.last_name;
            const title = 'From ' + name;
            $('#' + reviewId).text(title);
          });
        }
        if ($('#' + place.id).children('.reviews').length === 0) {
          $('#' + place.id).append(
            $('<div>', { class: 'reviews' }).append(
              $('<div>', { class: 'show' }).append(
                $('<h2>').text(data.length + ' Reviews'),
                $('<span>').append('Hide')
              ),
              para
            )
          );
        }
        $('#' + place.id).find('span').click(function () {
          $('#' + place.id).find('ul').toggle('display');
          if ($('#' + place.id).find('span').text() === 'Show') {
            $('#' + place.id).find('span').text('Hide');
          } else {
            $('#' + place.id).find('span').text('Show');
          }
        });
      });
    }
  };

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: '{}',
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      placeLoder(data);
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
        placeLoder(data);
      }
    });
  });
};
