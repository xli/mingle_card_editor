
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

task :bookmarklet => :clean do
  version = '1.0'
  mkdir_p 'card_editor'
  mkdir_p 'card_editor/css'
  File.open("./card_editor/card_editor-#{version}.js", 'w') do |io|
    io.write(File.read('lib/jquery-1.7.2.js'))
    io.write(File.read('lib/jquery-ui-1.8.18.custom.min.js'))
    io.write(File.read('lib/underscore-1.3.1.js'))
    io.write(File.read('lib/diff.js'))
    io.write(File.read('./../wikimate/dist/wikimate.js'))
    io.write(File.read('src/js/wiki_parser.js'))
    io.write(File.read('src/js/wikimate_plugins.js'))
    io.write(File.read('src/js/card_editor.js'))
  end

  cp_r './lib/tiny_mce_3_4_9', './card_editor/'
  cp_r './src/images', './card_editor/'
  cp './src/js/loader.js', "./card_editor/loader.js"
  cp './../wikimate/src/css/wikimate.css', "./card_editor/css/wikimate-#{version}.css"
  cp './src/css/style.css', "./card_editor/css/style-#{version}.css"
  cp './bookmarklet/index.html', './card_editor/'
  puts "uglifyjs..."
  %x[uglifyjs ./card_editor/card_editor-#{version}.js > ./card_editor/card_editor-#{version}.min.js]
end

task :clean do
  rm_rf 'card_editor'
end

task :default => :bookmarklet
