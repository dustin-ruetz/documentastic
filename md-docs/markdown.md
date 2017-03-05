<!-- inject:p1-top:html -->
<!-- endinject -->

# Markdown

Notes on using Markdown.

<!-- START doctoc -->
<!-- END doctoc -->

## Resources

* [Mastering Markdown][mastering-markdown] video series by Wes Bos.

## Syntax

* Markdown uses its own syntax that allows users to write simplified HTML.
* Markdown files, when parsed or opened in a Markdown viewer, are compiled into valid HTML.

### Headings

Use one hashtag for an `<h1>`, followed by the heading text.

	# This will render as an <h1> heading.

Use two hashtags for an `<h2>`, followed by the heading text, etc.

### Paragraphs

Simply type the paragraph text - no special characters needed.

Paragraphs must be separated by one blank line, otherwise they will be rendered on the same line.

	This is the first paragraph.
	
	This is the second paragraph.

### Styling Text

#### Bold

Text wrapped with two asterisks on either side will be bolded.

Alternatively, text wrapped with two underscores on either side will also be bolded.

	This will render **bold** text.
	
	This will also render __bold__ text.

#### Italic

Text wrapped with underscores on either side will be italicized.

Alternatively, text wrapped with asterisks on either side will also be italicized.

	This will render _italicized_ text.
	
	This will also render *italicized* text.

#### Strikethrough

Text wrapped with two tildes on either side will render as strikethrough text.

	This will render as ~~strikethrough~~ text.

### Links

There are four ways to use links in Markdown.

(1) Wrap the URL with angle brackets.

	<https://github.com>

(2) Wrap the link text in square brackets and the URL in parentheses.

	Go to [GitHub.com](https://github.com) to learn more.

(3) To include a title/tooltip that will display when the user hovers over the link, use the above example's syntax and add the title in quotes.
	
	Go to [GitHub.com](https://github.com "Click to go the GitHub homepage") to learn more.

(4) To keep the text as readable as possible, use the "link/reference" method: place the link inline and reference its location at the bottom of the document. This method also has the advantage of being able to reference the same link in multiple places.

```
Visit the world's [first website][first-website], created by Tim Berners-Lee.

... (rest of document) ...

[first-website]: http://info.cern.ch/hypertext/WWW/TheProject.html
```

### Images

Images are indicated with an exclamation mark, alternate text is placed in square brackets, the path/URL is placed in parentheses, and finally a title/tooltip can be included in quotes.

	![Alternate text for the image](path/to/image.png "Title text for the image")

Alternatively, images can be used in a similar way to the "link/reference" method.

```
## Gallery

![Alternate text for the image][img-1]

... (rest of document) ...

[img-1]: https://github.com/images/logo.png
```

### Lists

#### Unordered Lists

Unordered lists are produced by using the asterisk, hyphen, or plus sign characters. All will be rendered as bullet points.

	Asterisk bullet points
	* Item 1
	* Item 2
	* Item 3

	Hyphen bullet points
	- Item 1
	- Item 2
	- Item 3

	Plus Sign bullet points
	+ Item 1
	+ Item 2
	+ Item 3

#### Ordered Lists

Each ordered list item should be preceded by `1.` so that they will be numbered correctly when compiled.

For example, this input:

	1. Number One
	1. Number Two
	1. Number Three

Will produce this output:

1. Number One
1. Number Two
1. Number Three

#### Nested Lists

Add sub-items to list items using tab indentation.

	1. Go to the store.
		* Buy milk.
		* Buy bread.
	1. Go home.

#### Advanced Nesting

Additional elements (paragraphs, images, links, etc.) can be included in list items by using line breaks and tab indentation.

```
1. Create a new HTML file.
	* Include the following content:

		This is a paragraph.

		![Alternate text for the image](path/to/image.png)

		[Link to full image](http://example.com/image.png)

	* Save and close the file.

1. Create a new CSS file.
```

### Horizontal Rule

Use three hyphens to create a horizontal rule. Ensure that there are blank line breaks above and beneath, otherwise Markdown will render a heading.

```
## First section

---

## Second section

---

## Third section
```

### Blockquotes

Create a single-line blockquote using the right-pointing angle bracket (>).

	> A single-line blockquote. ~~ William Shakespeare

Create a multi-line blockquote by starting each line with angle brackets.

	> A multi-line blockquote.
	> 
	> ~~ Socrates

### Code Blocks and Syntax Highlighting

There are three ways to indicate code, and a `diff` feature for highlighting code changes.

(1) Indent the code block.

	var x = 1;
	var y = x + 1;

(2) Begin the code block with three backticks and the name of the language, write the lines of code, and then end with three more backticks. **Note**: The name of the language is not required.

	```js
		var person = {
			name: "Jimi Hendrix",
			age: 27
		};
	```

(3) If writing inline code, wrap it in backticks.

	This `<p>` will be formatted as code.

(4) The `diff` feature is used to visually indicate changes.
* Lines beginning with a plus sign (+) will be rendered as green additions.
* Lines beginning with a minus sign (-) will be rendered as red deletions.

		```diff
			var x = 100;
			+ var y = 200;
			- var y = 300;
		```

### Non-standard Features

Both tables and checkboxes are not included in the official Markdown specification, however many parsers/readers do support them.

#### Tables

* Columns are indicated by using the pipe character (|).
* Rows are indicated by each line wrapped in pipe characters.
* The second line of the table controls the column's text alignment.

	```
	| Col1 Heading   | Col2 Heading |    Col3 Heading |
	|:---------------|:------------:|----------------:|
	| Left-aligned   |   Centered   |   Right-aligned |
	```

#### Checkboxes

Checkboxes are added by using a list item along with a set of square brackets containing a space.

To check off a list item, place an "x" inside of the square brackets.

```
* [ ] Task 1
* [ ] Task 2
* [x] Task 3
```

[mastering-markdown]: http://masteringmarkdown.com

<!-- inject:p2-bottom:html -->
<!-- endinject -->