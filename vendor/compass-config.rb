output_style = :expanded

sass_dir = "scss"
css_dir = "css"
images_dir = "images"
http_images_path = '/images/'

if environment == :production
	asset_cache_buster :none
	line_comments = false
end

Sass::Script::Number.precision = 10