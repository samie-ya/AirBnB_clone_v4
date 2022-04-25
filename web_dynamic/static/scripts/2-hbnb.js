const $ = window.$;
window.onload = function () {
  const checkedAmenities = {};
  $('input[type="checkbox"]').click(function () {
    if ($(this).is(':checked')) {
      checkedAmenities[$(this).attr('data-id')] = $(this).attr('data-name');
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    } else if ($(this).is(':not(:checked)')) {
      delete checkedAmenities[$(this).attr('data-id')];
      $('div.amenities > h4').text(Object.values(checkedAmenities).join(', '));
    }
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });
};
