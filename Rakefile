
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
  mkdir_p 'tmp'
  cp Dir['./../wikimate/public/javascripts/plugins/paragraph.js'], './tmp/'
  cp Dir['./../wikimate/public/javascripts/wikimate.js'], './tmp/'
  cp Dir['./chrome/*'], './tmp/'
  cp Dir['./js/*'], './tmp/'
end

task :clean do
  rm_rf 'tmp'
end
