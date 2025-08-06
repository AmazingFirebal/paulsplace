 function start() {
    gapi.client.init({
      apiKey: 'AIzaSyDicG28BjedTA44teSup3iX46dBU3znbm8',
      clientId: '833433388575-mncncrheocuhrspsroqdhk9653alv2vo.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
      scope: 'https://www.googleapis.com/auth/drive.readonly',
    }).then(function () {
      // Sign in
      return gapi.auth2.getAuthInstance().signIn();
    }).then(() => {
      // Now list files
      return gapi.client.drive.files.list({
        pageSize: 10,
        fields: 'files(id, name)',
      });
    }).then(response => {
      const files = response.result.files;
      console.log('Files:', files);
    });
  }

  gapi.load('client:auth2', start);