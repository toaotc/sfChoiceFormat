{exec} = require 'child_process'

std = (err, stdout, stderr) ->
  throw err if err
  console.log stdout + stderr

task 'build:all', 'build all', ->
  console.log(@description);
  exec 'coffee -cbo bin src/sfChoiceFormat.class.coffee', std
  exec 'coffee -cbo test src/sfChoiceFormat.test.coffee', std