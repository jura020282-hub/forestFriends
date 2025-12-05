const path = require('node:path');
const XLSX = require("xlsx");

const dataPath = path.join(__dirname, '../data.xlsx');
const contactWorksheetName = 'contact';
const contactHeaders = ['number', 'mail', 'address', 'mapUrl', 'mapIframe'];
const productsWorksheetName = 'products';
const productsHeaders = ['hr_name', 'name', 'hr_description', 'description', 'price', 'imageDir'];
const servicesWorksheetName = 'services';
const servicesHeaders = ['hr_name', 'name', 'hr_description', 'description', 'imageName'];
const aboutWorksheetName = 'about';
const aboutHeaders = ['hr_title', 'title', 'hr_description', 'description', 'imageName'];

function getData() {
  const workbook = XLSX.readFile(dataPath);
  const contactWorksheet = workbook.Sheets[contactWorksheetName];
  const contact = XLSX.utils.sheet_to_json(contactWorksheet, { header: contactHeaders, range: 1 });
  const productsWorksheet = workbook.Sheets[productsWorksheetName];
  const products = XLSX.utils.sheet_to_json(productsWorksheet, { header: productsHeaders, range: 1 });
  const servicesWorksheet = workbook.Sheets[servicesWorksheetName];
  const services = XLSX.utils.sheet_to_json(servicesWorksheet, { header: servicesHeaders, range: 1 });
  const aboutWorksheet = workbook.Sheets[aboutWorksheetName];
  const about = XLSX.utils.sheet_to_json(aboutWorksheet, { header: aboutHeaders, range: 1 });
  return {
    contact: contact[0],
    products: prepareProductsData(products),
    services: prepareServicesData(services),
    about: prepareAboutData(about)
  };
}

function prepareProductsData(products) {
  const nameCounterMap = {};
  return products.map(item => {
    const nameLC = item.name.toString().trim().toLowerCase();
    const nameCounter = nameCounterMap[nameLC];
    if (!nameCounter) nameCounterMap[nameLC] = 1;
    else nameCounterMap[nameLC]++;
    let parsedPrice = parseFloat(item.price);
    return {
      ...item,
      id: getId('prod', nameCounter, nameLC),
      price: isNaN(parsedPrice) ? '--' : parsedPrice.toFixed(2)
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

function prepareAboutData(about) {
  const titleCounterMap = {};
  return about.map(item => {
    const titleLC = item.title.toString().trim().toLowerCase();
    const nameCounter = titleCounterMap[titleLC];
    if (!nameCounter) titleCounterMap[titleLC] = 1;
    else titleCounterMap[titleLC]++;
    return {
      ...item,
      id: getId('about', nameCounter, titleLC),
      imageAlt: `${item.imageName} - ${item.title}`
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