const path = require('node:path');
const XLSX = require("xlsx");

const dataPath = path.join(__dirname, './data.xlsx');
const productsWorksheetName = 'products';
const productsHeaders = ['hr_name', 'name', 'hr_description', 'description', 'price', 'imageDir'];
const servicesWorksheetName = 'services';
const servicesHeaders = ['hr_name', 'name', 'hr_description', 'description', 'imageName'];

function getData() {
  const workbook = XLSX.readFile(dataPath);
  const productsWorksheet = workbook.Sheets[productsWorksheetName];
  const products = XLSX.utils.sheet_to_json(productsWorksheet, { header: productsHeaders, range: 1 });
  const servicesWorksheet = workbook.Sheets[servicesWorksheetName];
  const services = XLSX.utils.sheet_to_json(servicesWorksheet, { header: servicesHeaders, range: 1 });
  return {
    products: prepareProductsData(products),
    services: prepareServicesData(services)
  };
}

function prepareProductsData(products) {
  const nameCounterMap = {};
  return products.map(item => {
    const nameLC = item.name.toString().trim().toLowerCase();
    const nameCounter = nameCounterMap[nameLC];
    if (!nameCounter) nameCounterMap[nameLC] = 1;
    else nameCounterMap[nameLC]++;
    return {
      ...item,
      id: getId('prod', nameCounter, nameLC),
      price: parseFloat(item.price).toFixed(2)
    }
  });
}

function prepareServicesData(services) {
  const nameCounterMap = {};
  return services.map(item => {
    const nameLC = item.name.toString().trim().toLowerCase();
    const nameCounter = nameCounterMap[nameLC];
    if (!nameCounter) nameCounterMap[nameLC] = 1;
    else nameCounterMap[nameLC]++;
    return {
      ...item,
      id: getId('ser', nameCounter, nameLC),
      imageAlt: `${item.imageName} - ${item.name}`
    }
  });
}

function getId(prefix, nameCounter, nameLC) {
  const suffix = nameCounter ? `${nameCounter}${nameLC}` : nameLC;
  return `${prefix}_${suffix}`;
}

module.exports = {
  getData
}