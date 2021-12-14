var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var dbProvider = require('./DatabaseProvider');

function getAllActiveProducts(callback) {
    var sql = getQueryToSearchProductsByStatus('ACTIVE');
    dbProvider.executeQuery(sql, callback);
}

  function getAllProductCategories(callback) {
    var sql = getQueryToGetAllProductCategories();
    dbProvider.executeQuery(sql, callback);
  }

  function getProductsByCategoryId(categoryId, callback) {
    var sql = getQueryToFetchProductsByCategoryId(categoryId);
    dbProvider.executeQuery(sql, callback);
  }

  function getQueryToFetchProductsByCategoryId(categoryId) {
    return util.format("SELECT * FROM `product` WHERE `category_id` = '%s'", categoryId);
  }

  function getQueryToSearchProductsByStatus(status) {
      return util.format("SELECT * FROM `product` WHERE `status` = '%s'", status);
  }

  function getQueryToGetAllProductCategories() {
    return util.format("SELECT * FROM `product_category`");
  }

  function saveProduct(product, callback) {
    var sql = getQueryToSaveProduct(product);
    dbProvider.setTableName("product");
    dbProvider.executeSaveAndReturnSavedEntityQuery(sql, callback)
  }

  function getQueryToSaveProduct(product) {
    var saveProductSql = "INSERT INTO product (name, category_id, status, ingredients, image_url, is_vegan, is_dairyfree, is_eggless)\
    VALUES ('%s', '%s', '%s', '%s', '%s', %d, %d, %d);"
    return util.format(saveProductSql, product.name, product.categoryId, product.status, "", "", product.isVegan, product.isDairyfree, product.isEggless);
  }

  module.exports = {
    getAllActiveProducts,
    getAllProductCategories,
    getProductsByCategoryId,
    saveProduct
  };