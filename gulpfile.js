"use strict";

// required packages
const gulp = require("gulp"),
		changed = require("gulp-changed"), // build tool - only process modified files
		doctoc = require("gulp-doctoc"), // markup - automatic TOC generation
		marked = require("gulp-marked"), // markup - MD to HTML converter
		prism = require("prismjs"), // markup - process markup for code syntax highlighting
		inject = require("gulp-inject"), // markup - injection of code partials
		dom = require("gulp-dom"), // build tool - run DOM operations on inbound HTML
		prettify = require("gulp-prettify"); // markup - proper indentation and line breaks for HTML

// translate marked languages to prism
const prismLangs = {
	html: "markup",
	markdown: "markup",
	scss: "css",
	js: "javascript"
};

// default tasks to run on "gulp" command
gulp.task("default",
	[
		"documentastic",
		"readmeTOC",
		"watch"
	]
);

// documentastic task
// 1) source: MD files from md-docs/ pipe into...
// 2) changed: monitors HTML files from html-docs/ and only the modified files are piped into...
// 3) doctoc: generates TOC, then pipes into...
// 4) marked: converts MD to HTML and uses prism for code syntax highlighting, then pipes into...
// 5) inject (1 of 2): injects code into top of HTML document, then pipes into...
// 6) inject (2 of 2): injects code into bottom of HTML document, then pipes into...
// 7) dom: manipulate HTML elements (see below for full details), then pipes into...
// 7) prettify: adds automatic indentation to HTML document, then pipes into...
// 8) destination: html-docs/ which contains compiled HTML files
gulp.task("documentastic", () => {
	return gulp.src("md-docs/*.md")
		// note: after making a change to one of the injected .html partial files,
		// comment-out "changed" pipe (below), then run the default "gulp" task
		// in order to update all of your files at once
		.pipe(changed("html-docs/", {
			extension: ".html"
		}))
		.pipe(doctoc())
		.pipe(marked({
			langPrefix: "language-",
			renderer: {
				// modify output of code method to match what prism expects
				code: function(code, lang, escaped) {
					code = this.options.highlight(code, lang);

					if(!lang) {
						return `<pre><code>${code}</code></pre>`;
					}

					let langClass = this.options.langPrefix + lang;

					return `<pre class="${langClass}"><code class="${langClass}">${code}</code></pre>`;
				}
			},
			highlight: (code, lang) => {
				if(!prism.languages.hasOwnProperty(lang)) {
					lang = prismLangs[lang] || "markup"; // default to markup
				}

				return prism.highlight(code, prism.languages[lang]);
			}
		}))
		.pipe(inject(gulp.src(["partials/p1-top.html"]), {
			starttag: "<!-- inject:p1-top:{{ext}} -->", // tag specifying point of injection
			removeTags: true, // removes injection tags from HTML file after injection is complete
			transform: (filePath, file) => {
				return file.contents.toString("utf8")
			}
		}))
		.pipe(inject(gulp.src(["partials/p2-bottom.html"]), {
			starttag: "<!-- inject:p2-bottom:{{ext}} -->",
			removeTags: true,
			transform: (filePath, file) => {
				return file.contents.toString("utf8")
			}
		}))
		.pipe(dom(function() {
			// note: in gulp-dom, this = document
			// note: docApp is short for documentasticApplication
			const docApp = {
				getArrayFromObject: (arr, obj) => {
					return docApp[arr.name] = Object.keys(obj).map(key => obj[key]);
				},
				
				mdUnchecked: "[ ]",
				htmlUnchecked: `<input type="checkbox">`,
				mdChecked: "[x]",
				htmlChecked: `<input type="checkbox" checked="checked">`
			};

			// use h1 to set document title
			docApp.h1Title = this.querySelector("h1").textContent;
			this.querySelector("head title").textContent = docApp.h1Title;

			// store all external links (href attribute does not begin with a hashtag)
			// and set attributes for each one
			docApp.extLinksObj = this.querySelectorAll("a:not([href^='#'])");
			docApp.extLinksArr = [];
			docApp.extLinksArr.name = "extLinksArr";
			docApp.getArrayFromObject(docApp.extLinksArr, docApp.extLinksObj);
			docApp.extLinksArr.forEach((extLink) => {
				extLink.setAttribute("target", "_blank");
				extLink.setAttribute("rel", "noopener noreferrer");
			});

			// replace all MD checkboxes - [ ] and [x] -
			// with corresponding HTML <input> elements
			docApp.liObj = this.querySelectorAll("li");
			docApp.liArr = [];
			docApp.liArr.name = "liArr";
			docApp.getArrayFromObject(docApp.liArr, docApp.liObj);
			
			// filter out <li> elements containing "[ ]"
			docApp.listItemsUnchecked = docApp.liArr.filter((listItem) => {
				return listItem.textContent.includes(docApp.mdUnchecked);
			});

			// filter out <li> elements containing "[x]"
			docApp.listItemsChecked = docApp.liArr.filter((listItem) => {
				// if required, change all instances of uppercase "X" to lowercase "x"
				if(listItem.textContent.includes("[X]")) {
					let lowercase = listItem.textContent.replace("[X]", "[x]");
					listItem.textContent = lowercase;
				};
				return listItem.textContent.includes(docApp.mdChecked);
			});

			// method to replace MD checkboxes with HTML <input> elements
			docApp.processCheckboxes = (element, mdElement, htmlElement) => {
				return docApp.replacedElement = element.innerHTML.replace(mdElement, htmlElement);
			};

			docApp.listItemsUnchecked.forEach((listItem) => { // replace unchecked
				docApp.processCheckboxes(listItem, docApp.mdUnchecked, docApp.htmlUnchecked);
				listItem.innerHTML = docApp.replacedElement;
			});

			docApp.listItemsChecked.forEach((listItem) => { // replace checked
				docApp.processCheckboxes(listItem, docApp.mdChecked, docApp.htmlChecked);
				listItem.innerHTML = docApp.replacedElement;
			});

			return this;
		}))
		.pipe(prettify({
			indent_with_tabs: true,
			indent_size: 3,
			preserve_newlines: true
		}))
		.pipe(gulp.dest("html-docs/"));
});

// readmeTOC task
// 1) source: readme.md file pipes into...
// 2) doctoc: generates TOC, then pipes into...
// 3) destination: same as source (readme.md contents are automatically overwritten/updated)
gulp.task("readmeTOC", () => {
	return gulp.src("readme.md")
		.pipe(doctoc())
		.pipe(gulp.dest(""));
});

// watch task
// files to watch and tasks to run
gulp.task("watch", () => {
	gulp.watch("md-docs/*.md", ["documentastic"]);
	gulp.watch("readme.md", ["readmeTOC"]);
});