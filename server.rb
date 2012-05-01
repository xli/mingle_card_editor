require 'rubygems'
require 'rack'
Rack::Server.start(
 :app => lambda do |env|
   ext = env['PATH_INFO'].split('.').last
   content = File.read(File.join(File.dirname(__FILE__), env['PATH_INFO']))
   [200, {'Content-Type' => Rack::Mime.mime_type(".#{ext}"), 'Content-Length' => content.length.to_s}, [content]]
 end,
 :Port => 7777,
 :server => 'webrick'
)
