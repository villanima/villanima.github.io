angular.module('msSiteAngular.config',[])
.constant('ConfigConstants', {
  'name': 'production',
  'apiEndpoint': 'https://shopapi.mrsite.com/',
  'shopApiEndpoint': 'https://shopapi.mrsite.com/',
  'siteApiEndpoint': 'https://sitebuilderapi.mrsite.com/',
  'idServerEndpoint': 'https://identityserver.mrsite.com',
  'themesEndpoint': 'https://themes.mrsite.com/',
  'checkoutEndpoint': 'https://checkout.mrsite.com/',
  'agoraApiEndpoint': 'https://agoraapi.mrsite.com/',
  'metaDataApiEndpoint': 'https://metadataapi.mrsite.com/',
  'messagingEndpoint': 'https://messagingapi.mrsite.com/',
  'modulesDirectory': 'bower_components',
  'subDomains': ['www', 'rs', 'ftp']
});