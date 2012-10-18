#environment = :development --> this is default!
#environment = :production

#wp_theme_folder = File.basename(__FILE__).match(/^compass-([^\.]+)/)[1]
output_style = :expanded
#project_path = File.expand_path( File.join(File.dirname(__FILE__), '..', 'src') )

sass_dir = "scss"
css_dir = "css"
#css_path = "css"
images_dir = "images"
http_images_path = '/images/'

if environment == :production
	asset_cache_buster :none
	line_comments = false
end

#if environment != :production
#    sass_options = {:debug_info => true}
#end

Sass::Script::Number.precision = 10