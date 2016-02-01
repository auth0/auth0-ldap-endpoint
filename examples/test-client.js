var ldap = require('ldapjs');
var client = ldap.createClient({
  url: 'ldap://127.0.0.1:1389'
});

client.bind('CN=admin@fabrikam.com,OU=Username-Password-Authentication', 'MyPassword', function(err) {
  if (err) {
    console.log('Bind Error:', JSON.stringify(err, null, 2));
    return client.unbind(function(err) {
      if (err) {
        console.log(err);
      }
    });
  }

  console.log('Bind success.');

  var opts = {
    filter: '(email=admin@fabrikam.com)',
    scope: 'sub',
    attributes: ['dn', 'sn', 'cn']
  };

  console.log(`Searching for: ${JSON.stringify(opts, null, 2)}`);

  client.search('OU=Username-Password-Authentication', opts, function(err, res) {
    res.on('searchEntry', function(entry) {
      console.log('Found: ' + JSON.stringify(entry.object));
    });
    res.on('searchReference', function(referral) {
      console.log('Referral: ' + referral.uris.join());
    });
    res.on('error', function(err) {
      console.error('Error: ' + err.message);
    });
    res.on('end', function(result) {
      console.log('Search Done. Status: ' + result.status);
    });
  });
});
