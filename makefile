arranca_servidor ::
	python3 -m http.server
find_all_references_to_Pages ::
# 	find all files with pattern "" recursively
	grep -rl "Pages/" ./*

replace_all_references_to_Pages ::
	find . -type f ! -name 'makefile' -exec sed -i 's/Pages\///g' {} +
# 	echo Borra tambien lo del makefile. Osea, la corrompe
# 	sed -i 's/Pages\///g' $$(grep -rl "" ./*)

replace_slash_in_Css ::
	find . -type f -exec sed -i 's/\css/css/g' {} +


