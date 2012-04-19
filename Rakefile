
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

task :c do
  `jison jison/wiki_parser.jison -o js/wiki_parser.js`
end


task :chrome => :clean do
  mkdir_p 'mingle_card_editor'
  cp Dir['./../wikimate/dist/wikimate-min.js'], './mingle_card_editor/'
  cp Dir['./../wikimate/src/css/wikimate.css'], './mingle_card_editor/'
  cp Dir['./chrome/*'], './mingle_card_editor/'
  cp Dir['./js/*'], './mingle_card_editor/'
end

task :clean do
  rm_rf 'mingle_card_editor'
end

task :default => :chrome
