"use strict";

/*
    gulp module and descriptions of required packages
    - changed : only process modified files
    - doctoc  : automatic TOC generation
    - marked  : Markdown to HTML converter
    - prism   : process markup for code syntax highlighting
    - inject  : injection of code partials
    - dom     : run DOM operations on inbound HTML
    - htmlmin : minify HTML code
*/
const gulp    = require("gulp"),
      changed = require("gulp-changed"),
      doctoc  = require("gulp-doctoc"),
      marked  = require("gulp-marked"),
      prism   = require("prismjs"),
      inject  = require("gulp-inject"),
      dom     = require("gulp-dom"),
      htmlmin = require("gulp-htmlmin");

// documentastic application (docApp) object
const docApp = {
    // config object to translate marked languages to prism
    prismLangs: {
        html     : "markup",
        markdown : "markup",
        scss     : "css",
        js       : "javascript",
        json     : "javascript"
    },
    // function to inject code partials
    injectCode: (partial) => {
        return inject(gulp.src([`partials/${partial}.html`]), {
            // starttag specifies the point of code injection
            starttag: `<!-- inject:${partial}:{{ext}} -->`,
            // remove injection tags from HTML file after injection is complete
            removeTags: true,
            transform: (filepath, file) => file.contents.toString("utf8")
        });
    }
};

// default tasks to run on "gulp" command
const tasks = [
    "documentastic",
    "readmeTOC",
    "watch"
];
gulp.task("default", tasks);

// documentastic task
// 1) source      : MD files from md-docs/ pipe into...
// 2) changed     : monitors HTML files from html-docs/ and only the modified files are piped into...
// 3) doctoc      : generates TOC, then pipes into...
// 4) marked      : converts MD to HTML and uses prism for code syntax highlighting, then pipes into...
// 5) inject (1)  : inject code into top of HTML document, then pipes into...
// 6) inject (2)  : inject code into bottom of HTML document, then pipes into...
// 7) dom         : manipulate HTML elements (see below for full details), then pipes into...
// 8) htmlmin     : minifies HTML document, then pipes into...
// 9) destination : html-docs/ which contains compiled HTML files
gulp.task("documentastic", () => {
    return gulp
        .src("md-docs/*.md")
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
                code: function (code, lang, escaped) {
                    code = this.options.highlight(code, lang);

                    if (!lang) {
                        return `<pre><code>${code}</code></pre>`;
                    }

                    let langClass = this.options.langPrefix + lang;

                    return `<pre class="${langClass}"><code class="${langClass}">${code}</code></pre>`;
                }
            },
            highlight: (code, lang) => {
                if (!prism.languages.hasOwnProperty(lang)) {
                    lang = docApp.prismLangs[lang] || "markup"; // default to markup
                }

                return prism.highlight(code, prism.languages[lang]);
            }
        }))
        .pipe(docApp.injectCode("p1-top"))
        .pipe(docApp.injectCode("p2-bottom"))
        .pipe(dom(function () {
            // note: in gulp-dom, this = document

            const doc = {
                // helper methods for querySelector and querySelectorAll functions
                dqs  : (query) => this.querySelector(query),
                dqsa : (query) => this.querySelectorAll(query),

                getArrayFromObject: (arr, obj) => {
                    return doc[arr.name] = Object.keys(obj).map(key => obj[key]);
                },

                // define checked and unchecked elements in Markdown and HTML
                checked: {
                    md   : "[x]",
                    html : "<input type='checkbox' checked='checked'>"
                },
                unchecked: {
                    md   : "[ ]",
                    html : "<input type='checkbox'>"
                }
            };

            // use h1 to set document title
            doc.h1Title = doc.dqs("h1").textContent;
            doc.dqs("head title").textContent = doc.h1Title;

            // store all external links (href attribute does not begin
            // with a hashtag) and set attributes for each one
            doc.extLinksObj = doc.dqsa("a:not([href^='#'])");
            doc.extLinksArr = [];
            doc.extLinksArr.name = "extLinksArr";
            doc.getArrayFromObject(doc.extLinksArr, doc.extLinksObj);
            doc.extLinksArr.forEach((extLink) => {
                extLink.setAttribute("target", "_blank");
                extLink.setAttribute("rel", "noopener noreferrer");
            });

            // replace all MD checkboxes - [ ] and [x] -
            // with corresponding HTML <input> elements

            // store all <li> elements in an array
            doc.liObj = doc.dqsa("li");
            doc.liArr = [];
            doc.liArr.name = "liArr";
            doc.getArrayFromObject(doc.liArr, doc.liObj);

            // filter out <li> elements containing "[ ]"
            doc.listItemsUnchecked = doc.liArr.filter((listItem) => {
                return listItem.textContent.includes(doc.unchecked.md);
            });

            // filter out <li> elements containing "[x]"
            doc.listItemsChecked = doc.liArr.filter((listItem) => {
                // if required, change all uppercase "X" to lowercase "x"
                if (listItem.textContent.includes("[X]")) {
                    let lowercase = listItem.textContent.replace("[X]", "[x]");
                    listItem.textContent = lowercase;
                };

                return listItem.textContent.includes(doc.checked.md);
            });

            // method to replace MD checkboxes with HTML <input> elements
            doc.processCheckboxes = (el, mdEl, htmlEl) => {
                return doc.replacedElement = el.innerHTML.replace(mdEl, htmlEl);
            };

            // replace unchecked elements
            doc.listItemsUnchecked.forEach((listItem) => {
                doc.processCheckboxes(listItem, doc.unchecked.md, doc.unchecked.html);
                listItem.innerHTML = doc.replacedElement;
            });

            // replace checked elements
            doc.listItemsChecked.forEach((listItem) => {
                doc.processCheckboxes(listItem, doc.checked.md, doc.checked.html);
                listItem.innerHTML = doc.replacedElement;
            });

            return this;
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true
        }))
        .pipe(gulp.dest("html-docs/"));
});

// readmeTOC task
// 1) source      : readme.md file pipes into...
// 2) doctoc      : generates TOC, then pipes into...
// 3) destination : same as source (readme.md contents are automatically overwritten/updated)
gulp.task("readmeTOC", () => {
    return gulp
        .src("readme.md")
        .pipe(doctoc())
        .pipe(gulp.dest(""));
});

// watch task
gulp.task("watch", () => {
    // files to watch and tasks to run
    gulp.watch("md-docs/*.md", ["documentastic"]);
    gulp.watch("readme.md", ["readmeTOC"]);
});