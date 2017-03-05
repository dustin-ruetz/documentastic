# documentastic

A Markdown-to-HTML documentation generator that is feature-rich, customizable, lightweight, and platform-agnostic.

This tool was developed with the intention of being used locally, i.e. `md-docs/*.md` files compile to `html-docs/*.html` files, the latter of which can be viewed locally in any browser regardless of device. If you want to see an example of the input/output or learn more about Markdown, open the `md-docs/markdown.md` and `html-docs/markdown.html` files and compare them.

My personal use-case employs [Resilio Sync][resilio-sync] to synchronize the contents of `html-docs/` to my phone, which ensures I always have access to my documentation on my two primary computing platforms.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Purpose](#purpose)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

Documentation is an invaluable tool in development (and, as I have found, also in life). The goal of this project is as follows:

1. To use the elegant simplicity of Markdown to write maintainable, well-formatted documentation;
1. To dynamically generate a table-of-contents (TOC) from the document's headings;
1. To compile the Markdown file into a responsive, spec-compliant, platform-agnostic HTML document; and
1. If desired, to be able to print out documentation and have it be well-formed.

## Installation

1. Prerequisite: Have [Node.js][node-js] installed.
1. Download a clone/copy of this repository.
1. Open a terminal window at the root of the repository.
1. Run `npm install` to download all dependencies.

## Usage

1. Make a copy of `md-docs/template.md` and rename it.
1. Run the `gulp` command to start the tasks.
1. Open the new file and document until your heart is content.

## Features

* **Lightweight**: All features are written in vanilla JavaScript and run server-side via the `gulp` task. The only JavaScript that runs client-side is jquery-smooth-scroll and prism.js (see below for more details).
* **Efficient**: Only the documentation files that have been modified are run through the task. Courtesy of [gulp-changed][gulp-changed].
* **Table of Contents**: Manually trying to maintain TOCs is a headache. This is why Documentastic uses [gulp-doctoc][gulp-doctoc] to automatically generate a dynamic TOC for you based on the structure of your document's headings.
* **Easy to Read, Easy to Write**: Reading and writing in Markdown couldn't be simpler... as long as you're at a computer. If you're on a mobile device, why should you download yet _another_ app just to read Markdown files? Documentastic uses [gulp-marked][gulp-marked] to take your Markdown files and create platform-agnostic HTML documents from them so that they can be read in any browser.
* **Function or Form - Why Not Both?**: For best browser compatibility and to avoid nasty surprises, HTML documents should be well-formed and comply with the W3C specification.
	* Documentastic keeps your working Markdown file clean _and_ your compiled HTML document compliant by using [gulp-inject][gulp-inject] to inject HTML code partials containing the required `<doctype>`, `<html>`, `<head>`, and `<body>` elements.
	* If you want to review the compiled HTML document's code directly, [gulp-prettify][gulp-prettify] has got you covered with proper line breaks and indentation.
* **DOM Manipulation**: Documentastic uses [gulp-dom][gulp-dom] to:
	* Set a `title` for all documents;
	* Set attributes on external links; and
	* Convert Markdown checkboxes into HTML `<input type="checkbox">` elements.
* **Platform-Agnostic**: Free yourself from the chains of platform dependency and vendor lock-in. As long as you have a browser, you can read your documents.
* **Responsive**: Documents are responsive and will scale gracefully according to device screen size.
* **Stylin'**: CSS styling courtesy of the [GitHub Markdown Stylesheet][gh-md-ss].
* **Smooth Moves**: Smooth-scrolling is added to all internal links (i.e. everything in the document's TOC) courtesy of [jquery-smooth-scroll][jq-ss].
* **Syntax Highlighting**: Code syntax highlighting courtesy of [prism.js][prism].
* **Printer-Friendly**: Documents are printer-friendly by default.

## License

[MIT License][mit-license]

Copyright 2017 Dustin Ruetz.

[resilio-sync]: https://www.resilio.com/individuals

[node-js]: https://nodejs.org/en

[gulp-changed]: https://www.npmjs.com/package/gulp-changed
[gulp-doctoc]: https://www.npmjs.com/package/gulp-doctoc
[gulp-marked]: https://www.npmjs.com/package/gulp-marked
[gulp-inject]: https://www.npmjs.com/package/gulp-inject
[gulp-prettify]: https://www.npmjs.com/package/gulp-prettify
[gulp-dom]: https://www.npmjs.com/package/gulp-dom
[gh-md-ss]: https://gist.github.com/tuzz/3331384
[jq-ss]: https://github.com/kswedberg/jquery-smooth-scroll
[prism]: https://github.com/PrismJS/prism

[mit-license]: https://opensource.org/licenses/MIT