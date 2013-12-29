output_style = :expanded

sass_dir = "src/scss"
#css_dir = "src/css"
#images_dir = "src/images"
http_images_path = '/images/'
#Place a common cache folder in the project root
cache_path = File.expand_path(File.join(Compass.configuration.project_path, '.sass-cache'))

if environment == :production
	asset_cache_buster :none
	line_comments = false
end

Sass::Script::Number.precision = 10
