
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

task :bookmarklet => :clean do
  version = '2.6'
  mkdir_p 'card_editor'
  File.open("./card_editor/card_editor-#{version}.js", 'w') do |io|
    io.write(File.read('lib/jquery-1.7.2.js'))
    io.write(File.read('lib/jquery-ui-1.8.18.custom.min.js'))
    io.write(File.read('lib/underscore-1.3.1.js'))
    io.write(File.read('lib/wikimate-0.1.js'))
    io.write(File.read('lib/diff.js'))
    io.write(File.read('src/js/wiki_parser.js'))
    io.write(File.read('src/js/wikimate_plugins.js'))
    io.write(File.read('src/js/mingle_textile_editor.js'))
    io.write(File.read('src/js/card_editor.js'))
  end

  cp_r './src/images', './card_editor/'
  cp_r './lib/css', './card_editor/'
  cp './src/js/loader.js', "./card_editor/loader.js"
  cp './src/css/style.css', "./card_editor/css/style-#{version}.css"
  cp './bookmarklet/index.html', './card_editor/'
  cp './chrome/icon.png', './card_editor/'
  cp './chrome/manifest.json', './card_editor/'
  cp './chrome/cloader.js', './card_editor/'
  puts "uglifyjs..."
  %x[uglifyjs ./card_editor/card_editor-#{version}.js > ./card_editor/card_editor-#{version}.min.js]
end

task :clean do
  rm_rf 'card_editor'
end

task :default => :bookmarklet
