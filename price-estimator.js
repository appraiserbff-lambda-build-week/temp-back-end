const cheerio = require("cheerio");
const request = require("request-promise");

module.exports = {
  estimate: async property => {
    // map fields between what this API expects and what we have
    const you_will_conform = {
      beds: property.bedrooms,
      baths: property.bathrooms,
      square_feet: property.sqFt,
      lot_size: property.lotSize,
      hoa_per_month: property.hoa,
      property_types: property.type || 0,
      property_age: property.age,
      zip_codes: property.zipcode
    };

    // for some unholy reason they want multipart data
    return await request
      .post("https://house-estimator-69.herokuapp.com/", {
        formData: you_will_conform,
        transform: cheerio.load
      })
      .then($ => $("h2").text());
  },
  altEstimate: async property => {
    const you_will_conform = {
      year_assessment: property.yearAssessed,
      land_use_type: property.type || 31,
      beds: property.bedrooms,
      baths: property.bathrooms,
      total_rooms: property.rooms,
      zip: property.zipcode,
      assessed_property_taxes: property.taxes,
      year_built: new Date().getFullYear() - property.age,
      sqft_house: property.sqFt
    };

    return await request
      .post("https://manjula-regressor.herokuapp.com/", {
        formData: you_will_conform,
        transform: cheerio.load
      })
      .then($ => $("h2").text());
  }
};
