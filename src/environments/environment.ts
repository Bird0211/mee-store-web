// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  queryBrandUrl: '//localhost:8888/api/brand/list',
  addBrandUrl: '//localhost:8888/api/brand/add',
  editBrandUrl: '//localhost:8888/api/brand/edit',

  queryCategoryUrl: '//localhost:8888/api/category/list',
  addCategoryUrl: '//localhost:8888/api/category/add',
  editCategoryUrl: '//localhost:8888/api/category/edit',
  moveCategoryUrl: '//localhost:8888/api/category/move',
  sameCategoryUrl: '//localhost:8888/api/subcategory',

  queryProductUrl: '//localhost:8888/api/product/list',
  searchProductUrl: '//localhost:8888/api/product/search',
  addProductUrl: '//localhost:8888/api/product/add',
  editProductUrl: '//localhost:8888/api/product/edit',
  allProductUrl: '//localhost:8888/api/product/all',


  loginUrl: '//localhost:8888/api/login',
  uploadUrl: '//localhost:8888/api/upload',
  imageUrl: '//mee-stroe.oss-ap-southeast-2.aliyuncs.com',

  querySpecificationUrl: '//localhost:8888/api/specification/list',
  delSpecificationUrl: '//localhost:8888/api/specification/del',
  getCategoryUrl: '//localhost:8888/api/category',
  editSpecificationUrl: '//localhost:8888/api/specification/edit',

  submitOrderUrl: '//localhost:8888/api/order/submit',
  queryOrderUrl: '//localhost:8888/api/order/query',
  orderDetailUrl: '//localhost:8888/api/order/detail',
  getAddressUrl: '//localhost:8888/api/order/address',
  addAddressUrl: '//localhost:8888/api/order/address/add',
  searchOrderUrl: '//localhost:8888/api/order/queryOrder',

  allCitiesUrl: '//localhost:8888/api/city',
  searchCityUrl: '//localhost:8888/api/city/search',
  searchSuburbUrl: '//localhost:8888/api/suburb/search',

  addFreightUrl: '//localhost:8888/api/freight/add',
  allFreightUrl: '//localhost:8888/api/freight/all',
  setDefaultFreightUrl: '//localhost:8888/api/freight/default',
  removeFreightUrl: '//localhost:8888/api/freight/del',
  removeFreightDetailURl: '//localhost:8888/api/freight/detail/del',
  editFreightUrl: '//localhost:8888/api/freight/edit',
  getFreightUrl: '//localhost:8888/api/freight/query',
  freightUrl: '//localhost:8888/api/freight',
  productFreightUrl: '//localhost:8888/api/freight/product',

  orderFeeUrl: '//localhost:8888/api/order/fee',

  payMethodUrl: '//localhost:8888/api/pay/method',
  payUrl: '//localhost:8888/api/order/pay',
  payConfirmUrl: '//localhost:8888/api/order/pay/confirm',
  payInfoUrl: '//localhost:8888/api/pay/info',

  allExpressUrl: '//localhost:8888/api/express/all',
  expressUrl: '//localhost:8888/api/express',
  addExpressUrl: '//localhost:8888/api/order/delivery',
  editExpressUrl: '//localhost:8888/api/order/editExpress',
  unDeliverDataUrl: '//localhost:8888/api/express/undilivery',
  expressDetailUrl: '//localhost:8888/api/express/detail',
  partialDeliveryUrl: '//localhost:8888/api/order/partialDelivery',
  orderCompleteUrl: '//localhost:8888/api/order/complate'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
