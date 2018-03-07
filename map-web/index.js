var express = require('express'),
    R = require("r-script"),
    app = express();

app.use(express.static('web'));

app.get('/test', function(req, res) {
  var input = {
    project_id: 'project_id',
    gseid: '8 digit GSE code',
    folder: 'examples',
    filenames: [
      '13 EV1_(Clariom_S_Human).CEL',
      '14 EV2_(Clariom_S_Human).CEL',
      '15 EV3_(Clariom_S_Human).CEL',
      '16 Luc 1_(Clariom_S_Human).CEL',
      '17 Luc 2_(Clariom_S_Human).CEL',
      '18 Luc 3_(Clariom_S_Human).CEL'
    ]
  };

  res.send(
    R("test.R")
    .data(JSON.stringify(input))
    .callSync()
  );
});

app.get('/GSE', function(req, res) {
  res.send(req.params);
});

app.listen(80);
