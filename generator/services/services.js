const { readFile } = require('node:fs/promises');
const path = require('node:path');

const servicesTemplatePath = path.join(__dirname, './templates/services.html');
const serviceTemplatePath = path.join(__dirname, './templates/service.html');
const imagesPath = './images/services'

async function mapServicesTemplate(html, services) {
  const serviceHTMLs = await getServiceHTMLs(services);
  const servicesTemplate = await readFile(servicesTemplatePath, { encoding: 'utf8' });
  const servicesHTML = servicesTemplate.replaceAll('{{services}}', serviceHTMLs.join('\n'));
  html = html.replaceAll('{{services.html}}', servicesHTML);
  return html;
}

async function getServiceHTMLs(services) {
  const templates = await getTemplates();
  return Promise.all(services.map(item => getServiceHTML(item, templates)));
}

async function getTemplates() {
  const [
    serviceTemplate
  ] = await Promise.all([
    readFile(serviceTemplatePath, { encoding: 'utf8' })
  ]);
  return { serviceTemplate };
}

async function getServiceHTML(item, htmlTemplates) {
  const { serviceTemplate } = htmlTemplates;
  return serviceTemplate
    .replaceAll('{{id}}', item.id)
    .replaceAll('{{name}}', item.name)
    .replaceAll('{{image}}', getImagePath(item.imageName))
    .replaceAll('{{imageAlt}}', item.imageAlt)
    .replaceAll('{{description}}', item.description);
}

function getImagePath(name) {
  return `${imagesPath}/${name}`;
}

module.exports = {
  mapServicesTemplate
};

