require 'optparse'
require 'premailer'

premailer = nil

options = {
  :base_url => nil,
  :link_query_string => nil,
  :remove_classes => false,
  :verbose => false,
  :line_length => 65
}

file_in = nil
file_out_html = nil
file_out_txt = nil



opts = OptionParser.new do |opts|
  opts.banner = "Improve the rendering of HTML emails by making CSS inline among other things. Takes a path to a local file, a URL or a pipe as input.\n\n"
  opts.define_head "Usage: premailer <optional uri|optional path> [options]"
  opts.separator ""
  opts.separator "Examples:"
  opts.separator "  premailer http://example.com/ > out.html"
  opts.separator "  premailer http://example.com/ --mode txt > out.txt"
  opts.separator "  cat input.html | premailer -q src=email > out.html"
  opts.separator "  premailer ./public/index.html"
  opts.separator ""
  opts.separator "Options:"

  opts.on("-b", "--base-url STRING", String, "Base URL, useful for local files") do |v|
    options[:base_url] = v
  end

  opts.on("-q", "--query-string STRING", String, "Query string to append to links") do |v|
    options[:link_query_string] = v
  end

  opts.on("--css FILE,FILE", Array, "Additional CSS stylesheets") do |v|
    options[:css] = v
  end

  opts.on("-r", "--remove-classes", "Remove HTML classes") do |v|
    options[:remove_classes] = v
  end

  opts.on("-l", "--line-length N", Integer, "Line length for plaintext (default: #{options[:line_length].to_s})") do |v|
    options[:line_length] = v
  end

  opts.on("-d", "--io-exceptions", "Abort on I/O errors") do |v|
    options[:io_exceptions] = v
  end

  opts.on("--file-in STRING", String, "Remove HTML classes") do |v|
    file_in = v
  end
  opts.on("--file-out-html STRING", String, "Remove HTML classes") do |v|
    file_out_html = v
  end
  opts.on("--file-out-txt STRING", String, "Remove HTML classes") do |v|
    file_out_txt = v
  end
end
opts.parse!


if file_in
  premailer = Premailer.new(file_in, options)
else
  puts opts
  exit 1
end

if file_out_txt
	# Write the plain-text output
	fout = File.open(file_out_txt, "wb")
	fout.puts premailer.to_plain_text
	fout.close
end

if file_out_html
	# Write the HTML output
	fout = File.open(file_out_html, "wb")
	fout.puts premailer.to_inline_css
	fout.close
end

premailer.warnings.each do |w|
  puts "#{w[:message]} (#{w[:level]}) may not render properly in #{w[:clients]}"
end

exit
