publish:
	npm publish --dry-run
lint:
	npx eslint .
install:
	npm install
serve:
	npx webpack serve
fix:
	npx eslint . --fix